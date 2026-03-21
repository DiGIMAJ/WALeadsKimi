import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

export function HollatagsButton({ phoneNumbers }: { phoneNumbers: string[] }) {
  const { user } = useAuth();
  const { toast } = useToast();

  const sendSMS = async () => {
    if (!user) {
      toast({ title: "Error", description: "Please log in first." });
      return;
    }

    try {
      const response = await fetch("https://api.hollatags.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: import.meta.env.VITE_HOLLATAGS_USERNAME,
          password: import.meta.env.VITE_HOLLATAGS_PASSWORD,
          to: phoneNumbers.join(","),
          message: "Hello from WALeadsKimi! Check out our tool: https://waleadskimi.vercel.app",
        }),
      });

      if (!response.ok) throw new Error("Failed to send SMS");
      toast({ title: "SMS Sent!", description: "Message delivered successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to send SMS.", variant: "destructive" });
    }
  };

  return (
    <Button onClick={sendSMS} className="bg-orange-500 hover:bg-orange-600">
      Send SMS via Hollatags
    </Button>
  );
}