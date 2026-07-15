'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('email');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect based on role
  useEffect(() => {
    if (user && !authLoading) {
      if (user.role === 'admin') router.push('/admin');
      else if (user.role === 'host') router.push('/vendor');
      else router.push('/');
    } else if (!user && !authLoading && loading) {
      // If auth finished loading but user is still null, it means backend sync failed
      setLoading(false);
      setError('Login failed to sync with the server. Please check your connection.');
    }
  }, [user, authLoading, router, loading]);

  if (user) {
    return null;
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // AuthContext will handle the backend sync automatically via onAuthStateChanged
    } catch (err: any) {
      // Ignore user cancellations
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message);
      }
      setLoading(false);
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      // Reset recaptcha if error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await confirmationResult.confirm(otp);
      // AuthContext will handle the backend sync
    } catch (err: any) {
      setError('Invalid OTP code. Please try again.');
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAF3E0]">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-brand-red">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=2070&auto=format&fit=crop" 
          alt="Mahabaleshwar" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-12 text-white">
          <p className="text-lg opacity-90 max-w-md leading-relaxed">
            Experience the serene beauty of Mahabaleshwar. Book premium resorts, cozy homestays, and luxurious villas.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md bg-white p-10 shadow-2xl shadow-brand-brown/5 rounded-3xl border border-white/50 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="lg:hidden mb-10 flex justify-center">
              <img 
                src="/logo_cropped.png" 
                alt="MahaStays Logo" 
                className="h-16 w-auto object-contain" 
              />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-500">Sign in to access your dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50/80 border border-red-100 rounded-2xl flex items-start gap-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-gray-200 rounded-2xl shadow-sm bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none transition-all active:scale-[0.98]"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 mr-3" alt="Google" />
              Continue with Google
            </button>

            {loginMethod === 'phone' ? (
              <>
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink-0 mx-4 text-xs font-medium text-gray-400 uppercase tracking-widest">Or continue with phone</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                {!confirmationResult ? (
                  <form onSubmit={handleSendOtp} className="space-y-5">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="block w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-red focus:border-transparent sm:text-sm text-gray-900 outline-none transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center items-center py-3.5 px-4 rounded-2xl shadow-md shadow-brand-red/20 text-sm font-bold text-white bg-brand-red hover:opacity-90 focus:outline-none transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send OTP'}
                    </button>
                    <div id="recaptcha-container"></div>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    <div>
                      <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">Enter Verification Code</label>
                      <input
                        id="otp"
                        name="otp"
                        type="text"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="block w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-red focus:border-transparent sm:text-lg tracking-[0.5em] text-center text-gray-900 outline-none transition-all"
                        placeholder="------"
                        maxLength={6}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center items-center py-3.5 px-4 rounded-2xl shadow-md shadow-brand-red/20 text-sm font-bold text-white bg-brand-red hover:opacity-90 focus:outline-none transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Log In'}
                    </button>
                    
                    <button 
                      type="button" 
                      onClick={() => {
                        setConfirmationResult(null);
                        setOtp('');
                      }}
                      className="w-full text-center text-sm font-medium text-gray-500 hover:text-brand-red transition-colors"
                    >
                      Change phone number
                    </button>
                  </form>
                )}
                
                <button 
                  onClick={() => setLoginMethod('email')}
                  className="w-full mt-4 text-center text-sm font-medium text-brand-red hover:text-brand-red/80 transition-colors"
                >
                  Switch to Email Login
                </button>
              </>
            ) : (
              <>
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink-0 mx-4 text-xs font-medium text-gray-400 uppercase tracking-widest">Or continue with email</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="test@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-red focus:border-transparent sm:text-sm text-gray-900 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-red focus:border-transparent sm:text-sm text-gray-900 outline-none transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-3.5 px-4 rounded-2xl shadow-md shadow-brand-red/20 text-sm font-bold text-white bg-brand-red hover:opacity-90 focus:outline-none transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? 'Sign Up' : 'Log In')}
                  </button>
                  
                  <div className="flex justify-between items-center mt-4 text-sm">
                    <button 
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="font-medium text-gray-500 hover:text-brand-red transition-colors"
                    >
                      {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
                    </button>
                  </div>
                </form>

                <button 
                  onClick={() => setLoginMethod('phone')}
                  className="w-full mt-4 text-center text-sm font-medium text-brand-red hover:text-brand-red/80 transition-colors"
                >
                  Switch to Phone Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
