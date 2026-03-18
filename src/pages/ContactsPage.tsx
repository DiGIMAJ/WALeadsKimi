import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, deleteDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Search,
  Trash2,
  Copy,
  FileSpreadsheet,
  Smartphone,
  FileText,
  Crown,
  Loader2,
} from 'lucide-react';
import type { Contact } from '@/types';
import * as XLSX from 'xlsx';

export default function ContactsPage() {
  const { user, refreshUser } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'country'>('date');
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchContacts = async () => {
    if (!user) return;
    
    try {
      const q = query(
        collection(db, 'users', user.uid, 'contacts'),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const fetchedContacts: Contact[] = [];
      
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fetchedContacts.push({
          id: docSnap.id,
          number: data.number,
          country: data.country,
          flag: data.flag,
          tag: data.tag || '',
          notes: data.notes || '',
          name: data.name || '',
          isFavorite: data.isFavorite || false,
          group: data.group || '',
          sourceFile: data.sourceFile,
          extractionId: data.extractionId,
          createdAt: data.createdAt?.toDate(),
        } as Contact);
      });
      
      setContacts(fetchedContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = useMemo(() => {
    let result = [...contacts];
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.number.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q) ||
          c.tag.toLowerCase().includes(q) ||
          (c.name && c.name.toLowerCase().includes(q))
      );
    }
    
    if (countryFilter !== 'all') {
      result = result.filter((c) => c.country === countryFilter);
    }
    
    if (sortBy === 'date') {
      result.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    } else {
      result.sort((a, b) => a.country.localeCompare(b.country));
    }
    
    return result;
  }, [contacts, searchQuery, countryFilter, sortBy]);

  const countries = useMemo(() => {
    const countryMap = new Map<string, number>();
    contacts.forEach((c) => {
      countryMap.set(c.country, (countryMap.get(c.country) || 0) + 1);
    });
    return Array.from(countryMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [contacts]);

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedContacts(newSelected);
  };

  const toggleAll = () => {
    if (selectedContacts.size === filteredContacts.length) {
      setSelectedContacts(new Set());
    } else {
      setSelectedContacts(new Set(filteredContacts.map((c) => c.id)));
    }
  };

  const deleteSelected = async () => {
    if (!user || selectedContacts.size === 0) return;
    
    if (!confirm(`Delete ${selectedContacts.size} contacts?`)) return;
    
    try {
      for (const id of selectedContacts) {
        await deleteDoc(doc(db, 'users', user.uid, 'contacts', id));
      }
      
      toast.success(`Deleted ${selectedContacts.size} contacts`);
      setSelectedContacts(new Set());
      fetchContacts();
    } catch {
      toast.error('Failed to delete contacts');
    }
  };

  const copyNumber = (number: string) => {
    navigator.clipboard.writeText(number);
    toast.success('Copied to clipboard!');
  };

  const updateTag = async (id: string, tag: string) => {
    if (!user) return;
    
    try {
      await updateDoc(doc(db, 'users', user.uid, 'contacts', id), { tag });
      setContacts(contacts.map((c) => (c.id === id ? { ...c, tag } : c)));
    } catch {
      toast.error('Failed to update tag');
    }
  };

  const exportCSV = () => {
    const dataToExport = selectedContacts.size > 0
      ? contacts.filter((c) => selectedContacts.has(c.id))
      : contacts;
    
    const csv = [
      ['Number', 'Country', 'Name', 'Tag', 'Date Added', 'Source File'].join(','),
      ...dataToExport.map((c) => [
        c.number,
        c.country,
        `"${c.name || ''}"`,
        `"${c.tag}"`,
        c.createdAt?.toLocaleDateString(),
        c.sourceFile,
      ].join(',')),
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waleads-contacts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('CSV exported successfully!');
  };

  const exportVCF = async () => {
    if (!user) return;

    setExporting(true);
    
    try {
      const dataToExport = selectedContacts.size > 0
        ? contacts.filter((c) => selectedContacts.has(c.id))
        : contacts;
      
      let vcf = '';
      for (const contact of dataToExport) {
        const cleanNumber = contact.number.replace(/\s/g, '');
        const displayName = contact.name || contact.tag || `WALeads Contact ${cleanNumber}`;
        vcf += `BEGIN:VCARD\n`;
        vcf += `VERSION:3.0\n`;
        vcf += `FN:${displayName}\n`;
        vcf += `TEL;TYPE=CELL:${cleanNumber}\n`;
        vcf += `NOTE:Extracted from ${contact.sourceFile} via WALeads\n`;
        if (contact.tag) {
          vcf += `CATEGORIES:${contact.tag}\n`;
        }
        vcf += `END:VCARD\n`;
      }
      
      const blob = new Blob([vcf], { type: 'text/vcard' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `waleads-contacts-${new Date().toISOString().split('T')[0]}.vcf`;
      a.click();
      URL.revokeObjectURL(url);

      // Deduct credits for free users only
      if (user.plan !== 'pro') {
        const creditsToUse = 5;
        const userRef = doc(db, 'users', user.uid);
        const monthlyRemaining = user.monthlyExports - user.exportsUsed;
        
        if (creditsToUse <= monthlyRemaining) {
          await updateDoc(userRef, { exportsUsed: increment(creditsToUse) });
        } else {
          const fromMonthly = monthlyRemaining;
          const fromTopup = creditsToUse - monthlyRemaining;
          await updateDoc(userRef, {
            exportsUsed: increment(fromMonthly),
            topupExports: increment(-fromTopup),
          });
        }
        
        await refreshUser();
        toast.success('VCF exported! 5 credits used.');
      } else {
        toast.success('VCF exported successfully!');
      }
    } catch {
      toast.error('Failed to export VCF');
    } finally {
      setExporting(false);
    }
  };

  const exportExcel = async () => {
    if (!user || user.plan !== 'pro') {
      toast.error('Excel export is a Pro feature');
      return;
    }

    setExporting(true);
    
    try {
      const dataToExport = selectedContacts.size > 0
        ? contacts.filter((c) => selectedContacts.has(c.id))
        : contacts;
      
      const data = dataToExport.map((c) => ({
        Number: c.number,
        Country: c.country,
        Name: c.name || '',
        Tag: c.tag,
        Notes: c.notes,
        'Date Added': c.createdAt?.toLocaleDateString(),
        'Source File': c.sourceFile,
      }));
      
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Contacts');
      XLSX.writeFile(wb, `waleads-contacts-${new Date().toISOString().split('T')[0]}.xlsx`);

      toast.success('Excel exported successfully!');
    } catch {
      toast.error('Failed to export Excel');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#25D366]" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Contacts</h1>
        <p className="text-gray-500">Manage and export your extracted contacts</p>
      </div>

      {/* Toolbar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by number, country, name, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-full lg:w-56">
                <SelectValue placeholder="Filter by country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries ({contacts.length})</SelectItem>
                {countries.map(([country, count]) => (
                  <SelectItem key={country} value={country}>
                    {country} ({count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'date' | 'country')}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date Added</SelectItem>
                <SelectItem value="country">Country</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={exportCSV}
              disabled={contacts.length === 0 || exporting}
            >
              <FileText className="w-4 h-4 mr-2" />
              CSV
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={exportVCF}
              disabled={contacts.length === 0 || exporting}
            >
              <Smartphone className="w-4 h-4 mr-2" />
              VCF
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={exportExcel}
              disabled={contacts.length === 0 || exporting}
              className={user?.plan !== 'pro' ? 'opacity-50' : ''}
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Excel
              {user?.plan !== 'pro' && <Crown className="w-3 h-3 ml-1 text-yellow-500" />}
            </Button>

            {selectedContacts.size > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={deleteSelected}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete ({selectedContacts.size})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table / Cards */}
      <Card>
        <CardContent className="p-0">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No contacts found</p>
              <p className="text-sm">Upload a WhatsApp export to get started</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 w-10">
                        <Checkbox
                          checked={
                            filteredContacts.length > 0 &&
                            selectedContacts.size === filteredContacts.length
                          }
                          onCheckedChange={toggleAll}
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Flag</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Number</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Country</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tag</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredContacts.map((contact) => (
                      <tr key={contact.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <Checkbox
                            checked={selectedContacts.has(contact.id)}
                            onCheckedChange={() => toggleSelection(contact.id)}
                          />
                        </td>
                        <td className="px-4 py-3">{contact.flag}</td>
                        <td className="px-4 py-3 text-sm font-medium">{contact.number}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{contact.country}</td>
                        <td className="px-4 py-3">
                          <Input
                            value={contact.tag}
                            onChange={(e) => updateTag(contact.id, e.target.value)}
                            placeholder="Add tag..."
                            className="h-8 text-sm"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {contact.createdAt?.toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => copyNumber(contact.number)}
                            className="text-gray-400 hover:text-[#25D366] p-1"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-100">
                <div className="px-4 py-3 flex items-center gap-2">
                  <Checkbox
                    checked={
                      filteredContacts.length > 0 &&
                      selectedContacts.size === filteredContacts.length
                    }
                    onCheckedChange={toggleAll}
                  />
                  <span className="text-sm text-gray-500">Select all</span>
                </div>
                {filteredContacts.map((contact) => (
                  <div key={contact.id} className="px-4 py-3 flex items-start gap-3">
                    <Checkbox
                      checked={selectedContacts.has(contact.id)}
                      onCheckedChange={() => toggleSelection(contact.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{contact.flag}</span>
                        <span className="font-medium text-sm">{contact.number}</span>
                      </div>
                      <div className="text-xs text-gray-500">{contact.country}</div>
                      {contact.tag && (
                        <span className="inline-block mt-1 text-xs bg-[#E8F8EE] text-[#25D366] px-2 py-0.5 rounded-full">
                          {contact.tag}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => copyNumber(contact.number)}
                      className="text-gray-400 hover:text-[#25D366] p-1"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Results count */}
      <p className="text-sm text-gray-500 mt-4">
        Showing {filteredContacts.length} of {contacts.length} contacts
        {selectedContacts.size > 0 && ` (${selectedContacts.size} selected)`}
      </p>
    </div>
  );
}
