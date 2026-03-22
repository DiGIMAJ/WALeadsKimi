// ... (existing ContactsPage code)
import { HollatagsButton } from "../components/HollatagsButton";

// ... (rest of ContactsPage code)

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