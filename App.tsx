import React, { useState, useEffect } from 'react';
import { ArrowRight, Heart, Calendar as CalendarIcon, Users, ChevronRight, Lock } from 'lucide-react';
import Navbar from './components/Navbar';
import Calendar from './components/Calendar';
import AdminPanel from './components/AdminPanel';
import { User, Devotional, ViewState } from './types';
import { ADMIN_EMAIL, MOCK_DEVOTIONALS } from './constants';

// Simple Login Component Internal
const LoginForm = ({ onLogin, onCancel }: { onLogin: (e: string, p: string) => void, onCancel: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden mt-12">
      <div className="bg-rose-50 text-rose-900 p-6 border-b border-rose-100 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white text-rose-500 mb-3 shadow-sm">
          <Lock size={20} />
        </div>
        <h2 className="text-2xl font-serif font-medium">Welcome Back</h2>
        <p className="text-rose-700 text-sm mt-1">Please sign in to continue</p>
      </div>
      
      <div className="p-8">
        <form onSubmit={(e) => { e.preventDefault(); onLogin(email, password); }} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Email Address</label>
            <input 
              type="email" 
              required 
              className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-300 outline-none transition-all"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Password</label>
            <input 
              type="password" 
              required 
              className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-rose-200 focus:border-rose-300 outline-none transition-all"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="pt-2 space-y-3">
            <button className="w-full bg-rose-500 text-white py-3 rounded-lg font-medium hover:bg-rose-600 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200">
              Sign In
            </button>
            <button type="button" onClick={onCancel} className="w-full text-stone-500 text-sm hover:text-stone-800 py-2">
              Cancel
            </button>
          </div>
        </form>
        <div className="mt-6 text-center text-xs text-stone-400">
          For Demo: Use <strong>admin@grace.com</strong> to access Admin features.
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('home');
  const [devotionals, setDevotionals] = useState<Devotional[]>(() => {
    const saved = localStorage.getItem('devotionals');
    return saved ? JSON.parse(saved) : MOCK_DEVOTIONALS;
  });
  const [selectedDevotionalId, setSelectedDevotionalId] = useState<string | null>(null);

  // Save to local storage when updated
  useEffect(() => {
    localStorage.setItem('devotionals', JSON.stringify(devotionals));
  }, [devotionals]);

  const handleLogin = (email: string) => {
    // Simple mock login logic
    const isAdmin = email.toLowerCase() === ADMIN_EMAIL;
    setUser({
      id: '123',
      email,
      name: email.split('@')[0],
      isAdmin
    });
    setView('home');
  };

  const handleLogout = () => {
    setUser(null);
    setView('home');
  };

  const handleSaveDevotional = (newDevotional: Devotional) => {
    setDevotionals(prev => {
      // Update if exists, else add
      const index = prev.findIndex(d => d.date === newDevotional.date);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = newDevotional;
        return updated;
      }
      return [...prev, newDevotional];
    });
  };

  const handleDateSelect = (date: string) => {
    const devotional = devotionals.find(d => d.date === date);
    if (devotional) {
      setSelectedDevotionalId(devotional.id);
      setView('devotional-detail');
    } else {
        // If admin, can go to create
        if (user?.isAdmin) {
             if(confirm("No devotional found for this date. Create one?")) {
                 setView('admin');
                 // Ideally pass the date to admin panel, but for simplicity we rely on user selecting it again
             }
        } else {
            alert("No devotional prepared for this date yet.");
        }
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'login':
        return <LoginForm onLogin={handleLogin} onCancel={() => setView('home')} />;

      case 'admin':
        if (!user?.isAdmin) return <div className="text-center p-12">Access Denied</div>;
        return <AdminPanel onSave={handleSaveDevotional} existingDevotionals={devotionals} />;

      case 'devotional-list':
        return (
          <div className="max-w-4xl mx-auto">
             <h2 className="text-3xl font-serif text-stone-800 mb-8 text-center">Daily Readings</h2>
             <div className="grid gap-6">
                {devotionals.sort((a,b) => b.date.localeCompare(a.date)).map(devotional => (
                  <div key={devotional.id} className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                    {devotional.imageUrl && (
                      <div className="w-full md:w-48 h-32 bg-stone-200 rounded-lg overflow-hidden shrink-0">
                        <img src={devotional.imageUrl} alt={devotional.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wider rounded-full">{devotional.category}</span>
                        <span className="text-stone-400 text-sm">{devotional.date}</span>
                      </div>
                      <h3 className="text-xl font-serif font-semibold text-stone-800 mb-2">{devotional.title}</h3>
                      <p className="text-stone-600 line-clamp-2 mb-4">{devotional.content}</p>
                      <button 
                        onClick={() => { setSelectedDevotionalId(devotional.id); setView('devotional-detail'); }}
                        className="text-rose-600 font-medium text-sm hover:text-rose-800 flex items-center gap-1"
                      >
                        Read Devotional <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'devotional-detail':
        const activeDevotional = devotionals.find(d => d.id === selectedDevotionalId);
        if (!activeDevotional) return <div>Not found</div>;
        return (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-100">
            {activeDevotional.imageUrl && (
              <div className="h-64 w-full relative">
                <img src={activeDevotional.imageUrl} alt={activeDevotional.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-bold uppercase tracking-wider rounded-full mb-3 inline-block">{activeDevotional.category}</span>
                  <h1 className="text-4xl font-serif font-bold">{activeDevotional.title}</h1>
                </div>
              </div>
            )}
            {!activeDevotional.imageUrl && (
               <div className="p-8 pb-0">
                  <span className="px-3 py-1 bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wider rounded-full mb-3 inline-block">{activeDevotional.category}</span>
                  <h1 className="text-4xl font-serif font-bold text-stone-800">{activeDevotional.title}</h1>
               </div>
            )}
            <div className="p-8 lg:p-12">
              <div className="flex items-center gap-2 text-stone-400 mb-8 text-sm border-b border-stone-100 pb-4">
                <CalendarIcon size={16} />
                {new Date(activeDevotional.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div className="prose prose-stone prose-lg font-serif leading-loose text-stone-700">
                <p>{activeDevotional.content}</p>
              </div>
              <div className="mt-12 pt-8 border-t border-stone-100 flex justify-between items-center">
                 <button onClick={() => setView('devotional-list')} className="text-stone-500 hover:text-stone-800 font-medium text-sm">
                   ← Back to List
                 </button>
                 <button className="bg-rose-500 text-white px-6 py-3 rounded-full hover:bg-rose-600 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg">
                   <Heart size={18} className="text-white fill-white/20" /> Mark as Read
                 </button>
              </div>
            </div>
          </div>
        );

      case 'home':
      default:
        return (
          <div className="space-y-16">
            {/* Hero Section */}
            <div className="text-center space-y-6 py-12">
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-800 tracking-tight">
                Daily Grace <span className="text-rose-400 italic">&</span> Bread
              </h1>
              <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
                A quiet space for your daily walk. Find peace, purpose, and community in the reading of the word.
              </p>
              {!user && (
                <button onClick={() => setView('login')} className="bg-rose-500 text-white px-8 py-3 rounded-full hover:bg-rose-600 transition-all shadow-lg hover:shadow-xl font-medium transform hover:-translate-y-0.5">
                  Join Our Community
                </button>
              )}
            </div>

            {/* About Section */}
            <div className="grid md:grid-cols-2 gap-12 items-center bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-stone-100">
              <div className="order-2 md:order-1 space-y-6">
                <h2 className="text-3xl font-serif font-semibold text-stone-800">About Us</h2>
                <div className="w-16 h-1 bg-rose-200 rounded-full"></div>
                <p className="text-stone-600 leading-relaxed">
                  We believe that starting your day with intention changes everything. This project was born out of a desire to create a simple, clutter-free digital sanctuary where you can focus on what truly matters.
                </p>
                <p className="text-stone-600 leading-relaxed">
                  Inspired by the warmth of a well-worn Bible and the comfort of a morning coffee, our app brings that physical tranquility to your digital device.
                </p>
              </div>
              <div className="order-1 md:order-2 h-64 md:h-full bg-stone-200 rounded-2xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&q=80&w=1000" alt="Bible Study" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </div>

            {/* Calendar Section */}
            <div className="grid md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-5 space-y-6">
                <div className="bg-rose-50 p-8 rounded-3xl">
                  <h3 className="text-2xl font-serif font-semibold text-rose-900 mb-4">Daily Devotionals</h3>
                  <p className="text-rose-800/80 mb-6">
                    Each day brings a new message. Click on a date to reveal the devotional prepared for you.
                  </p>
                  <button onClick={() => setView('devotional-list')} className="flex items-center gap-2 text-rose-700 font-semibold hover:text-rose-900 transition-colors">
                    View Full List <ArrowRight size={18} />
                  </button>
                </div>
                <div className="bg-stone-800 text-stone-100 p-8 rounded-3xl">
                  <h3 className="text-2xl font-serif font-semibold mb-4">Join Us</h3>
                  <p className="text-stone-300 mb-6">
                    Become a part of our growing community. Sign up to track your reading progress and save your favorite passages.
                  </p>
                  <button onClick={() => user ? null : setView('login')} className="w-full bg-white text-stone-900 py-3 rounded-lg font-medium hover:bg-stone-100 transition-colors shadow-lg">
                    {user ? "Welcome Back!" : "Sign Up Now"}
                  </button>
                </div>
              </div>
              
              <div className="md:col-span-7">
                <Calendar devotionals={devotionals} onSelectDate={handleDateSelect} />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <Navbar 
        user={user} 
        onNavigate={setView} 
        onLogout={handleLogout} 
      />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {renderContent()}
      </main>

      <footer className="bg-stone-100 border-t border-stone-200 py-12 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-stone-500">
          <p className="font-serif text-lg text-stone-700 mb-4">Grace & Daily Bread</p>
          <p className="text-sm">© {new Date().getFullYear()} Daily Devotional Project. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}