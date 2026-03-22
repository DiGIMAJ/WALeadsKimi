import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

export function HollatagsButton({ phoneNumbers }: { phoneNumbers: string[] }) {
  const { toast } = useToast();
  const { user } = useAuth();

  const sendSMS = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const username = import.meta.env.VITE_HOLLATAGS_USERNAME;
      const password = import.meta.env.VITE_HOLLATAGS_PASSWORD;
      const sender = import.meta.env.VITE_HOLLATAGS_SENDER;

      if (!username || !password || !sender) {
        toast({
          title: "Error",
          description: "Hollatags credentials not configured.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("https://sms.hollatags.com/api/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa(`${username}:${password}`)}`,
        },
        body: JSON.stringify({
          to: phoneNumbers.join(","),
          message: `Hello from WALeadsKimi! Check out our tool: https://waleadskimi.vercel.app\n\nYour contacts: ${phoneNumbers.join(", ")}`,
          sender: sender,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to send SMS");
      }

      const result = await response.text();
      if (result.includes("SUCCESS")) {
        toast({
          title: "SMS Sent!",
          description: `Message delivered to ${phoneNumbers.length} contacts.`,
        });
      } else {
        throw new Error(result);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to send SMS: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={sendSMS}
      className="bg-orange-500 hover:bg-orange-600"
      disabled={!user}
    >
      Send SMS via Hollatags
    </Button>
  );
}