'use client';

import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Star, 
  Clock, 
  Heart, 
  Edit3, 
  Trash2, 
  Plus, 
  X, 
  CheckCircle2, 
  CreditCard, 
  Calendar, 
  Users 
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface Activity {
  _id: string;
  image: string;
  location: string;
  title: string;
  rating: number;
  reviews: number;
  price: number;
  duration: string;
  status?: string;
}

export default function ActivitiesSection() {
  const { user } = useAuth();
  const router = useRouter();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Admin Modal State
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    image: '',
    price: 0,
    duration: '1 Hour',
    rating: 4.8,
    reviews: 50,
  });
  const [saving, setSaving] = useState(false);

  // Booking & Payment Modal State
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [tickets, setTickets] = useState(1);
  const [bookingDate, setBookingDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [paying, setPaying] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      // Admin sees all experiences, general public sees approved ones
      const endpoint = user?.role === 'admin' ? '/experiences/admin/all' : '/experiences';
      const res = await api.get(endpoint);
      setActivities(res.data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      // Fallback if admin endpoint fails when logging out
      try {
        const fallbackRes = await api.get('/experiences');
        setActivities(fallbackRes.data);
      } catch (e) {
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, [user]);

  // Load Razorpay Script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Admin: Open Modal for Add
  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      location: 'Mahabaleshwar & Panchgani',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      price: 799,
      duration: '1 Hour',
      rating: 4.9,
      reviews: 120,
    });
    setAdminModalOpen(true);
  };

  // Admin: Open Modal for Edit
  const handleOpenEditModal = (activity: Activity) => {
    setEditingId(activity._id);
    setFormData({
      title: activity.title || '',
      location: activity.location || '',
      image: activity.image || '',
      price: activity.price || 0,
      duration: activity.duration || '',
      rating: activity.rating || 4.8,
      reviews: activity.reviews || 0,
    });
    setAdminModalOpen(true);
  };

  // Admin: Save / Update Activity
  const handleAdminSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingId) {
        await api.put(`/experiences/${editingId}`, formData);
      } else {
        await api.post('/experiences', formData);
      }
      setAdminModalOpen(false);
      fetchExperiences();
    } catch (err: any) {
      alert('Error saving activity: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // Admin: Delete Activity
  const handleAdminDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to completely remove this activity?')) return;
    try {
      await api.delete(`/experiences/${id}`);
      setActivities((prev) => prev.filter((item) => item._id !== id));
    } catch (err: any) {
      alert('Error deleting activity: ' + (err.response?.data?.message || err.message));
    }
  };

  // Customer: Open Booking Modal
  const handleOpenBooking = (activity: Activity) => {
    if (!user) {
      router.push('/login');
      return;
    }
    setSelectedActivity(activity);
    setTickets(1);
    setErrorMsg('');
    setBookingSuccess(null);
  };

  // Customer: Handle Payment
  const handlePayment = async () => {
    if (!selectedActivity || !user) return;
    setPaying(true);
    setErrorMsg('');

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setErrorMsg('Unable to connect to payment gateway. Please verify internet connection.');
        setPaying(false);
        return;
      }

      // Step 1: Create Order
      const orderRes = await api.post('/payment/activity/create-order', {
        experienceId: selectedActivity._id,
        tickets,
        bookingDate,
      });

      const { orderId, amount, currency, keyId, mock } = orderRes.data;

      // If simulated / fallback local test mode
      if (mock || orderId.startsWith('order_mock_')) {
        await api.post('/payment/activity/verify', {
          razorpay_order_id: orderId,
          experienceId: selectedActivity._id,
          tickets,
          bookingDate,
          totalPrice: selectedActivity.price * tickets
        });
        setPaying(false);
        setBookingSuccess(`ACT-${Math.floor(100000 + Math.random() * 900000)}`);
        return;
      }

      // Step 2: Open Razorpay Checkout
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "Mahastays Activities",
        description: `Booking for ${selectedActivity.title}`,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            await api.post('/payment/activity/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              experienceId: selectedActivity._id,
              tickets,
              bookingDate,
              totalPrice: selectedActivity.price * tickets
            });

            setPaying(false);
            setBookingSuccess(`ACT-${response.razorpay_payment_id.slice(-6).toUpperCase()}`);
          } catch (verifyErr: any) {
            console.error('Payment verification failed:', verifyErr);
            setErrorMsg('Payment signature mismatch or verification error.');
            setPaying(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#3a1b5c",
        },
        modal: {
          ondismiss: function () {
            setPaying(false);
          }
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (err: any) {
      console.error('Payment error:', err);
      setErrorMsg('Failed to initialize payment gateway. ' + (err.response?.data?.message || err.message));
      setPaying(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-gray-500 font-semibold">Loading Mahastays Experiences & Activities...</div>;
  }

  return (
    <section className="py-16 bg-white mb-12 relative">
      <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
        
        {/* Section Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-10">
          <div>
            <h2 className="text-[#3a1b5c] text-3xl md:text-4xl font-bold">Activities & Experiences</h2>
            <p className="text-gray-500 text-sm mt-1">Curated adventures in Mahabaleshwar and Panchgani</p>
          </div>
          
          <div className="flex items-center gap-3">
            {user?.role === 'admin' && (
              <button 
                onClick={handleOpenAddModal}
                className="bg-[#3a1b5c] text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow hover:shadow-lg hover:bg-[#4a2375] transition-all cursor-pointer"
              >
                <Plus size={18} /> Add Activity (Admin)
              </button>
            )}
            <div className="hidden md:flex gap-2">
              <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition text-gray-500 hover:text-gray-900 cursor-pointer">
                <ChevronLeft size={20} />
              </button>
              <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition text-gray-500 hover:text-gray-900 cursor-pointer">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activities.map((activity) => (
            <div key={activity._id} className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all duration-300 relative">
              
              {/* Admin Overlay Controls (ONLY visible to Admin) */}
              {user?.role === 'admin' && (
                <div className="absolute top-3 left-3 flex gap-2 z-20">
                  <button 
                    onClick={() => handleOpenEditModal(activity)} 
                    title="Edit Activity (Admin Only)"
                    className="bg-white/95 text-blue-600 p-2 rounded-full shadow-md hover:bg-blue-600 hover:text-white transition-all cursor-pointer flex items-center gap-1 font-semibold text-[11px] px-3"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => handleAdminDelete(activity._id)} 
                    title="Delete Activity"
                    className="bg-white/95 text-red-600 p-2 rounded-full shadow-md hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )}

              {/* Image Section */}
              <div className="relative h-56 overflow-hidden bg-gray-100">
                <img 
                  src={activity.image} 
                  alt={activity.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e: any) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <button className="absolute top-4 right-4 text-gray-300 hover:text-brand-red transition-colors bg-white/60 backdrop-blur-sm p-1.5 rounded-full z-10 cursor-pointer">
                  <Heart size={22} className="fill-current" />
                </button>
              </div>

              {/* Content Section */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start gap-1.5 mb-2.5 text-gray-500">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-[#3a1b5c]" />
                  <p className="text-[13px] font-medium leading-tight line-clamp-1">{activity.location}</p>
                </div>
                
                <h4 className="text-[19px] font-extrabold text-[#3a1b5c] mb-2 line-clamp-1 group-hover:text-brand-red transition-colors">
                  {activity.title}
                </h4>
                
                <div className="flex items-center gap-1.5 mb-4 text-sm font-bold text-[#f5a623]">
                  <Star size={16} className="fill-current" />
                  <span>{activity.rating}</span>
                  <span className="text-gray-400 font-normal ml-1 text-xs">({activity.reviews === 0 ? 'New' : `${activity.reviews} Reviews`})</span>
                </div>

                <div className="border-t border-gray-100 mt-auto pt-4 flex items-end justify-between gap-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-gray-500 mb-1">
                      <Clock size={12} />
                      <span className="text-[11px] font-semibold">{activity.duration}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-gray-900 font-extrabold text-[18px]">
                        ₹ {activity.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-gray-500 text-[11px]">/ person</span>
                    </div>
                  </div>
                  
                  {/* Book / Pay Button */}
                  <button 
                    onClick={() => handleOpenBooking(activity)}
                    className="bg-brand-red text-white px-4 py-2 rounded-xl font-bold text-[13px] shadow-sm hover:shadow-md hover:bg-red-600 active:scale-95 transition-all duration-200 cursor-pointer flex-shrink-0"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Add / Edit Activity Modal */}
      {adminModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-scale">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
              <h3 className="text-xl font-extrabold text-[#3a1b5c]">
                {editingId ? 'Edit Activity (Admin)' : 'Create New Activity (Admin)'}
              </h3>
              <button onClick={() => setAdminModalOpen(false)} className="text-gray-400 hover:text-gray-700 p-1 rounded-full">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleAdminSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Title</label>
                <input 
                  type="text" 
                  required 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Sunset Shikara Boating"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3a1b5c] text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Location / Venue</label>
                <input 
                  type="text" 
                  required 
                  value={formData.location} 
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g. Venna Lake, Mahabaleshwar"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3a1b5c] text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Price (₹ per person)</label>
                  <input 
                    type="number" 
                    required 
                    min="1"
                    value={formData.price} 
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3a1b5c] text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Duration</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.duration} 
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    placeholder="e.g. 1.5 Hours or 45 Min"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3a1b5c] text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Image URL</label>
                <input 
                  type="url" 
                  required 
                  value={formData.image} 
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3a1b5c] text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Rating (1 - 5)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="1" 
                    max="5" 
                    value={formData.rating} 
                    onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value) || 4.5})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3a1b5c] text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Review Count</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.reviews} 
                    onChange={(e) => setFormData({...formData, reviews: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3a1b5c] text-sm font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setAdminModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 font-bold text-gray-700 hover:bg-gray-100 transition text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#3a1b5c] text-white font-bold text-sm hover:bg-[#4a2375] shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Activity' : 'Publish Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Activity Booking & Checkout Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-scale">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden">
            
            {bookingSuccess ? (
              /* Success confirmation view */
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 size={36} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-black text-gray-900">Booking Confirmed!</h3>
                <p className="text-gray-600 text-sm leading-relaxed px-2">
                  Your reservation for <strong className="text-gray-900">{selectedActivity.title}</strong> has been secured and paid via Razorpay.
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs text-gray-600 max-w-xs mx-auto">
                  <span className="font-bold uppercase tracking-wider text-gray-400 block mb-1">Booking Reference</span>
                  <span className="text-lg font-mono font-bold text-[#3a1b5c]">{bookingSuccess}</span>
                </div>
                <p className="text-[12px] text-gray-400">An email pass has been sent to {user?.email || 'your registered contact'}.</p>
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="w-full py-3.5 bg-[#3a1b5c] text-white font-bold rounded-2xl shadow-lg hover:bg-opacity-95 transition mt-2 cursor-pointer text-sm"
                >
                  Done & Close
                </button>
              </div>
            ) : (
              /* Payment configuration view */
              <>
                <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-brand-red">Activity Checkout</span>
                    <h3 className="text-lg font-extrabold text-gray-900 leading-tight truncate max-w-[280px]">
                      {selectedActivity.title}
                    </h3>
                  </div>
                  <button onClick={() => setSelectedActivity(null)} className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full bg-gray-50">
                    <X size={20} />
                  </button>
                </div>

                <div className="flex gap-3 bg-gray-50 p-3 rounded-2xl mb-5 border border-gray-150 items-center">
                  <img src={selectedActivity.image} className="w-16 h-16 rounded-xl object-cover" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 flex items-center gap-1 truncate mb-1">
                      <MapPin size={12} className="text-gray-600 shrink-0" /> {selectedActivity.location}
                    </p>
                    <p className="text-sm font-bold text-[#3a1b5c]">₹ {selectedActivity.price.toLocaleString('en-IN')} <span className="text-xs font-normal text-gray-500">/ person</span></p>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Calendar size={14} className="text-gray-500" /> Select Date
                    </label>
                    <input 
                      type="date" 
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingDate} 
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3a1b5c]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Users size={14} className="text-gray-500" /> Number of Tickets / Guests
                    </label>
                    <div className="flex items-center gap-3">
                      <button 
                        type="button"
                        onClick={() => setTickets(Math.max(1, tickets - 1))}
                        className="w-10 h-10 rounded-xl bg-gray-100 font-black text-gray-700 hover:bg-gray-200 flex items-center justify-center transition cursor-pointer text-lg"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-extrabold text-lg text-gray-900">{tickets} {tickets === 1 ? 'Person' : 'Persons'}</span>
                      <button 
                        type="button"
                        onClick={() => setTickets(Math.min(50, tickets + 1))}
                        className="w-10 h-10 rounded-xl bg-gray-100 font-black text-gray-700 hover:bg-gray-200 flex items-center justify-center transition cursor-pointer text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price breakdown */}
                  <div className="border-t border-dashed border-gray-200 pt-4 mt-4 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹ {selectedActivity.price.toLocaleString('en-IN')} × {tickets} {tickets === 1 ? 'ticket' : 'tickets'}</span>
                      <span className="font-semibold text-gray-900">₹ {(selectedActivity.price * tickets).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600 font-semibold">
                      <span>Taxes & Service Fees</span>
                      <span>FREE</span>
                    </div>
                    <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-100">
                      <span>Total Amount Payable</span>
                      <span className="text-[#3a1b5c] text-xl">₹ {(selectedActivity.price * tickets).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={handlePayment}
                    disabled={paying}
                    className="w-full py-4 rounded-2xl bg-brand-red text-white font-extrabold text-base shadow-lg hover:bg-red-600 active:scale-98 transition duration-200 flex items-center justify-center gap-2 mt-4 disabled:opacity-60 cursor-pointer"
                  >
                    <CreditCard size={18} />
                    {paying ? 'Connecting to Razorpay...' : `Pay ₹ ${(selectedActivity.price * tickets).toLocaleString('en-IN')} & Book`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </section>
  );
}
