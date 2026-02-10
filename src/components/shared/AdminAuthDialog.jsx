import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/services/auth/login";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const AdminAuthDialog = ({ open, onOpenChange, onAuthSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAuthenticate = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsAuthenticating(true);

    try {
      await login({ email, password });
      toast.success("Authentication successful!");
      onAuthSuccess();
      onOpenChange(false);
      setEmail("");
      setPassword("");
    } catch (error) {
      toast.error("Authentication failed. Please check your credentials.");
      console.error(error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Admin Authentication Required
          </DialogTitle>
          <DialogDescription>
            Please enter your admin credentials to confirm this deletion action.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="admin-email">
              Email <span className="text-red-600">*</span>
            </Label>
            <Input
              id="admin-email"
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isAuthenticating}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="admin-password">
              Password <span className="text-red-600">*</span>
            </Label>
            <Input
              id="admin-password"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && email && password) {
                  handleAuthenticate();
                }
              }}
              disabled={isAuthenticating}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={isAuthenticating}
              onClick={handleClose}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleAuthenticate}
            disabled={!email || !password || isAuthenticating}
          >
            {isAuthenticating ? "Authenticating..." : "Authenticate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminAuthDialog;
