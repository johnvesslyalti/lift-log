'use client';

import { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

interface AlertProps {
  text: string;
  type?: "success" | "error" | "info";
}

export default function Alert({ text, type = "info" }: AlertProps) {
  const styles = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
    info: "bg-blue-100 border-blue-400 text-blue-700",
  };

  const icons: Record<string, ReactNode> = {
    success: <CheckCircle2 className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  return (
    <div
      className={`flex items-center gap-2 border-l-4 p-3 rounded-md ${styles[type]}`}
    >
      {icons[type]}
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}
