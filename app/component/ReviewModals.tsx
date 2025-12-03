"use client";

import { useState, useEffect } from "react";
import { BiX } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";
import { reviewSchema, type ReviewInput } from "../lib/validation";
import { z } from "zod";

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
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; text?: string }>({});
  const [showToast, setShowToast] = useState(false);

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Validate on blur
  const validateField = (field: 'reviewer_name' | 'review_text', value: string) => {
    try {
      if (field === 'reviewer_name') {
        reviewSchema.shape.reviewer_name.parse(value);
        setFieldErrors(prev => ({ ...prev, name: undefined }));
      } else if (field === 'review_text') {
        reviewSchema.shape.review_text.parse(value);
        setFieldErrors(prev => ({ ...prev, text: undefined }));
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessage = err.issues[0]?.message || 'Invalid input';
        if (field === 'reviewer_name') {
          setFieldErrors(prev => ({ ...prev, name: errorMessage }));
        } else {
          setFieldErrors(prev => ({ ...prev, text: errorMessage }));
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});

    // Client-side validation
    const validationResult = reviewSchema.safeParse({
      reviewer_name: reviewerName.trim(),
      review_text: reviewText.trim(),
    });

    if (!validationResult.success) {
      const errors: { name?: string; text?: string } = {};
      validationResult.error.issues.forEach((err) => {
        if (err.path[0] === 'reviewer_name') {
          errors.name = err.message;
        } else if (err.path[0] === 'review_text') {
          errors.text = err.message;
        }
      });
      setFieldErrors(errors);
      setIsSubmitting(false);
      return;
    }

    // Use validated data with proper type
    const validatedData: ReviewInput = validationResult.data;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
          // Handle field-specific errors from server
          const errors: { name?: string; text?: string } = {};
          errorData.errors.forEach((err: { field: string; message: string }) => {
            if (err.field === 'reviewer_name') {
              errors.name = err.message;
            } else if (err.field === 'review_text') {
              errors.text = err.message;
            }
          });
          setFieldErrors(errors);
        }
        throw new Error(errorData.error || 'Failed to submit review');
      }

      // Reset form and show success toast
      setReviewerName("");
      setReviewText("");
      setFieldErrors({});
      setShowToast(true);
      
      // Close modal after a short delay to show toast
      setTimeout(() => {
        onClose();
      }, 500);
      
      // Refresh product data if callback provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen && !showToast) return null;

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

      {isOpen && (
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
              onChange={(e) => {
                setReviewerName(e.target.value);
                if (fieldErrors.name) {
                  validateField('reviewer_name', e.target.value);
                }
              }}
              onBlur={(e) => validateField('reviewer_name', e.target.value)}
              className={`w-full px-4 py-3 border rounded-sm text-[12px] text-black bg-white focus:outline-none focus:border-[#2B6646] ${
                fieldErrors.name ? 'border-red-500' : 'border-[#9B9A9A]'
              }`}
              placeholder="Enter your name"
              maxLength={100}
            />
            {fieldErrors.name && (
              <p className="text-[11px] text-red-500 mt-1">{fieldErrors.name}</p>
            )}
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
              onChange={(e) => {
                setReviewText(e.target.value);
                if (fieldErrors.text) {
                  validateField('review_text', e.target.value);
                }
              }}
              onBlur={(e) => validateField('review_text', e.target.value)}
              className={`w-full px-4 py-3 border rounded-sm text-[12px] text-black bg-white focus:outline-none focus:border-[#2B6646] resize-none ${
                fieldErrors.text ? 'border-red-500' : 'border-[#9B9A9A]'
              }`}
              placeholder="Share your thoughts about this product..."
              maxLength={1000}
            />
            <div className="flex justify-between items-center">
              <div>
                {fieldErrors.text && (
                  <p className="text-[11px] text-red-500 mt-1">{fieldErrors.text}</p>
                )}
                {error && !fieldErrors.text && (
                  <p className="text-[11px] text-red-500 mt-1">{error}</p>
                )}
              </div>
              <p className="text-[10px] text-gray-500">
                {reviewText.length}/1000
              </p>
            </div>
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
              disabled={isSubmitting || !!fieldErrors.name || !!fieldErrors.text}
              className="px-6 py-2 text-[12px] bg-[#CDAA44] rounded-sm text-white hover:bg-[#B8993A] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
      )}
    </>
  );
};