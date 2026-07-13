'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, MessageSquare, CheckCircle2, Loader2, Trash2 } from 'lucide-react';
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
    if (!user) return;
    try {
      const res = await api.get(`/reviews/can-review/${propertyId}`);
      setCanReview(res.data.canReview);
      if (res.data.canReview) {
        setEligibleBookingId(res.data.bookingId);
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
    fetchReviews(); // Re-fetch to show new review instantly
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete your review?')) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      fetchReviews();
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
    <div className="border-t pt-8 space-y-8">
      <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
        {totalReviews > 0 ? `${avgRating.toFixed(1)} · ${totalReviews} Review${totalReviews !== 1 ? 's' : ''}` : 'No Reviews Yet'}
      </h3>

      {/* Rating summary bar */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-2xl p-6">
          {/* Average score */}
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-6xl font-bold text-gray-900">{avgRating.toFixed(1)}</span>
            <StarDisplay rating={avgRating} size="lg" />
            <span className="text-sm text-gray-500">out of 5</span>
          </div>

          {/* Distribution bars */}
          <div className="space-y-2">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-600 w-3">{star}</span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-4 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Submission */}
      {user && canReview && eligibleBookingId && !reviewSubmitted && (
        <ReviewForm
          propertyId={propertyId}
          bookingId={eligibleBookingId}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}

      {reviewSubmitted && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="font-medium">Thank you! Your review has been submitted successfully.</p>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div key={review._id} className="flex flex-col gap-3 group">
              {/* Reviewer info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-sm uppercase">
                    {review.user?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{review.user?.name || 'Guest'}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                {/* Delete button for own reviews or admin */}
                {user && (user._id === review.user._id || user.role === 'admin') && (
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Stars and title */}
              <div className="flex flex-col gap-1">
                <StarDisplay rating={review.rating} />
                <p className="font-semibold text-gray-900 text-sm">{review.title}</p>
              </div>

              {/* Comment */}
              <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="font-medium text-gray-700">No reviews yet</p>
          <p className="text-sm mt-1">Be the first to share your experience at this property!</p>
        </div>
      )}
    </div>
  );
}
