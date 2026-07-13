'use client';

import { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface ReviewFormProps {
  propertyId: string;
  bookingId: string;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({ propertyId, bookingId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a star rating');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await api.post('/reviews', {
        propertyId,
        bookingId,
        rating,
        title,
        comment,
      });
      onReviewSubmitted();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const ratingLabels: { [key: number]: string } = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
      <h4 className="text-lg font-bold text-gray-900 mb-1">Share Your Experience</h4>
      <p className="text-sm text-gray-500 mb-5">Your honest review helps other travellers make better choices.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Star Rating Picker */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Overall Rating</label>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            {(hoverRating || rating) > 0 && (
              <span className="text-sm font-semibold text-amber-600 ml-2">
                {ratingLabels[hoverRating || rating]}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Review Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={100}
            placeholder="Summarize your stay in a few words..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none transition-all text-sm"
          />
        </div>

        {/* Comment */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Your Review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            maxLength={500}
            rows={4}
            placeholder="Tell us about your experience — the location, amenities, host, and anything that stood out..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-brown focus:border-transparent outline-none transition-all resize-none text-sm"
          />
          <p className="text-right text-xs text-gray-400 mt-1">{comment.length}/500</p>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Review'
          )}
        </button>
      </form>
    </div>
  );
}
