import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { login } from "@/services/auth/login";
import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { sound } from "../lib/sound";
import ADMIN_ROUTES from "../routes/ADMIN_ROUTES";
import { getFromStorage } from "../services/tokenStore/storageHelper";

export function LoginForm({ className, ...props }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);

    if (!formData.email.endsWith("@gmail.com")) {
      toast.error("Only Gmail addresses are allowed");
      setPending(false);
      return;
    }


    try {
      const res = await login(formData); // assume it stores token internally
      // sound.success();
      toast.success("Login Successful!");

      const token = getFromStorage(); // or from res if returned

      // Navigate based on role priority or match 
      navigate(ADMIN_ROUTES.DASHBOARD);

    } catch (error) {
      sound.error();
      toast.error(JSON.parse(error.message).detail);
    } finally {
      setPending(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6 max-w-md mx-auto mt-10", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>

        {/* Email Field */}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Field>

        {/* Password Field */}
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              className="pr-10"
              minLength={8}
              placeholder="At least 8 characters"
              title="Password must be at least 8 characters long"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </Field>

        {/* Submit Button */}
        <Field>
          <Button type="submit" disabled={pending}>
            {pending ? "Logging in..." : "Login"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
