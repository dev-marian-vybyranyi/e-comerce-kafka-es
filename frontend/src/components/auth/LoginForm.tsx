import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { authApi } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const LoginSchema = Yup.object({
  email: Yup.string().email("Not valid email").required("Required"),
  password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
});

export function LoginForm() {
  const { setAuth } = useAuthStore();
  const [error, setError] = useState("");

  const loginForm = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError("");
      try {
        const res = await authApi.login(values);
        setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
      } catch (e: any) {
        setError(e.response?.data?.error || "Login failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={loginForm.handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        {...loginForm.getFieldProps("email")}
        error={loginForm.touched.email ? loginForm.errors.email : undefined}
      />
      <Input
        label="Password"
        type="password"
        {...loginForm.getFieldProps("password")}
        error={
          loginForm.touched.password ? loginForm.errors.password : undefined
        }
      />
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
          {error}
        </div>
      )}
      <Button
        type="submit"
        loading={loginForm.isSubmitting}
        className="w-full"
        size="lg"
      >
        Login
      </Button>
    </form>
  );
}
