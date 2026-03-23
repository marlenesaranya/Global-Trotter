
import React, { useState, useEffect } from 'react';

interface TripNotesProps {
  initialNotes: string;
  onSave: (notes: string) => void;
}

const TripNotes: React.FC<TripNotesProps> = ({ initialNotes, onSave }) => {
  const [notes, setNotes] = useState(initialNotes);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  const handleBlur = () => {
    setIsSaving(true);
    onSave(notes);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="bg-amber-50 dark:bg-slate-800 rounded-2xl shadow-sm border border-amber-100 dark:border-slate-700 p-6 relative overflow-hidden">
      {/* Texture/Decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          Travel Journal
        </h3>
        {isSaving && (
          <span className="text-[10px] font-bold text-indigo-500 uppercase animate-pulse">Saving...</span>
        )}
      </div>

      <textarea
        className="w-full h-40 bg-transparent border-none focus:ring-0 text-slate-700 dark:text-slate-300 text-sm leading-relaxed placeholder:text-slate-400 resize-none"
        placeholder="Write down flight info, reservation codes, or memories..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={handleBlur}
      />
      
      <div className="mt-4 pt-4 border-t border-amber-100 dark:border-slate-700 flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Your notes are saved locally
      </div>
    </div>
  );
};

export default TripNotes;
