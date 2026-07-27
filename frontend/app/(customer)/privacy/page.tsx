import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText, Mail, Phone, MapPin, ChevronRight, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Mahastays - Premium Stays in Mahabaleshwar',
  description: 'Learn how Mahabaleshwar Stay safeguards your personal information, booking details, and privacy across our hospitality platform.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fa] pb-24">
      {/* HERO BANNER */}
      <section className="bg-[#3a1b5c] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-white/30 blur-3xl"></div>
          <div className="absolute left-1/3 bottom-0 w-80 h-80 rounded-full bg-red-500/20 blur-2xl"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-purple-200 mb-4">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight size={14} className="text-gray-400" />
            <span>Legal & Privacy</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
                Privacy Policy
              </h1>
              <p className="text-purple-100/90 text-lg max-w-2xl font-medium">
                We value your trust when booking premium vacations in Mahabaleshwar and Panchgani. Here is how we protect, handle, and secure your data.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-3 shrink-0">
              <ShieldCheck className="w-10 h-10 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs text-purple-200 font-semibold uppercase">Last Updated</p>
                <p className="text-sm font-extrabold text-white">July 2026 · Effective</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT BODY */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-[0_4px_30px_rgb(0,0,0,0.05)] border border-gray-200/80 p-6 sm:p-12 space-y-12 text-gray-700">
          
          {/* Introduction */}
          <div className="border-b border-gray-100 pb-8">
            <h2 className="text-2xl font-bold text-[#3a1b5c] mb-4 flex items-center gap-2.5">
              <Lock className="w-6 h-6 text-brand-red" />
              1. Introduction & Commitment to Privacy
            </h2>
            <p className="leading-relaxed text-base">
              Welcome to <strong>Mahabaleshwar Stay ("Mahastays")</strong>. Whether you are a traveler looking for serene heritage villas, luxury bungalows, or forest homestays, or a dedicated property host listing your stay, protecting your private data is our highest operational priority. This Privacy Policy describes the types of personal data we collect, how we utilize it to enhance your hospitality experiences, and the enterprise-grade protocols we implement to safeguard it.
            </p>
          </div>

          {/* Section 2 */}
          <div className="border-b border-gray-100 pb-8 space-y-4">
            <h2 className="text-2xl font-bold text-[#3a1b5c] flex items-center gap-2.5">
              <Eye className="w-6 h-6 text-brand-red" />
              2. Information We Collect
            </h2>
            <p className="leading-relaxed text-base">
              To provide a seamless reservation system and curated adventure itineraries, we may collect the following information when you register an account, browse listings, or confirm a booking:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200/70">
                <h4 className="font-bold text-[#3a1b5c] text-base mb-1">Account & Identity Data</h4>
                <p className="text-sm text-gray-600 leading-normal">
                  Full name, mobile contact number (including WhatsApp contact for check-in coordination), verified email address, and account login credentials.
                </p>
              </div>
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200/70">
                <h4 className="font-bold text-[#3a1b5c] text-base mb-1">Booking & Stay Metadata</h4>
                <p className="text-sm text-gray-600 leading-normal">
                  Property reservation dates, guest group sizing, special hospitality requests, check-in timestamps, and activity activity registrations.
                </p>
              </div>
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200/70">
                <h4 className="font-bold text-[#3a1b5c] text-base mb-1">Financial Transaction Records</h4>
                <p className="text-sm text-gray-600 leading-normal">
                  Payment confirmation receipt numbers processed via verified payment partners (such as Razorpay). We never directly store credit card numbers on our servers.
                </p>
              </div>
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200/70">
                <h4 className="font-bold text-[#3a1b5c] text-base mb-1">Property Host Information</h4>
                <p className="text-sm text-gray-600 leading-normal">
                  For property hosts: verified physical stay addresses in Mahabaleshwar/Panchgani, high-resolution media uploads, amenity verification certificates, and payout details.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="border-b border-gray-100 pb-8 space-y-4">
            <h2 className="text-2xl font-bold text-[#3a1b5c] flex items-center gap-2.5">
              <FileText className="w-6 h-6 text-brand-red" />
              3. How We Utilize Your Information
            </h2>
            <p className="leading-relaxed text-base">
              All personal information collected across the Mahastays platform is processed strictly to facilitate and optimize your travel experience:
            </p>
            <ul className="space-y-3 pt-2">
              {[
                "Confirming room reservations and transmitting immediate digital vouchers and receipts.",
                "Enabling direct check-in coordination between verified guests and authentic Mahabaleshwar property hosts.",
                "Dispatching essential pre-arrival tips, weather advisories, and directions to properties via Email or WhatsApp.",
                "Maintaining authentic customer feedback by ensuring only verified past guests can submit star ratings and reviews.",
                "Protecting our marketplace against fraud, unauthorized host account behaviors, or fake reservation attempts."
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm sm:text-base font-medium text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4 */}
          <div className="border-b border-gray-100 pb-8 space-y-4">
            <h2 className="text-2xl font-bold text-[#3a1b5c] flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-brand-red" />
              4. Data Protection, Security & Sharing Policy
            </h2>
            <p className="leading-relaxed text-base">
              We operate under strict confidentiality standards and do not trade, sell, or monetize user databases to external marketing aggregators or advertising networks.
            </p>
            <p className="leading-relaxed text-base">
              <strong>Host Sharing:</strong> When you successfully book a property or activity, we share necessary check-in details (your name and contact phone number) strictly with the host or adventure organizer responsible for delivering your booked stay.
            </p>
            <p className="leading-relaxed text-base">
              <strong>Legal Compliance:</strong> We reserve the right to disclose personal identity records only when mandated by state laws, municipal tourism guidelines in Maharashtra, or lawful judicial subpoenas.
            </p>
          </div>

          {/* Section 5 */}
          <div className="border-b border-gray-100 pb-8 space-y-4">
            <h2 className="text-2xl font-bold text-[#3a1b5c] mb-3">
              5. Your User Rights & Data Governance
            </h2>
            <p className="leading-relaxed text-base">
              You retain total control over your digital identity on Mahastays. You have the right to request access to your personal information, update incorrect account metadata via your profile dashboard, or request full account deletion and anonymization of past stay logs by contacting our privacy team.
            </p>
          </div>

          {/* Contact Details */}
          <div className="bg-[#f2eff6] rounded-2xl p-6 sm:p-8 border border-purple-200/80">
            <h3 className="text-xl font-extrabold text-[#3a1b5c] mb-2">
              Have Questions About Our Privacy Protocols?
            </h3>
            <p className="text-sm text-gray-600 mb-6 font-medium">
              Our official Mahabaleshwar support desk and data privacy officer are available 7 days a week to address any concerns or data modification requests.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-xs border border-gray-200/60">
                <div className="w-10 h-10 rounded-lg bg-[#3a1b5c] text-white flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase">Official Support</p>
                  <p className="text-sm font-extrabold text-gray-900">+91 94054 19021</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-xs border border-gray-200/60">
                <div className="w-10 h-10 rounded-lg bg-[#3a1b5c] text-white flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase">Email Inquiries</p>
                  <p className="text-sm font-extrabold text-gray-900 truncate">Bookingmahastays@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-xs border border-gray-200/60">
                <div className="w-10 h-10 rounded-lg bg-[#3a1b5c] text-white flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase">Head Office</p>
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
              Return to Homepage
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
