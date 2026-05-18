import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Lock, Mail, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { Field } from "../../components/ui/Field";
import { Select } from "../../components/ui/Select";
import type { UserRole } from "../../types/auth";
import { AuthShell } from "./AuthShell";

interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
}

const validateRegister = (name: string, email: string, password: string): RegisterErrors => {
  const errors: RegisterErrors = {};

  if (name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!email.includes("@")) {
    errors.email = "Enter a valid email";
  }

  if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  return errors;
};

export const RegisterPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { register, user, loading, error } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("sales");
  const [errors, setErrors] = useState<RegisterErrors>({});

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const nextErrors = validateRegister(name, email, password);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      await register({ name, email, password, role });
      navigate("/");
    } catch {
      return;
    }
  };

  return (
    <AuthShell>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Create access</p>
        <h1 className="mt-2 text-3xl font-bold">Register user</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Choose admin for full visibility or sales for owned leads only.</p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        {error ? <Alert message={error} /> : null}

        <Field
          label="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={errors.name}
          icon={<User className="h-4 w-4" aria-hidden="true" />}
          autoComplete="name"
        />

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
          autoComplete="new-password"
        />

        <Select label="Role" value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
          <option value="sales">Sales User</option>
          <option value="admin">Admin</option>
        </Select>

        <Button type="submit" className="w-full" loading={loading}>
          Register
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link className="font-semibold text-slate-950 underline dark:text-white" to="/login">
          Login
        </Link>
      </p>
    </AuthShell>
  );
};
