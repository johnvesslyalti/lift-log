import { ModeToggle } from "./mode-toggle";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-white/[0.02] mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-6 px-4 gap-4">
        <div className="flex items-center gap-2">
          <span>
            <svg
              width="50"
              height="50"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="liftlogGradient"
                  x1="0"
                  y1="0"
                  x2="64"
                  y2="64"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="50%" stopColor="#5eead4" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>

              <path
                d="M10 26H6V38H10V26ZM18 22H14V42H18V22ZM26 30V26H22V38H26V34H36L30 40L34 44L48 30L34 16L30 20L36 26H26ZM50 22H46V42H50V22ZM58 26H54V38H58V26Z"
                fill="url(#liftlogGradient)"
              />
            </svg>
          </span>
          <span className="text-sm text-gray-100 font-bold">Lift Log</span>
          <span className="text-sm text-gray-400">
            Track • Train • Transform
          </span>
        </div>

        <div className="text-sm text-gray-400">
          © {new Date().getFullYear()} Lift Log. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
