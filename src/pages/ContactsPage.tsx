// ... (existing ContactsPage code)
// Add "Send to Contacts" button:
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