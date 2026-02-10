import { Lock, ShieldAlert, ArrowLeft, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import ADMIN_ROUTES from "../../../routes/ADMIN_ROUTES";

export default function Unauthorized() {

  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSignIn = () => {
    navigate(ADMIN_ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div

        className="w-full max-w-md"
      >
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 grid h-16 w-16 place-items-center rounded-2xl bg-slate-100">
              <Lock className="h-8 w-8" aria-hidden="true" />
            </div>
            <CardTitle className="text-2xl">Unauthorized</CardTitle>
            <CardDescription className="text-base">
              Access denied. You do not have the required permissions.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1">
              <ShieldAlert className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm font-medium">Security policy</span>
            </div>

            <p className="text-sm text-slate-600">
              This page is only for the current roles.
            </p>

            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="text-slate-700">
                Role required
              </Badge>
              <Badge>Contact admin</Badge>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={handleGoBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Go back
            </Button>

            <Button className="w-full sm:w-auto" onClick={handleSignIn}>
              <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
              Sign in with authorized account
            </Button>
          </CardFooter>
        </Card>

        <p className="mt-6 text-center text-xs text-slate-500">
          If you believe this is an error, contact your administrator and share
          your user ID and current roles.
        </p>
      </div>
    </div>
  );
}
