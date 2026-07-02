import { MapPin, Bell, ChevronRight } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-line">
      <div className="flex items-center justify-between px-5 py-3">
        <Link href="/">
          <Logo size={22} />
        </Link>
        <button className="w-9 h-9 rounded-full flex items-center justify-center bg-mist">
          <Bell size={16} />
        </button>
      </div>
      <div className="flex items-center gap-1.5 px-5 pb-3 text-ink">
        <MapPin size={14} className="text-orange" />
        <span className="text-xs font-semibold flex items-center gap-0.5">
          Livrer à Plateau, Niamey <ChevronRight size={12} />
        </span>
      </div>
    </header>
  );
}
