
import React, { useState } from 'react';
import { TripItinerary } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import PackingList from './PackingList';
import AIChat from './AIChat';
import TripNotes from './TripNotes';
import ActivityReview from './ActivityReview';

interface ItineraryViewProps {
  data: TripItinerary;
  onReset: () => void;
  onSave: (trip: TripItinerary) => void;
  onUpdate: (trip: TripItinerary) => void;
  isSaved: boolean;
}

const ItineraryView: React.FC<ItineraryViewProps> = ({ data, onReset, onSave, onUpdate, isSaved }) => {
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    const text = `Check out my ${data.duration} trip to ${data.destination} planned with GlobeTrotter! Total Budget: ${data.currency}${data.totalBudget}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Trip to ${data.destination}`,
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      await navigator.clipboard.writeText(text);
      setSharing(true);
      setTimeout(() => setSharing(false), 2000);
    }
  };

  const getMapUrl = (title: string, location: string, city: string) => {
    const query = `${title}, ${location}, ${city}, ${data.destination}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };

  const handleUpdateNotes = (notes: string) => {
    onUpdate({ ...data, personalNotes: notes });
  };

  const handleUpdateActivityReview = (dayNum: number, activityIdx: number, rating: number, review: string) => {
    const newItinerary = [...data.itinerary];
    const day = { ...newItinerary.find(d => d.dayNumber === dayNum)! };
    const activities = [...day.activities];
    activities[activityIdx] = {
      ...activities[activityIdx],
      personalRating: rating,
      personalReview: review
    };
    day.activities = activities;
    const dayIdx = newItinerary.findIndex(d => d.dayNumber === dayNum);
    newItinerary[dayIdx] = day;

    onUpdate({ ...data, itinerary: newItinerary });
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          Back to Home
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 leading-tight">Your Trip to {data.destination}</h1>
          <div className="flex flex-wrap gap-4 text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {data.duration}
            </span>
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {data.travelers}
            </span>
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {data.currency}{data.totalBudget.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={handleShare}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {sharing ? 'Copied!' : 'Share'}
          </button>
          <button
            onClick={() => onSave(data)}
            disabled={isSaved}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${isSaved
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 dark:shadow-none'
              }`}
          >
            {isSaved ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Saved
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Save Trip
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Itinerary */}
        <div className="lg:col-span-2 space-y-8">
          {data.itinerary.map((day) => (
            <div key={day.dayNumber} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-all">
              <div className="bg-indigo-50 dark:bg-slate-700/50 px-6 py-4 flex justify-between items-center border-b border-indigo-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <span className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm shadow-indigo-200 dark:shadow-none">
                    {day.dayNumber}
                  </span>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">Day {day.dayNumber}: {day.city}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 dark:text-slate-400 mb-6 italic text-sm">{day.summary}</p>
                <div className="space-y-8 relative before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-700">
                  {day.activities.map((activity, idx) => (
                    <div key={idx} className="relative pl-10">
                      <div className="absolute left-[6px] top-1.5 w-3 h-3 rounded-full bg-indigo-400 border-2 border-white dark:border-slate-800 shadow-sm"></div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div className="flex-1">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">{activity.time}</span>
                          <h4 className="font-bold text-slate-800 dark:text-white text-lg leading-tight mb-1">{activity.title}</h4>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">{activity.description}</p>
                          <div className="flex flex-wrap items-center gap-4 mt-3">
                            <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {activity.location}
                            </div>
                            <a
                              href={getMapUrl(activity.title, activity.location, day.city)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all shadow-sm"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              VIEW ON MAP
                            </a>
                          </div>
                          {/* Activity Review Section */}
                          <ActivityReview
                            initialRating={activity.personalRating}
                            initialReview={activity.personalReview}
                            onSave={(rating, review) => handleUpdateActivityReview(day.dayNumber, idx, rating, review)}
                          />
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700 self-start">
                          {data.currency}{activity.estimatedCost.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Trip Notes Section */}
          <TripNotes
            initialNotes={data.personalNotes || ''}
            onSave={handleUpdateNotes}
          />

          {/* Budget Breakdown Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Budget Summary</h3>

            <div className="h-[200px] w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.budgetBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="amount"
                  >
                    {data.budgetBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || '#4F46E5'} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${data.currency}${value.toLocaleString()}`}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: '#1e293b', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              {data.budgetBreakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-xs">{item.category}</h4>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{item.description}</p>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-xs whitespace-nowrap">
                    {data.currency}{item.amount.toLocaleString()}
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 mt-2 border-t-2 border-dashed border-slate-100 dark:border-slate-700">
                <span className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Total</span>
                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{data.currency}{data.totalBudget.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Interactive Packing List */}
          <PackingList items={data.packingList} tripId={data.id} />
        </div>
      </div>

      <AIChat trip={data} />
    </div>
  );
};

export default ItineraryView;
