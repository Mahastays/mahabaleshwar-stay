'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, MessageSquare, CheckCircle2, Loader2, Trash2, Edit3, X } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import ReviewForm from './ReviewForm';

interface Review {
  _id: string;
  user: { _id: string; name: string };
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}

interface ReviewSectionProps {
  propertyId: string;
  avgRating: number;
  totalReviews: number;
}

function StarDisplay({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const starSize = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} ${
            star <= Math.round(rating)
              ? 'fill-amber-400 text-amber-400'
              : star - 0.5 <= rating
              ? 'fill-amber-200 text-amber-200'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

export default function ReviewSection({ propertyId, avgRating, totalReviews }: ReviewSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [eligibleBookingId, setEligibleBookingId] = useState<string | null>(null);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await api.get(`/reviews/property/${propertyId}`);
      setReviews(res.data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  const checkReviewEligibility = useCallback(async () => {
    if (!user || user.role === 'host') {
      setCanReview(false);
      return;
    }
    try {
      const res = await api.get(`/reviews/can-review/${propertyId}`);
      setCanReview(res.data.canReview);
      if (res.data.canReview) {
        setEligibleBookingId(res.data.bookingId || null);
      }
    } catch (error) {
      console.error('Failed to check review eligibility:', error);
    }
  }, [user, propertyId]);

  useEffect(() => {
    fetchReviews();
    checkReviewEligibility();
  }, [fetchReviews, checkReviewEligibility]);

  const handleReviewSubmitted = () => {
    setReviewSubmitted(true);
    setCanReview(false);
    setIsFormOpen(false);
    fetchReviews(); // Re-fetch to show new review instantly
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to permanently remove this review?')) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      fetchReviews();
      checkReviewEligibility();
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  // Rating distribution calculation
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
    percentage: reviews.length > 0
      ? (reviews.filter((r) => Math.round(r.rating) === star).length / reviews.length) * 100
      : 0,
  }));

  return (
    <div className="border-t border-gray-200 pt-10 mt-10 space-y-8" id="reviews-section">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-2xl font-extrabold text-[#3a1b5c] tracking-tight flex items-center gap-2.5">
          <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
          {reviews.length > 0 
            ? `${(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)} · ${reviews.length} Review${reviews.length !== 1 ? 's' : ''}` 
            : 'No Reviews Yet'}
        </h3>
      </div>

      {/* Rating summary bar */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/90 border border-gray-100 rounded-2xl p-6 shadow-[0_2px_10px_rgb(0,0,0,0.03)]">
          {/* Average score */}
          <div className="flex flex-col items-center justify-center gap-2 py-2">
            <span className="text-6xl font-black text-[#3a1b5c]">
              {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
            </span>
            <StarDisplay rating={reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length} size="lg" />
            <span className="text-sm font-semibold text-gray-500">out of 5.0 rating</span>
          </div>

          {/* Distribution bars */}
          <div className="space-y-2 flex flex-col justify-center">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-700 w-3">{star}</span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-500 w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RATING & REVIEW CALL TO ACTION CARD */}
      <div className="space-y-4">
        {/* 1. If User is not logged in */}
        {!user && (
          <div className="bg-gradient-to-r from-gray-50 to-purple-50/30 border border-gray-200/80 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-2sm">
            <div className="text-center sm:text-left">
              <h4 className="text-base font-extrabold text-[#3a1b5c] flex items-center justify-center sm:justify-start gap-2">
                <span>Want to rate or review this property?</span>
              </h4>
              <p className="text-sm text-gray-500 mt-1">Please sign into your customer account to share your rating and review with future travellers.</p>
            </div>
            <Link 
              href="/login" 
              className="bg-[#3a1b5c] text-white font-bold px-6 py-2.5 rounded-xl shadow-md hover:bg-[#4a2375] transition text-sm shrink-0 whitespace-nowrap"
            >
              Sign in to Review
            </Link>
          </div>
        )}

        {/* 2. If User is a Property Host */}
        {user && user.role === 'host' && (
          <div className="p-5 bg-purple-50/80 border border-purple-200 rounded-2xl text-[#3a1b5c] text-xs sm:text-sm flex items-start sm:items-center gap-3 font-medium shadow-2sm">
            <span className="text-lg">🛡️</span>
            <div>
              <strong className="font-extrabold block sm:inline">Host Account Policy: </strong> 
              To maintain transparent and authentic guest feedback, property hosts are strictly restricted from submitting ratings or reviews. Reviews are exclusively open to customer accounts.
            </div>
          </div>
        )}

        {/* 3. If User is a Customer who CAN review, and form is NOT open */}
        {user && user.role === 'user' && canReview && !reviewSubmitted && !isFormOpen && (
          <div className="bg-gradient-to-r from-purple-50/70 via-indigo-50/40 to-red-50/40 border border-purple-100 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-2sm">
            <div className="text-center sm:text-left">
              <h4 className="text-base font-extrabold text-[#3a1b5c] flex items-center justify-center sm:justify-start gap-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" /> Have you experienced this stay?
              </h4>
              <p className="text-sm text-gray-600 mt-1">Rate your stay from 1 to 5 stars and share your honest review to help travelers discover the comfort of this stay!</p>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-[#3a1b5c] text-white px-6 py-2.5 rounded-xl font-extrabold text-sm shadow-md hover:bg-[#4a2375] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0 flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" /> Write a Review & Rate
            </button>
          </div>
        )}

        {/* 4. If Review form IS open */}
        {user && user.role === 'user' && canReview && !reviewSubmitted && isFormOpen && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-gray-500 hover:text-gray-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer bg-gray-100 px-3 py-1.5 rounded-lg"
              >
                <X size={14} /> Cancel
              </button>
            </div>
            <ReviewForm
              propertyId={propertyId}
              bookingId={eligibleBookingId}
              onReviewSubmitted={handleReviewSubmitted}
            />
          </div>
        )}

        {/* 5. If User already reviewed this property */}
        {user && user.role === 'user' && !canReview && !loading && !reviewSubmitted && (
          <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-blue-900 text-sm flex items-center gap-3 font-medium">
            <span className="text-base">✨</span>
            <span>You have already submitted your star rating and review for this stay. Thank you for contributing to the Mahastay traveler community!</span>
          </div>
        )}
      </div>

      {reviewSubmitted && (
        <div className="flex items-center gap-3 p-5 bg-green-50 border border-green-200 rounded-2xl text-green-800 font-medium shadow-2sm animate-fade-in-scale">
          <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
          <div>
            <strong className="font-extrabold block">Thank you!</strong>
            <span className="text-sm">Your star rating and review have been published instantly below.</span>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {reviews.map((review) => (
            <div key={review._id} className="flex flex-col gap-3 group bg-white border border-gray-100 p-6 rounded-2xl shadow-[0_2px_15px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_25px_rgb(0,0,0,0.08)] transition-all">
              {/* Reviewer info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#3a1b5c] text-white flex items-center justify-center font-extrabold text-sm uppercase shadow-sm">
                    {review.user?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-bold text-[#3a1b5c] text-sm sm:text-base">{review.user?.name || 'Verified Traveler'}</p>
                    <p className="text-[11px] font-semibold text-gray-400 tracking-wide uppercase">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                
                {/* Delete button for own reviews or admin */}
                {user && (user._id === review.user._id || user.role === 'admin') && (
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    title="Delete Review"
                    className="opacity-80 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Stars and title */}
              <div className="flex flex-col gap-1.5 mt-1">
                <StarDisplay rating={review.rating} />
                <p className="font-extrabold text-[#3a1b5c] text-base">{review.title}</p>
              </div>

              {/* Comment */}
              <p className="text-sm text-gray-600 leading-relaxed font-normal">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300 stroke-[1.5]" />
          <p className="font-bold text-gray-700 text-lg">No guest reviews yet</p>
          <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">Be the first verified customer traveler to rate and review your stay experience at this property!</p>
        </div>
      )}
    </div>
  );
}
