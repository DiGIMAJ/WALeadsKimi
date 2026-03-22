import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export function HollatagsButton({ phoneNumbers }: { phoneNumbers: string[] }) {
  const { user } = useAuth();

  const sendSMS = async () => {
    if (!user) {
      toast.error("Please log in first.");
      return;
    }

    try {
      const username = import.meta.env.VITE_HOLLATAGS_USERNAME;
      const password = import.meta.env.VITE_HOLLATAGS_PASSWORD;
      const sender = import.meta.env.VITE_HOLLATAGS_SENDER;

      if (!username || !password || !sender) {
        toast.error("Hollatags credentials not configured.");
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
        toast.success(`Message delivered to ${phoneNumbers.length} contacts.`);
      } else {
        throw new Error(result);
      }
    } catch (error) {
      toast.error(`Failed to send SMS: ${error instanceof Error ? error.message : "Unknown error"}`);
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