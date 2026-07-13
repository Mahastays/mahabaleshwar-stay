import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export const metadata = {
  title: 'Contact Us | Mahastays',
  description: 'Get in touch with Mahastays for any queries regarding bookings, hosting, or general support.',
};

export default function ContactPage() {
  return (
    <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 py-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">We'd love to hear from you</h1>
        <p className="text-lg text-gray-600">
          Whether you have a question about properties, pricing, hosting, or anything else, our team is ready to answer all your questions.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* Contact Info & Map */}
        <div className="lg:w-1/2 space-y-10">
          
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              <div className="w-12 h-12 bg-green-50 text-brand-red rounded-xl flex items-center justify-center">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Visit Us</h3>
              <p className="text-gray-600">
                Mahastays HQ, Main Market,<br />
                Mahabaleshwar, Maharashtra 412806
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="w-12 h-12 bg-green-50 text-brand-red rounded-xl flex items-center justify-center">
                <Phone size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Call Us</h3>
              <p className="text-gray-600">
                Mon-Sun from 9am to 8pm<br />
                +91 98765 43210
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="w-12 h-12 bg-green-50 text-brand-red rounded-xl flex items-center justify-center">
                <Mail size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Email Us</h3>
              <p className="text-gray-600">
                Our friendly team is here to help.<br />
                hello@mahastays.com
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="w-12 h-12 bg-green-50 text-brand-red rounded-xl flex items-center justify-center">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Support Hours</h3>
              <p className="text-gray-600">
                24/7 Customer Support<br />
                for active bookings.
              </p>
            </div>
          </div>

          {/* Map */}
          <div className="w-full h-80 bg-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d30325.32115167664!2d73.63914616223405!3d17.9258284728509!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2655313cba1b9%3A0x6b772421376f9d3b!2sMahabaleshwar%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1715421256372!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:w-1/2">
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a message</h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">First Name</label>
                  <input 
                    type="text" 
                    placeholder="John"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Last Name</label>
                  <input 
                    type="text" 
                    placeholder="Doe"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Email address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Topic</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all appearance-none bg-white">
                  <option value="general">General Inquiry</option>
                  <option value="booking">Booking Support</option>
                  <option value="hosting">Become a Host</option>
                  <option value="billing">Billing & Payments</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">Message</label>
                <textarea 
                  rows={5}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all resize-none"
                ></textarea>
              </div>

              <button 
                type="button"
                className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span>Send Message</span>
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
