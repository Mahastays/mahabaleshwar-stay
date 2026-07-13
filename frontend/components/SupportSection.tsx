"use client";

import { LifeBuoy, Mail, Phone, MessageSquare } from 'lucide-react';

export default function SupportSection() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`Support Query: ${formData.get('issueType')}`);
    const body = encodeURIComponent(`Name: ${formData.get('name')}\nEmail: ${formData.get('email')}\n\nIssue:\n${formData.get('message')}`);
    window.location.href = `mailto:Bookingmahastays@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <section className="py-20 bg-brand-red/10 mb-12">
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column: Info */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-red/20 text-brand-red font-bold text-sm w-max mb-6">
              <LifeBuoy size={16} />
              24/7 Support
            </div>
            <h2 className="text-[#3a1b5c] text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Facing an issue? <br/> We're here to help.
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed max-w-lg">
              Whether you have a question about your booking, need help finding a property, or are experiencing technical difficulties, our support team is ready to assist you.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-brand-red shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Call Us Directly</h4>
                  <p className="text-gray-500">+91 77410 02157</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-brand-red shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Email Support</h4>
                  <a href="mailto:Bookingmahastays@gmail.com" className="text-gray-500 hover:text-brand-red transition-colors">Bookingmahastays@gmail.com</a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MessageSquare size={24} className="text-brand-red" />
              Submit a Query
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-sm font-semibold text-gray-700">Full Name</label>
                  <input type="text" id="name" name="name" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all" placeholder="John Doe" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</label>
                  <input type="email" id="email" name="email" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all" placeholder="john@example.com" />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label htmlFor="issueType" className="text-sm font-semibold text-gray-700">Issue Type</label>
                <select id="issueType" name="issueType" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all bg-white">
                  <option value="">Select an issue type</option>
                  <option value="booking">Booking / Reservation</option>
                  <option value="payment">Payment Issue</option>
                  <option value="vendor">Host / Vendor Assistance</option>
                  <option value="technical">Technical Bug</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-sm font-semibold text-gray-700">Description</label>
                <textarea id="message" name="message" required rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all resize-none" placeholder="Please describe your issue in detail..."></textarea>
              </div>

              <button type="submit" className="w-full bg-brand-red hover:bg-brand-red text-white font-bold py-3.5 rounded-xl transition-colors shadow-md hover:shadow-lg mt-2">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
