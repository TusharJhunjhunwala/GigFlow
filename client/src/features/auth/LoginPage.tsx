import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { Field } from "../../components/ui/Field";
import { AuthShell } from "./AuthShell";

interface LoginErrors {
  email?: string;
  password?: string;
}

const validateLogin = (email: string, password: string): LoginErrors => {
  const errors: LoginErrors = {};

  if (!email.includes("@")) {
    errors.email = "Enter a valid email";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
};

export const LoginPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { login, user, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const nextErrors = validateLogin(email, password);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      await login({ email, password });
      navigate("/");
    } catch {
      return;
    }
  };

  return (
    <AuthShell>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Welcome back</p>
        <h1 className="mt-2 text-3xl font-bold">Log in to GigFlow</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Access your lead management workspace.</p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        {error ? <Alert message={error} /> : null}

        <Field
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
          icon={<Mail className="h-4 w-4" aria-hidden="true" />}
          autoComplete="email"
        />

        <Field
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          icon={<Lock className="h-4 w-4" aria-hidden="true" />}
          autoComplete="current-password"
        />

        <Button type="submit" className="w-full" loading={loading}>
          Login
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Need an account?{" "}
        <Link className="font-semibold text-slate-950 underline dark:text-white" to="/register">
          Register
        </Link>
      </p>
    </AuthShell>
  );
};
