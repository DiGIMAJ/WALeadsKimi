import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Upload,
  FileText,
  Crown,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import type { Extraction } from '@/types';

export default function Dashboard() {
  const { user } = useAuth();
  const [recentExtractions, setRecentExtractions] = useState<Extraction[]>([]);
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalDuplicates: 0,
    totalExtractions: 0,
  });

  useEffect(() => {
    if (user) {
      fetchRecentExtractions();
      fetchStats();
    }
  }, [user]);

  const fetchRecentExtractions = async () => {
    if (!user) return;
    
    try {
      const q = query(
        collection(db, 'users', user.uid, 'extractions'),
        orderBy('createdAt', 'desc'),
        limit(user.plan === 'pro' ? 10 : 5)
      );
      
      const snapshot = await getDocs(q);
      const extractions: Extraction[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        extractions.push({
          id: doc.id,
          filename: data.filename,
          totalFound: data.totalFound,
          duplicatesRemoved: data.duplicatesRemoved,
          newContacts: data.newContacts,
          exportsConsumed: data.exportsConsumed,
          createdAt: data.createdAt?.toDate(),
        } as Extraction);
      });
      
      setRecentExtractions(extractions);
    } catch (error) {
      console.error('Error fetching extractions:', error);
    }
  };

  const fetchStats = async () => {
    if (!user) return;
    
    try {
      // Get all extractions for stats
      const extractionsQuery = query(
        collection(db, 'users', user.uid, 'extractions')
      );
      const extractionsSnap = await getDocs(extractionsQuery);
      
      let totalContacts = 0;
      let totalDuplicates = 0;
      
      extractionsSnap.forEach((doc) => {
        const data = doc.data();
        totalContacts += data.newContacts || 0;
        totalDuplicates += data.duplicatesRemoved || 0;
      });
      
      setStats({
        totalContacts,
        totalDuplicates,
        totalExtractions: extractionsSnap.size,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const monthlyProgress = user 
    ? Math.round((user.exportsUsed / user.monthlyExports) * 100) 
    : 0;

  return (
    <div className="p-4 lg:p-8 pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-gray-500 flex items-center mt-1">
          <Calendar className="w-4 h-4 mr-2" />
          {formatDate(new Date())}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Monthly Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900">
              {user ? user.monthlyExports - user.exportsUsed : 0}
            </div>
            <div className="mt-2">
              <Progress value={monthlyProgress} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">
                {user?.exportsUsed || 0} of {user?.monthlyExports || 0} used
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Top-up Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-[#25D366]">
              {user?.topupExports || 0}
            </div>
            <p className="text-xs text-gray-500 mt-2">Never expire</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900">
              {stats.totalContacts}
            </div>
            <p className="text-xs text-gray-500 mt-2">Saved to your account</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Duplicates Removed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900">
              {stats.totalDuplicates}
            </div>
            <p className="text-xs text-gray-500 mt-2">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Upload */}
      <Card className="mb-8 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Ready to extract contacts?</h3>
              <p className="text-white/80">
                Upload your WhatsApp export and get your contacts in seconds.
              </p>
            </div>
            <Link to="/app/upload">
              <Button size="lg" className="bg-white text-[#25D366] hover:bg-gray-100">
                <Upload className="w-5 h-5 mr-2" />
                Upload Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Extractions */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Extractions</CardTitle>
          <Link to="/app/upload" className="text-sm text-[#25D366] hover:underline">
            View All
          </Link>
        </CardHeader>
        <CardContent>
          {recentExtractions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No extractions yet</p>
              <p className="text-sm">Upload your first WhatsApp export to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentExtractions.map((extraction) => (
                <div
                  key={extraction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#E8F8EE] rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#25D366]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 truncate max-w-[150px] lg:max-w-xs">
                        {extraction.filename}
                      </p>
                      <p className="text-sm text-gray-500">
                        {extraction.createdAt?.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="text-right">
                      <span className="text-[#25D366] font-medium">
                        +{extraction.newContacts}
                      </span>
                      <span className="text-gray-500 ml-1">new</span>
                    </div>
                    {extraction.duplicatesRemoved > 0 && (
                      <div className="hidden sm:block text-right">
                        <span className="text-gray-400">
                          -{extraction.duplicatesRemoved}
                        </span>
                        <span className="text-gray-500 ml-1">duplicates</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upgrade Banner (Free users only) */}
      {user?.plan === 'free' && (
        <Card className="bg-[#075E54] text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#25D366] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Upgrade to Pro</h3>
                  <p className="text-gray-300 text-sm">
                    Get 7,500 exports/month, VCF & Excel exports, and priority support.
                  </p>
                </div>
              </div>
              <Link to="/app/billing">
                <Button className="bg-[#25D366] hover:bg-[#128C7E] text-white whitespace-nowrap">
                  Upgrade Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
