import type { ReactNode } from "react";
import type { NotificationType } from "./types";

export function Container({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5 shadow-xl backdrop-blur">
      <h3 className="mb-4 text-lg font-semibold text-cyan-100">{title}</h3>
      {children}
    </div>
  );
}

export function DataPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-8 rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-2xl backdrop-blur">
      <h3 className="mb-4 text-lg font-semibold text-cyan-100">{title}</h3>
      {children}
    </div>
  );
}

export function Input({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mb-3 w-full rounded-lg border border-slate-600 bg-slate-950/80 p-2.5 text-sm text-slate-100 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none"
    />
  );
}

export function Button({
  text,
  onClick,
  color,
}: {
  text: string;
  onClick: () => void;
  color: "success" | "warning" | "danger" | "primary";
}) {
  const colorMap: Record<typeof color, string> = {
    success: "bg-emerald-600 hover:bg-emerald-700",
    warning: "bg-amber-600 hover:bg-amber-700",
    danger: "bg-rose-600 hover:bg-rose-700",
    primary: "bg-cyan-600 hover:bg-cyan-700",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-lg px-3 py-2.5 text-sm font-semibold text-white transition ${colorMap[color]}`}
    >
      {text}
    </button>
  );
}

export function NotificationToast({
  type,
  message,
  onClose,
}: {
  type: NotificationType;
  message: string;
  onClose: () => void;
}) {
  const typeClasses: Record<NotificationType, string> = {
    success: "border-green-500 bg-green-900/90 text-green-100",
    error: "border-red-500 bg-red-900/90 text-red-100",
    info: "border-sky-500 bg-sky-900/90 text-sky-100",
  };

  return (
    <div className="fixed right-6 top-6 z-50 w-88">
      <div
        className={`flex items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm ${typeClasses[type]}`}
      >
        <p className="flex-1 text-sm font-medium leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className="text-lg leading-none opacity-80 transition-opacity hover:opacity-100"
          aria-label="Close notification"
        >
          x
        </button>
      </div>
    </div>
  );
}
