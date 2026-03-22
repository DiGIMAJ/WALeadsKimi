import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function FreeToolPage() {
  const [chatText, setChatText] = useState("");
  const [extractedNumbers, setExtractedNumbers] = useState<string[]>([]);

  const extractNumbers = () => {
    const phoneRegex = /(\+?\d{10,15}|0\d{10})/g;
    const numbers = chatText.match(phoneRegex) || [];
    setExtractedNumbers([...new Set(numbers)]);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Free WhatsApp Number Extractor</h1>
      <div className="mb-4">
        <textarea
          placeholder="Paste your WhatsApp chat text here..."
          value={chatText}
          onChange={(e) => setChatText(e.target.value)}
          className="w-full p-2 border rounded"
          rows={10}
        />
        <Button onClick={extractNumbers} className="mt-2">
          Extract Phone Numbers
        </Button>
      </div>
      {extractedNumbers.length > 0 && (
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Extracted Numbers:</h2>
          <ul className="list-disc pl-5">
            {extractedNumbers.map((number, i) => (
              <li key={i}>{number}</li>
            ))}
          </ul>
          <div className="mt-4 text-center">
            <p className="mb-2">🚀 Want to export contacts as VCF files?</p>
            <Link to="/auth">
              <Button className="bg-blue-500 hover:bg-blue-600">
                Sign Up for Full Features
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default FreeToolPage;