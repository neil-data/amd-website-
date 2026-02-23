interface AuthFormFieldsProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

export default function AuthFormFields({ email, password, onEmailChange, onPasswordChange }: AuthFormFieldsProps) {
  return (
    <>
      <label className="block space-y-2">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="name@example.com"
          className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
          required
        />
      </label>

      <label className="block space-y-2">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          placeholder="••••••••"
          className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm text-black outline-none transition-colors focus:border-black"
          required
        />
      </label>
    </>
  );
}
