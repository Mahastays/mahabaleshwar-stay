import Image from "next/image";
import Link from "next/link";
import { MountainSnow } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex text-blue-950 bg-slate-50">
      {/* Left pane: Image / Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-brand-brown text-white p-12 flex-col justify-between overflow-hidden shadow-2xl z-10">
        <Image 
          src="/bg-misty-road-light.png" 
          alt="Mahabaleshwar Scenery" 
          fill 
          priority
          className="object-cover opacity-50 mix-blend-luminosity"
        />
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
            <MountainSnow className="w-8 h-8" />
            <span>Mahabaleshwar Stay</span>
          </Link>
        </div>
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold mb-4 tracking-tight drop-shadow-md">Your gateway to the hills.</h1>
          <p className="text-brand-brown/10 text-lg drop-shadow">
            Discover premium stays, heritage villas, and cozy cottages nestled in the lush valleys of Mahabaleshwar.
          </p>
        </div>
      </div>

      {/* Right pane: Auth forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}
