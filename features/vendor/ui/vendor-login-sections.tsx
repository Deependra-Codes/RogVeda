import Link from "next/link";

import { vendorDemoCredentials } from "../types/contracts";

export function VendorLoginVisualPanel() {
  return (
    <div className="relative min-h-[240px] border-b border-border lg:col-span-5 lg:min-h-[720px] lg:border-b-0 lg:border-r">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(30,27,22,0.14),rgba(30,27,22,0.62))]" />
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
        <div className="rounded-control border border-white/15 bg-ink/55 px-4 py-4 backdrop-blur-xl">
          <p className="type-label text-white/55">Operations Portal</p>
          <h2 className="mt-3 text-[22px] font-semibold leading-[28px] text-white">
            Quiet entry point into the same booking workflow.
          </h2>
          <p className="mt-3 text-[14px] leading-6 text-white/82">
            The vendor view is intentionally operational, but it reads the same persisted booking
            source the patient confirmation route writes to.
          </p>
        </div>
      </div>
    </div>
  );
}

export function VendorLoginContent({
  errorMessage,
  loginAction,
}: Readonly<{
  errorMessage?: string;
  loginAction: (formData: FormData) => Promise<void>;
}>) {
  return (
    <div className="flex flex-col justify-center bg-paper p-6 sm:p-10 lg:col-span-7 lg:p-14">
      <VendorLoginIntro />
      {errorMessage ? (
        <VendorLoginMessagePanel title="Vendor login failed" body={errorMessage} tone="error" />
      ) : null}
      <VendorLoginForm loginAction={loginAction} />
      <VendorLoginSupportPanels />
      <div className="mt-8">
        <Link href="/" className="btn-tertiary inline-flex items-center gap-1.5 text-sm">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
            className="opacity-60"
          >
            <path
              d="M9 3L5 7l4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back To Patient Search
        </Link>
      </div>
    </div>
  );
}

function VendorLoginIntro() {
  return (
    <div className="animate-rv-fade-up">
      <p className="type-label text-ink/45">Vendor Login</p>
      <h1 className="mt-3 type-heading-xl max-w-[15ch] text-ink">
        Access the booking operations dashboard.
      </h1>
      <p className="mt-4 max-w-[540px] type-body-m text-ink/65">
        Use the demo credential pair to review confirmed bookings and complete the first
        coordination task in the connected trial workflow.
      </p>
    </div>
  );
}

function VendorLoginForm({
  loginAction,
}: Readonly<{ loginAction: (formData: FormData) => Promise<void> }>) {
  return (
    <form action={loginAction} className="mt-8 space-y-5 animate-rv-fade-up animation-delay-100">
      <Field label="Username" name="username" autoComplete="username" defaultValue="apollo" />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        defaultValue="apollo123"
      />
      <button type="submit" className="btn-primary mt-2 w-full text-[15px]">
        Sign In To Dashboard
      </button>
    </form>
  );
}

function VendorLoginSupportPanels() {
  return (
    <div className="mt-8 grid gap-4 border-t border-border pt-6 lg:grid-cols-[minmax(0,1fr)_220px]">
      <section className="rounded-control border border-border bg-bg/36 p-4 sm:p-5">
        <p className="type-label text-ink/45">Demo Credentials</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <CredentialItem label="Username" value={vendorDemoCredentials.username} />
          <CredentialItem label="Password" value={vendorDemoCredentials.password} />
        </div>
      </section>

      <section className="rounded-control border border-border bg-paper/80 p-4 sm:p-5">
        <p className="type-label text-ink/45">Workflow Note</p>
        <p className="mt-3 type-body-s text-ink/62">
          Completing the pending task moves the booking to In Progress.
        </p>
      </section>
    </div>
  );
}

type FieldProps = Readonly<{
  label: string;
  name: string;
  type?: "text" | "password";
  autoComplete?: string;
  defaultValue?: string;
}>;

function Field({ label, name, type = "text", autoComplete, defaultValue }: FieldProps) {
  return (
    <label className="block space-y-2">
      <span className="type-label pl-0.5 text-ink/55">{label}</span>
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        className="input-field"
      />
    </label>
  );
}

function CredentialItem({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div>
      <p className="type-label text-ink/40">{label}</p>
      <p className="mt-2 text-[15px] font-semibold text-ink">{value}</p>
    </div>
  );
}

export function VendorLoginMessagePanel({
  title,
  body,
  tone,
}: Readonly<{ title: string; body: string; tone: "error" | "info" }>) {
  const isError = tone === "error";

  return (
    <section
      className={`mt-6 rounded-control border p-4 ${
        isError ? "border-danger/25 bg-danger/[0.08]" : "border-border bg-bg/50"
      }`}
    >
      <p className={`text-sm font-semibold ${isError ? "text-danger" : "text-ink"}`}>{title}</p>
      <p className={`mt-1 type-body-s ${isError ? "text-danger/80" : "text-ink/65"}`}>{body}</p>
    </section>
  );
}
