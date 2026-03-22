import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HollatagsButton } from "../components/HollatagsButton";

function ContactsPage() {
  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);
  const vcfContent = "VCF content here"; // Replace with actual logic

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Contacts</h1>

      <div className="flex gap-2">
        <Button
          onClick={() => {
            const vcfBlob = new Blob([vcfContent], { type: "text/vcard" });
            const vcfUrl = URL.createObjectURL(vcfBlob);
            window.open(vcfUrl, "_blank");
          }}
          className="bg-purple-500 hover:bg-purple-600"
        >
          Open in Contacts App
        </Button>
        <HollatagsButton phoneNumbers={selectedContacts.map(c => c.phone)} />
      </div>

      {/* Rest of your ContactsPage UI */}
    </div>
  );
}

export default ContactsPage;