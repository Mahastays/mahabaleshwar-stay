import React from 'react';
import Link from 'next/link';
import { Scale, FileText, AlertCircle, Calendar, ShieldAlert, CheckCircle2, MapPin, Phone, Mail, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | Mahastays - Premium Stays in Mahabaleshwar',
  description: 'Review the legal Terms & Conditions, booking policies, guest guidelines, and host responsibilities for stays with Mahabaleshwar Stay.',
};

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fa] pb-24">
      {/* HERO BANNER */}
      <section className="bg-[#3a1b5c] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-white/30 blur-3xl"></div>
          <div className="absolute right-1/4 bottom-0 w-80 h-80 rounded-full bg-amber-500/20 blur-2xl"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-purple-200 mb-4">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span>Legal & Terms</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
                Terms & Conditions
              </h1>
              <p className="text-purple-100/90 text-lg max-w-2xl font-medium">
                Please review these legally binding guidelines, cancellation terms, and operational guest policies before booking your stays and experiences.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-3 shrink-0">
              <Scale className="w-10 h-10 text-amber-300 shrink-0" />
              <div>
                <p className="text-xs text-purple-200 font-semibold uppercase">Agreement Status</p>
                <p className="text-sm font-extrabold text-white">Legally Binding</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT BODY */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-[0_4px_30px_rgb(0,0,0,0.05)] border border-gray-200/80 p-6 sm:p-12 space-y-12 text-gray-700">
          
          {/* Section 1 */}
          <div className="border-b border-gray-100 pb-8">
            <h2 className="text-2xl font-bold text-[#3a1b5c] mb-4 flex items-center gap-2.5">
              <FileText className="w-6 h-6 text-brand-red" />
              1. Acceptance of Platform Terms
            </h2>
            <p className="leading-relaxed text-base">
              By accessing, browsing, registering an account, or reserving properties and activities on <strong>Mahastays (Mahabaleshwar Stay)</strong>, you acknowledge that you have read, understood, and agreed to be legally bound by these Terms & Conditions. If you do not agree to these terms, please desist from making bookings or utilizing our marketplace services.
            </p>
          </div>

          {/* Section 2 */}
          <div className="border-b border-gray-100 pb-8 space-y-4">
            <h2 className="text-2xl font-bold text-[#3a1b5c] flex items-center gap-2.5">
              <Calendar className="w-6 h-6 text-brand-red" />
              2. Stay Reservations, Tariffs & Check-In Rules
            </h2>
            <p className="leading-relaxed text-base">
              All accommodations listed on Mahastays (including Heritage Villas, Forest Bungalows, Luxury Resorts, and Homestays) are independently operated or curated under strict quality parameters in Mahabaleshwar and Panchgani.
            </p>
            <ul className="space-y-3 pt-2">
              {[
                "Standard check-in time is generally 1:00 PM onwards, and check-out time is 11:00 AM unless explicitly specified differently by the property host on the stay detail page.",
                "Government-issued physical photo ID (Aadhar Card, Driving License, Passport, or Voter ID) is mandatory for all adult guests during physical check-in at the property.",
                "Tariffs displayed on the portal are subject to seasonal fluctuations, weekends, and peak monsoon/winter festival holidays in Mahabaleshwar. Once a reservation is confirmed and paid online, your booked rate is locked against future price adjustments.",
                "Guest occupancy must strictly respect the maximum capacity limit specified in your confirmed reservation voucher. Unannounced extra visitors may incur supplemental charges or refusal of entry by property hosts."
              ].map((text, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm sm:text-base font-medium text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3 */}
          <div className="border-b border-gray-100 pb-8 space-y-4">
            <h2 className="text-2xl font-bold text-[#3a1b5c] flex items-center gap-2.5">
              <AlertCircle className="w-6 h-6 text-brand-red" />
              3. Cancellations, Modifications & Refund Policy
            </h2>
            <p className="leading-relaxed text-base">
              We understand that travel itineraries can change. Our standardized cancellation matrix is built to protect both guests and local property owners:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-5 bg-emerald-50/70 border border-emerald-200/70 rounded-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">Full Refund</span>
                <h4 className="font-extrabold text-gray-900 text-base mt-3 mb-1">7+ Days Before Check-in</h4>
                <p className="text-sm text-gray-600 leading-normal">
                  Cancellations initiated at least 7 days prior to scheduled check-in qualify for a 100% refund (less nominal payment gateway transaction processing fees).
                </p>
              </div>
              <div className="p-5 bg-amber-50/70 border border-amber-200/70 rounded-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">50% Refund</span>
                <h4 className="font-extrabold text-gray-900 text-base mt-3 mb-1">3 to 6 Days Prior</h4>
                <p className="text-sm text-gray-600 leading-normal">
                  Cancellations requested between 72 and 144 hours prior to scheduled arrival dates qualify for a 50% refund on total booking value.
                </p>
              </div>
              <div className="p-5 bg-red-50/70 border border-red-200/70 rounded-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-red-800 bg-red-100 px-2.5 py-1 rounded-full">Non-Refundable</span>
                <h4 className="font-extrabold text-gray-900 text-base mt-3 mb-1">Within 72 Hours / No-Show</h4>
                <p className="text-sm text-gray-600 leading-normal">
                  Cancellations within 72 hours of check-in date or early departures during an ongoing stay are strictly non-refundable due to calendar reservation lock.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="border-b border-gray-100 pb-8 space-y-4">
            <h2 className="text-2xl font-bold text-[#3a1b5c] flex items-center gap-2.5">
              <ShieldAlert className="w-6 h-6 text-brand-red" />
              4. Guest Conduct & Eco-Sensitive Zone Rules
            </h2>
            <p className="leading-relaxed text-base">
              Mahabaleshwar and Panchgani are cherished ecologically sensitive hill stations in the Western Ghats. Guests visiting properties agree to maintain decorum and respect environmental guidelines:
            </p>
            <p className="leading-relaxed text-sm text-gray-600 bg-purple-50/70 border-l-4 border-[#3a1b5c] p-4 rounded-r-2xl font-medium">
              ⚠️ <strong>Noise & Music Policy:</strong> Loud outdoor speakers and high-volume audio systems are strictly prohibited in residential villa gardens after 10:00 PM in accordance with local municipal ordinances. Guests are expected to avoid littering in forest trails and keep property premises clean.
            </p>
          </div>

          {/* Section 5 */}
          <div className="border-b border-gray-100 pb-8 space-y-4">
            <h2 className="text-2xl font-bold text-[#3a1b5c] mb-2">
              5. Host Obligations & Review Integrity Policy
            </h2>
            <p className="leading-relaxed text-base">
              Registered property hosts must guarantee that listing details, photographs, WiFi availability, swimming pool cleanliness, and hot water systems accurately match physical realities.
            </p>
            <p className="leading-relaxed text-base">
              <strong>Review & Rating Integrity:</strong> To preserve authentic transparency, Property Hosts are strictly prohibited from submitting reviews or star ratings on any accommodations listed on Mahastays. Ratings are reserved strictly for genuine customer accounts. Any attempt to manipulate rating scores will result in immediate account suspension.
            </p>
          </div>

          {/* Section 6 */}
          <div className="border-b border-gray-100 pb-8 space-y-4">
            <h2 className="text-2xl font-bold text-[#3a1b5c] mb-2">
              6. Curated Activities & Adventure Disclaimer
            </h2>
            <p className="leading-relaxed text-base">
              Activities booked through our portal (such as Organic Strawberry Farm Walks, Pratapgad Fort Treks, Venna Lake Boating, or Horse Riding) are arranged in collaboration with certified local experts. Participants engage in outdoor recreational activities at their own volition and agree to abide by guide safety instructions.
            </p>
          </div>

          {/* Contact & Support Section */}
          <div className="bg-[#f2eff6] rounded-2xl p-6 sm:p-8 border border-purple-200/80">
            <h3 className="text-xl font-extrabold text-[#3a1b5c] mb-2">
              Need Clarification on Our Terms of Service?
            </h3>
            <p className="text-sm text-gray-600 mb-6 font-medium">
              Our legal and reservations team is available to assist you with any questions regarding booking terms, group invoices, or cancellation processing.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-xs border border-gray-200/60">
                <div className="w-10 h-10 rounded-lg bg-[#3a1b5c] text-white flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase">Call / WhatsApp</p>
                  <p className="text-sm font-extrabold text-gray-900">+91 94054 19021</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-xs border border-gray-200/60">
                <div className="w-10 h-10 rounded-lg bg-[#3a1b5c] text-white flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase">Legal & Support</p>
                  <p className="text-sm font-extrabold text-gray-900 truncate">Bookingmahastays@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-xs border border-gray-200/60">
                <div className="w-10 h-10 rounded-lg bg-[#3a1b5c] text-white flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase">Office Jurisdiction</p>
                  <p className="text-xs font-extrabold text-gray-900">MG Road, Market, Mahabaleshwar</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#3a1b5c] text-white rounded-full font-bold text-sm hover:bg-[#4a2375] transition shadow-md"
            >
              Accept & Explore Stays
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
