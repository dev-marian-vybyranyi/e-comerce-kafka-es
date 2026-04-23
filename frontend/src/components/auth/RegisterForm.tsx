import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { authApi } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const RegisterSchema = Yup.object({
  firstName: Yup.string().min(2).required("Required"),
  lastName: Yup.string().min(2).required("Required"),
  username: Yup.string().min(3).max(20).required("Required"),
  email: Yup.string().email("Not valid email").required("Required"),
  password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
});

export function RegisterForm() {
  const { setAuth } = useAuthStore();
  const [error, setError] = useState("");

  const registerForm = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError("");
      try {
        const res = await authApi.register(values);
        setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
      } catch (e: any) {
        setError(e.response?.data?.error || "Registration failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={registerForm.handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="First name"
          {...registerForm.getFieldProps("firstName")}
          error={
            registerForm.touched.firstName
              ? registerForm.errors.firstName
              : undefined
          }
        />
        <Input
          label="Last name"
          {...registerForm.getFieldProps("lastName")}
          error={
            registerForm.touched.lastName
              ? registerForm.errors.lastName
              : undefined
          }
        />
      </div>
      <Input
        label="Username"
        {...registerForm.getFieldProps("username")}
        error={
          registerForm.touched.username
            ? registerForm.errors.username
            : undefined
        }
      />
      <Input
        label="Email"
        type="email"
        {...registerForm.getFieldProps("email")}
        error={
          registerForm.touched.email ? registerForm.errors.email : undefined
        }
      />
      <Input
        label="Password"
        type="password"
        {...registerForm.getFieldProps("password")}
        error={
          registerForm.touched.password
            ? registerForm.errors.password
            : undefined
        }
      />
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
          {error}
        </div>
      )}
      <Button
        type="submit"
        loading={registerForm.isSubmitting}
        className="w-full"
        size="lg"
      >
        Register
      </Button>
    </form>
  );
}
