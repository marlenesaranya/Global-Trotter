
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TripForm from './components/TripForm';
import ItineraryView from './components/ItineraryView';
import PlaceSearch from './components/PlaceSearch';
import AuthScreen from './components/AuthScreen';
import { generateTravelPlan } from './services/groqService';
import { TripFormData, TripItinerary } from './types';

type HomeTool = 'plan' | 'search';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('gt-session') === 'active';
  });
  const [itinerary, setItinerary] = useState<TripItinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<HomeTool>('plan');

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [savedTrips, setSavedTrips] = useState<TripItinerary[]>(() => {
    const saved = localStorage.getItem('saved-trips');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('gt-session', 'active');
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      setIsAuthenticated(false);
      localStorage.removeItem('gt-session');
      setItinerary(null);
    }
  };

  const handleFormSubmit = async (data: TripFormData) => {
    setLoading(true);
    setError(null);
    try {
      const plan = await generateTravelPlan(data);
      setItinerary(plan);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError("Something went wrong while planning your trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = (trip: TripItinerary) => {
    if (!savedTrips.some(t => t.id === trip.id)) {
      const updated = [trip, ...savedTrips];
      setSavedTrips(updated);
      localStorage.setItem('saved-trips', JSON.stringify(updated));
    }
  };

  const handleUpdateTrip = (updatedTrip: TripItinerary) => {
    setItinerary(updatedTrip);

    // If it's already in saved trips, update the saved version too
    if (savedTrips.some(t => t.id === updatedTrip.id)) {
      const updatedList = savedTrips.map(t => t.id === updatedTrip.id ? updatedTrip : t);
      setSavedTrips(updatedList);
      localStorage.setItem('saved-trips', JSON.stringify(updatedList));
    }
  };

  const handleDeleteTrip = (e: React.MouseEvent, id: string, destination: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete your trip to ${destination}?`)) {
      const updated = savedTrips.filter(t => t.id !== id);
      setSavedTrips(updated);
      localStorage.setItem('saved-trips', JSON.stringify(updated));
      localStorage.removeItem(`packing-${id}`);
    }
  };

  const handleReset = () => {
    setItinerary(null);
    setError(null);
  };

  const navigateToTool = (tool: HomeTool) => {
    setActiveTool(tool);
    setTimeout(() => {
      const element = document.getElementById('dashboard-container');
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const isCurrentSaved = !!itinerary && savedTrips.some(t => t.id === itinerary.id);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onGoHome={handleReset}
        onLogout={handleLogout}
      />

      <main className="flex-grow">
        {!itinerary ? (
          <div className="py-12 md:py-20 px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
                Your Personal <span className="text-indigo-600 dark:text-indigo-400">AI Concierge</span> for Every Adventure
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
                Ready to explore? Plan a complete itinerary or search for the perfect local spots in any city.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
                <button
                  onClick={() => navigateToTool('plan')}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Create New Trip
                </button>
                <button
                  onClick={() => navigateToTool('search')}
                  className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl font-bold shadow-lg border border-slate-100 dark:border-slate-700 hover:border-indigo-500 transition-all flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search Places
                </button>
              </div>
            </div>

            {error && (
              <div className="max-w-2xl mx-auto mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div id="dashboard-container" className="max-w-3xl mx-auto scroll-mt-24">
              <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700">
                <div className="p-6 sm:p-10">
                  {activeTool === 'plan' ? (
                    <TripForm onSubmit={handleFormSubmit} isLoading={loading} />
                  ) : (
                    <PlaceSearch />
                  )}
                </div>
              </div>
            </div>

            {savedTrips.length > 0 && (
              <div className="max-w-6xl mx-auto mt-24">
                <div className="flex justify-between items-center mb-8 px-4 sm:px-0">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Your Saved Trips</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0">
                  {savedTrips.map(trip => (
                    <div
                      key={trip.id}
                      onClick={() => setItinerary(trip)}
                      className="group relative cursor-pointer bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md hover:-translate-y-1 transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a3 3 0 013 3V16.5m-3-12.5A9 9 0 1111 20.945" />
                          </svg>
                        </div>
                        <button
                          onClick={(e) => handleDeleteTrip(e, trip.id, trip.destination)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all focus:outline-none focus:ring-2 focus:ring-red-500/50"
                          aria-label="Delete trip"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{trip.destination}</h3>
                      <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm">
                        <span>{trip.duration}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                        <span>{trip.currency}{trip.totalBudget.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  title: 'Instant Itineraries',
                  desc: 'Day-by-day schedules mapped out with local expertise.',
                  icon: '⚡'
                },
                {
                  title: 'Smart Budgets',
                  desc: 'Clear cost breakdowns tailored to your spending style.',
                  icon: '💰'
                },
                {
                  title: 'Packing Made Easy',
                  desc: 'Interactive lists generated specifically for your destination.',
                  icon: '🎒'
                }
              ].map((feature, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-12">
            <ItineraryView
              data={itinerary}
              onReset={handleReset}
              onSave={handleSaveTrip}
              onUpdate={handleUpdateTrip}
              isSaved={isCurrentSaved}
            />
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 px-4 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a3 3 0 013 3V16.5m-3-12.5A9 9 0 1111 20.945" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">GlobeTrotter</span>
            </div>
            <p className="text-sm max-w-md leading-relaxed">
              Democratizing travel planning through AI. Our mission is to make the world more accessible, one itinerary at a time.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 text-center text-[10px] uppercase tracking-widest text-slate-500">
          &copy; {new Date().getFullYear()} GlobeTrotter AI • Explore fearlessly
        </div>
      </footer>
    </div>
  );
};

export default App;
