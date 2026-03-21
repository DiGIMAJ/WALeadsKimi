import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function ShareWALeadsButton({ contactId }: { contactId: string }) {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleShare = async () => {
    if (!user) {
      toast({ title: "Error", description: "Please log in first." });
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();
      const lastShared = userData?.lastSharedAt?.toDate();
      const now = new Date();
      const hoursSinceLastShare = lastShared ? (now - lastShared) / (1000 * 60 * 60) : 0;

      if (hoursSinceLastShare < 24) {
        toast({ title: "Wait a bit!", description: "You can share again in 24 hours." });
        return;
      }

      await updateDoc(doc(db, "users", user.uid), {
        topupExports: increment(5),
        lastSharedAt: now,
      });

      const shareUrl = `https://wa.me/?text=Check out WALeadsKimi! Export WhatsApp contacts easily: https://waleadskimi.vercel.app`;
      window.open(shareUrl, "_blank");

      toast({ title: "🎉 5 credits added!", description: "Thanks for sharing WALeadsKimi!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add credits. Please try again.", variant: "destructive" });
    }
  };

  return (
    <Button onClick={handleShare} className="bg-green-500 hover:bg-green-600">Share WALeads & Get 5 Credits 🎁</Button>
  );
}