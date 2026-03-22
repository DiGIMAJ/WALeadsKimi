import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function HollatagsButton({ phoneNumbers }: { phoneNumbers: string[] }) {
  const { toast } = useToast();

  const sendSMS = async () => {
    try {
      const hollatagsSender = import.meta.env.VITE_HOLLATAGS_SENDER;
      if (!hollatagsSender) {
        toast({ title: "Error", description: "Hollatags sender not configured.", variant: "destructive" });
        return;
      }

      const response = await fetch("https://api.hollatags.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: phoneNumbers.join(","),
          message: "Hello from WALeadsKimi! Check out our tool: https://waleadskimi.vercel.app",
          sender: hollatagsSender,
        }),
      });

      if (!response.ok) throw new Error("Failed to send SMS");

      toast({ title: "SMS Sent!", description: "Message delivered successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to send SMS. Please try again.", variant: "destructive" });
    }
  };

  return (
    <Button onClick={sendSMS} className="bg-orange-500 hover:bg-orange-600">
      Send SMS via Hollatags
    </Button>
  );
}