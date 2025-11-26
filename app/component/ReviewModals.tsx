"use client";

import { useState, useEffect } from "react";
import { BiX } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  onSuccess?: () => void;
}

export const ReviewModal = ({ isOpen, onClose, productId, onSuccess }: ReviewModalProps) => {
  const [reviewerName, setReviewerName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewer_name: reviewerName.trim(),
          review_text: reviewText.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      // Reset form and show success toast
      setReviewerName("");
      setReviewText("");
      setShowToast(true);
      
      // Close modal after a short delay to show toast
      setTimeout(() => {
        onClose();
        setShowToast(false);
      }, 2000);
      
      // Refresh product data if callback provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-30 animate-slide-down">
          <div className="bg-[#2B6646] text-white px-6 py-4 rounded-sm shadow-lg flex items-center gap-3 min-w-[300px] max-w-[90%]">
            <FaCheckCircle className="text-[20px] shrink-0" />
            <span className="text-[14px] font-medium">Thanks for your review!</span>
            <button
              onClick={() => setShowToast(false)}
              className="ml-auto text-white hover:text-gray-200 cursor-pointer shrink-0"
            >
              <BiX className="text-[20px]" />
            </button>
          </div>
        </div>
      )}

      <div className="fixed inset-0 z-20 flex items-center justify-center">
        {/* Backdrop with blur */}
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white text-black rounded-sm w-[90%] max-w-[500px] px-[30px] py-[18px] z-10">
        {/* Close Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="text-black hover:text-gray-600 cursor-pointer"
          >
            <BiX className="text-[24px]" />
          </button>
        </div>

        {/* Modal Header */}
        <div className="mb-5">
          <h2 className="text-[18px] font-semibold">Write a Review</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="reviewer_name" className="text-[12px] font-medium">
              Your Name
            </label>
            <input
              id="reviewer_name"
              name="reviewer_name"
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              className="w-full px-4 py-3 border border-[#9B9A9A] rounded-sm text-[12px] text-black bg-white focus:outline-none focus:border-[#2B6646]"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="review_text" className="text-[12px] font-medium">
              Your Review
            </label>
            <textarea
              id="review_text"
              name="review_text"
              rows={6}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full px-4 py-3 border border-[#9B9A9A] rounded-sm text-[12px] text-black bg-white focus:outline-none focus:border-[#2B6646] resize-none"
              placeholder="Share your thoughts about this product..."
              required
            />
            {error && (
              <p className="text-[11px] text-red-500 mt-1">{error}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-[12px] border border-[#9B9A9A] rounded-sm hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-[12px] bg-[#CDAA44] rounded-sm text-white hover:bg-[#B8993A] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};