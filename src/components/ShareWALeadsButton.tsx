import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

export function ShareWALeadsButton({ contactId }: { contactId: string }) {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleShare = async () => {
    if (!user) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        topupExports: increment(5),
      });

      const shareUrl = `https://wa.me/?text=Check out WALeadsKimi! Export WhatsApp contacts easily: https://waleadskimi.vercel.app`;
      window.open(shareUrl, "_blank");

      toast({
        title: "🎉 5 credits added!",
        description: "Thanks for sharing WALeadsKimi!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add credits. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={handleShare} className="bg-green-500 hover:bg-green-600">
      Share WALeads & Get 5 Credits 🎁
    </Button>
  );
}