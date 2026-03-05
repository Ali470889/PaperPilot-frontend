
import { Button } from "@/components/ui/button";
import { FileText, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ADMIN_ROUTES from "../../routes/ADMIN_ROUTES";

const PaperGeneratePage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full flex justify-center items-center" >
      <div className="flex gap-4 p-4">
        {/* Custom Paper Button - Clean & Professional */}
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            navigate(ADMIN_ROUTES.SELECT_PUBLISHER);
          }}
        >
          <FileText size={18} className="text-slate-600" />
          <span className="font-medium">Custom Paper</span>
        </Button>

        {/* Generate with AI Button - Eye-catching & Modern */}
        <Button
          disabled
          size="lg"
        >
          <Sparkles size={18} className="animate-pulse" />
          <span className="font-semibold">Generate with AI</span>
        </Button>
      </div>
    </div>
  )
}

export default PaperGeneratePage


