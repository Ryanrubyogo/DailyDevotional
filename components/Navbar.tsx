import React from 'react';
import { User, BookOpen, LogOut, Menu, X } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  user: UserType | null;
  onNavigate: (view: any) => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onNavigate, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navLinkClass = "cursor-pointer hover:text-rose-800 transition-colors font-medium text-stone-600";

  return (
    <nav className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm border-b border-stone-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer gap-2" 
            onClick={() => onNavigate('home')}
          >
            <div className="p-2 bg-rose-100 rounded-full text-rose-800">
              <BookOpen size={20} />
            </div>
            <span className="font-serif text-xl font-bold text-stone-800 tracking-tight">Grace & Daily Bread</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => onNavigate('home')} className={navLinkClass}>Home</button>
            <button onClick={() => onNavigate('devotional-list')} className={navLinkClass}>Daily Readings</button>
            {user?.isAdmin && (
              <button onClick={() => onNavigate('admin')} className="text-rose-600 font-semibold hover:text-rose-800">
                Admin Panel
              </button>
            )}
            
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-stone-200">
                <span className="text-sm text-stone-500">Hello, {user.name}</span>
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => onNavigate('login')}
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 rounded-full transition-all shadow-md hover:shadow-lg"
              >
                <User size={14} />
                Member Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-stone-600 p-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-stone-100">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <button 
              onClick={() => { onNavigate('home'); setIsMenuOpen(false); }} 
              className="block w-full text-left py-3 text-stone-600 font-medium border-b border-stone-50"
            >
              Home
            </button>
            <button 
              onClick={() => { onNavigate('devotional-list'); setIsMenuOpen(false); }} 
              className="block w-full text-left py-3 text-stone-600 font-medium border-b border-stone-50"
            >
              Daily Readings
            </button>
            {user?.isAdmin && (
              <button 
                onClick={() => { onNavigate('admin'); setIsMenuOpen(false); }} 
                className="block w-full text-left py-3 text-rose-600 font-medium border-b border-stone-50"
              >
                Admin Panel
              </button>
            )}
            <div className="pt-4">
              {user ? (
                <button 
                  onClick={() => { onLogout(); setIsMenuOpen(false); }}
                  className="w-full flex justify-center items-center gap-2 px-4 py-3 text-stone-600 bg-stone-100 rounded-lg"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              ) : (
                <button 
                  onClick={() => { onNavigate('login'); setIsMenuOpen(false); }}
                  className="w-full flex justify-center items-center gap-2 px-4 py-3 text-white bg-rose-500 hover:bg-rose-600 rounded-lg shadow-md"
                >
                  <User size={16} /> Member Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;