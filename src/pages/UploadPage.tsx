import { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import JSZip from 'jszip';
import { extractPhoneNumbers, deduplicateNumbers } from '@/lib/extraction';
import {
  Upload,
  Check,
  X,
  AlertCircle,
  Copy,
  Loader2,
} from 'lucide-react';
import type { ExtractedNumber } from '@/types';

export default function UploadPage() {
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [extractedNumbers, setExtractedNumbers] = useState<ExtractedNumber[]>([]);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  const remainingExports = user 
    ? (user.monthlyExports - user.exportsUsed) + user.topupExports 
    : 0;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.zip')) {
      toast.error('Please upload a .zip file');
      return;
    }

    setCurrentFile(file);
    setProcessing(true);
    setProgress(0);
    setStatus('Reading zip file...');

    try {
      // Read the zip file
      const zipData = await file.arrayBuffer();
      setProgress(20);
      
      const zip = await JSZip.loadAsync(zipData);
      setProgress(40);
      setStatus('Finding chat file...');

      // Find the .txt file in the zip
      let txtFile: JSZip.JSZipObject | null = null;
      zip.forEach((_relativePath, zipEntry) => {
        if (zipEntry.name.endsWith('.txt') && !txtFile) {
          txtFile = zipEntry;
        }
      });

      if (!txtFile) {
        toast.error('No .txt file found in the zip');
        setProcessing(false);
        return;
      }

      setProgress(60);
      setStatus('Extracting phone numbers...');

      // Read the chat content
      const chatContent = await (txtFile as JSZip.JSZipObject).async('text');
      
      // Extract phone numbers
      const numbers = extractPhoneNumbers(chatContent);
      setProgress(80);
      setStatus('Checking for duplicates...');

      // Get existing contacts for deduplication
      const existingContacts: string[] = [];
      if (user) {
        const contactsSnap = await getDocs(collection(db, 'users', user.uid, 'contacts'));
        contactsSnap.forEach((doc) => {
          existingContacts.push(doc.data().number);
        });
      }

      // Deduplicate
      const deduplicatedNumbers = deduplicateNumbers(numbers, existingContacts);
      
      setProgress(100);
      setExtractedNumbers(deduplicatedNumbers);
      setShowPreview(true);
      setStatus('');
      
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to process file. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (user?.plan === 'free' && files.length > 1) {
        toast.error('Free plan only supports single file upload');
        return;
      }
      processFile(file);
    }
  }, [user]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleSave = async () => {
    if (!user || !currentFile) return;

    const newContacts = extractedNumbers.filter(n => !n.isDuplicate);
    const requiredExports = newContacts.length;

    if (requiredExports > remainingExports) {
      toast.error('Not enough credits. Please purchase more.');
      return;
    }

    setSaving(true);

    try {
      // Save extraction record
      const extractionRef = await addDoc(
        collection(db, 'users', user.uid, 'extractions'),
        {
          filename: currentFile.name,
          totalFound: extractedNumbers.length,
          duplicatesRemoved: extractedNumbers.filter(n => n.isDuplicate).length,
          newContacts: newContacts.length,
          exportsConsumed: requiredExports,
          createdAt: serverTimestamp(),
        }
      );

      // Save contacts
      const contactsCollection = collection(db, 'users', user.uid, 'contacts');
      for (const contact of newContacts) {
        await addDoc(contactsCollection, {
          number: contact.number,
          country: contact.country,
          flag: contact.flag,
          tag: '',
          notes: '',
          sourceFile: currentFile.name,
          extractionId: extractionRef.id,
          createdAt: serverTimestamp(),
        });
      }

      // Update user exports
      const userRef = doc(db, 'users', user.uid);
      const monthlyRemaining = user.monthlyExports - user.exportsUsed;
      
      if (requiredExports <= monthlyRemaining) {
        await updateDoc(userRef, {
          exportsUsed: increment(requiredExports),
        });
      } else {
        const fromMonthly = monthlyRemaining;
        const fromTopup = requiredExports - monthlyRemaining;
        await updateDoc(userRef, {
          exportsUsed: increment(fromMonthly),
          topupExports: increment(-fromTopup),
        });
      }

      await refreshUser();
      
      toast.success(`Saved ${newContacts.length} contacts successfully!`);
      setShowPreview(false);
      setExtractedNumbers([]);
      setCurrentFile(null);
      
    } catch (error) {
      console.error('Error saving contacts:', error);
      toast.error('Failed to save contacts');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setShowPreview(false);
    setExtractedNumbers([]);
    setCurrentFile(null);
    setProgress(0);
  };

  const copyNumber = (number: string) => {
    navigator.clipboard.writeText(number);
    toast.success('Copied to clipboard!');
  };

  const newContacts = extractedNumbers.filter(n => !n.isDuplicate);
  const duplicates = extractedNumbers.filter(n => n.isDuplicate);

  return (
    <div className="p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Upload & Extract</h1>
        <p className="text-gray-500">Upload your WhatsApp export to extract contacts</p>
      </div>

      {!showPreview ? (
        <Card>
          <CardContent className="p-6">
            {/* Upload Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 lg:p-12 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-[#25D366] bg-[#E8F8EE]'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div className="w-16 h-16 bg-[#E8F8EE] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-[#25D366]" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Drop your WhatsApp export here
              </h3>
              <p className="text-gray-500 mb-4">
                or click to browse files
              </p>
              <p className="text-sm text-gray-400">
                Accepted format: .zip files only
              </p>
              
              {user?.plan === 'free' && (
                <p className="text-sm text-[#25D366] mt-4">
                  Free plan: Single file upload only
                </p>
              )}
              {user?.plan === 'pro' && (
                <p className="text-sm text-[#25D366] mt-4">
                  Pro plan: Multiple files supported
                </p>
              )}
            </div>

            {/* Processing State */}
            {processing && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Processing...</span>
                  <span className="text-sm text-gray-500">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-gray-500 mt-2">{status}</p>
              </div>
            )}

            {/* Instructions */}
            <div className="mt-8 bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-[#25D366]" />
                How to export from WhatsApp
              </h4>
              <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                <li>Open the WhatsApp group or chat</li>
                <li>Tap the three dots menu → More → Export chat</li>
                <li>Choose "Without media"</li>
                <li>Save the .zip file and upload it here</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Extraction Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-[#E8F8EE] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#25D366]">
                  {extractedNumbers.length}
                </div>
                <div className="text-sm text-gray-600">Found</div>
              </div>
              <div className="bg-gray-100 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {duplicates.length}
                </div>
                <div className="text-sm text-gray-600">Duplicates</div>
              </div>
              <div className="bg-[#E8F8EE] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#25D366]">
                  {newContacts.length}
                </div>
                <div className="text-sm text-gray-600">New</div>
              </div>
            </div>

            {/* Cost Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-900">
                    This will use <strong>{newContacts.length}</strong> of your credits
                  </p>
                  <p className="text-xs text-blue-600">
                    You have {remainingExports} credits remaining
                  </p>
                </div>
                {newContacts.length > remainingExports && (
                  <div className="text-red-600 text-sm font-medium">
                    Insufficient credits
                  </div>
                )}
              </div>
            </div>

            {/* Preview Table */}
            <div className="border rounded-xl overflow-hidden mb-6">
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Flag</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Number</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Country</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {extractedNumbers.slice(0, 50).map((contact, index) => (
                      <tr key={index} className={contact.isDuplicate ? 'bg-gray-50' : ''}>
                        <td className="px-4 py-3">{contact.flag}</td>
                        <td className="px-4 py-3 text-sm font-medium">{contact.number}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{contact.country}</td>
                        <td className="px-4 py-3">
                          {contact.isDuplicate ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                              Duplicate
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-[#E8F8EE] text-[#25D366]">
                              <Check className="w-3 h-3 mr-1" />
                              New
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => copyNumber(contact.number)}
                            className="text-gray-400 hover:text-[#25D366]"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {extractedNumbers.length > 50 && (
                <div className="px-4 py-3 bg-gray-50 text-center text-sm text-gray-500">
                  +{extractedNumbers.length - 50} more contacts not shown in preview
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
                disabled={saving}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              
              {newContacts.length <= remainingExports ? (
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white"
                  disabled={saving || newContacts.length === 0}
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  Confirm & Save
                </Button>
              ) : (
                <Button
                  onClick={() => window.location.href = '/app/billing'}
                  className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white"
                >
                  Buy Credits
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
