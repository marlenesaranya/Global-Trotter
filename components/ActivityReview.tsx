
import React, { useState } from 'react';

interface ActivityReviewProps {
  initialRating?: number;
  initialReview?: string;
  onSave: (rating: number, review: string) => void;
}

const ActivityReview: React.FC<ActivityReviewProps> = ({ initialRating = 0, initialReview = '', onSave }) => {
  const [rating, setRating] = useState(initialRating);
  const [review, setReview] = useState(initialReview);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(rating, review);
    setIsEditing(false);
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
      {!isEditing && !initialRating && !initialReview ? (
        <button 
          onClick={() => setIsEditing(true)}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Add your review
        </button>
      ) : isEditing ? (
        <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button 
                key={star} 
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
            ))}
          </div>
          <textarea
            className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
            placeholder="How was it? Any tips for others?"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={2}
          />
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-[10px] font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md uppercase"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-3 py-1.5 text-[10px] font-bold bg-indigo-600 text-white rounded-md uppercase shadow-sm"
            >
              Save Review
            </button>
          </div>
        </div>
      ) : (
        <div className="group relative">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg 
                  key={star} 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-3.5 w-3.5 ${star <= (initialRating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Your Review</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 italic">"{initialReview}"</p>
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute -top-1 right-0 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-indigo-500 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityReview;
