import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

interface UserWithTopupExpiry {
  plan: string;
  topupExports: number;
  topupExpiry?: { toDate: () => Date };
}

function Dashboard() {
  const { user } = useAuth();
  const [topupExpiry, setTopupExpiry] = useState<Date | null>(null);

  useEffect(() => {
    if (user) {
      const expiry = (user as UserWithTopupExpiry).topupExpiry?.toDate();
      setTopupExpiry(expiry);
    }
  }, [user]);

  const daysLeft = topupExpiry ? Math.ceil((topupExpiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {/* Show free credits badge */}
      {user?.plan === 'free' && (user as UserWithTopupExpiry).topupExports === 75 && (
        <p className="text-center text-green-500 mb-4">
          You have 75 free credits! 🎉
        </p>
      )}

      {/* Show expiry warning badge */}
      {user?.plan === 'pro' && (user as UserWithTopupExpiry).topupExpiry && daysLeft > 0 && daysLeft <= 7 && (
        <Badge variant="destructive" className="ml-2 mb-4">
          {daysLeft} days left to use your credits!
        </Badge>
      )}

      {/* Rest of your Dashboard UI */}
    </div>
  );
}

export default Dashboard;