import { ShieldAlert } from "lucide-react";

interface UnauthorizedPageProps {
  searchParams?: {
    message?: string;
  };
}

export default function UnauthorizedPage({
  searchParams,
}: UnauthorizedPageProps) {
  const message =
    typeof searchParams?.message === "string" && searchParams.message.trim()
      ? searchParams.message
      : "You don’t have permission to access this resource.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mx-auto">
          <ShieldAlert className="w-7 h-7 text-red-600" />
        </div>

        {/* Title */}
        <h1 className="mt-6 text-center text-3xl font-semibold text-slate-900">
          Access Denied
        </h1>

        {/* Message */}
        <p className="mt-3 text-center text-slate-600 leading-relaxed">
          {message}
        </p>

        {/* Divider */}
        <div className="my-6 h-px bg-slate-200" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="/"
            className="flex-1 inline-flex items-center justify-center rounded-lg bg-slate-900 text-white h-11 text-sm font-medium hover:bg-slate-800 transition"
          >
            Go to Home
          </a>

          <a
            href="/auth"
            className="flex-1 inline-flex items-center justify-center rounded-lg border border-slate-300 text-slate-700 h-11 text-sm font-medium hover:bg-slate-100 transition"
          >
            Sign in with another account
          </a>
        </div>
      </div>
    </div>
  );
}
