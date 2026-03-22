import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function LandingPage() {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to WALeadsKimi</h1>

      {/* Add Free Mini-Tool link */}
      <Link to="/free-tool">
        <Button className="bg-blue-500 hover:bg-blue-600">
          Try Our Free Tool → No Signup Needed
        </Button>
      </Link>

      {/* Rest of your LandingPage UI */}
      {/* ... */}
    </div>
  );
}

export default LandingPage;