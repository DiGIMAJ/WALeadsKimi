import { useState } from "react";
import { ShareWALeadsButton } from "../components/ShareWALeadsButton";

function UploadPage() {
  // Use state if needed, otherwise remove
  const [, _setChatText] = useState("");

  // Add group name detection logic if needed
  const detectGroupName = (text: string): string => {
    const groupNameRegex = /Subject:\s*(.*)|Group:\s*(.*)|to\s*([^:]+):/i;
    const match = text.match(groupNameRegex);
    return match ? match[1] || match[2] || match[3] || "WhatsApp Contacts" : "WhatsApp Contacts";
  };

  // Use groupName if needed
  // const groupName = detectGroupName("");

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Upload</h1>
      {/* Your upload logic here */}
      <ShareWALeadsButton />
    </div>
  );
}

export default UploadPage;