import React from 'react';
import { 
  Droplet, 
  Sun, 
  Moon, 
  MapPin, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles, 
  Search, 
  PlusCircle, 
  ClipboardList, 
  TrendingUp, 
  Compass,
  FileCode2,
  Users
} from 'lucide-react';
import { UserRole, TNCity } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  selectedCity: TNCity;
  setSelectedCity: (city: TNCity) => void;
  onResetDemoData: () => void;
  language: 'en' | 'ta';
  setLanguage: (lang: 'en' | 'ta') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  theme,
  setTheme,
  selectedCity,
  setSelectedCity,
  onResetDemoData,
  language,
  setLanguage,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-200 bg-white/90 border-slate-200 dark:bg-slate-950/90 dark:border-slate-800">
      {/* Top Banner with Tamil Nadu Tagline */}
      <div className="bg-sky-50 dark:bg-slate-900 border-b border-sky-100 dark:border-slate-800/80 px-4 py-1 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sky-800 dark:text-sky-300">
              Tamil Nadu Circular Water Initiative
            </span>
            <span className="text-slate-400 dark:text-slate-600">·</span>
            <span className="italic text-slate-600 dark:text-slate-400 font-medium">
              “Wastewater-ku oru Second Life.”
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* City Selector */}
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <MapPin className="w-3 h-3 text-sky-600 dark:text-sky-400" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value as TNCity)}
                aria-label="Filter listings by Tamil Nadu city"
                className="bg-transparent font-medium focus:outline-none cursor-pointer text-xs"
              >
                <option value="Salem" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Salem</option>
                <option value="Chennai" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Chennai</option>
                <option value="Coimbatore" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Coimbatore</option>
                <option value="Madurai" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Madurai</option>
                <option value="Tiruppur" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Tiruppur</option>
                <option value="Tiruchirappalli" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Tiruchirappalli</option>
                <option value="Erode" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Erode</option>
                <option value="Vellore" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Vellore</option>
                <option value="Thoothukudi" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Thoothukudi</option>
              </select>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
              className="px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 text-[11px] font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              title="Toggle English / தமிழ்"
            >
              {language === 'en' ? 'தமிழ்' : 'English'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <div 
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-105 transition-transform">
            <Droplet className="w-5 h-5 fill-sky-500/30" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white block leading-tight">
              Water Has a Second Life
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block -mt-0.5">
              Tamil Nadu Circular Marketplace
            </span>
          </div>
        </div>

        {/* Clean Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('landing')}
            className={`transition-colors py-1 ${
              activeTab === 'landing'
                ? 'text-sky-600 dark:text-sky-400 font-semibold border-b-2 border-sky-500'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {language === 'ta' ? 'முகப்பு' : 'Home'}
          </button>

          <button
            onClick={() => setActiveTab('find-water')}
            className={`transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'find-water'
                ? 'text-sky-600 dark:text-sky-400 font-semibold border-b-2 border-sky-500'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Search className="w-4 h-4 opacity-75" />
            {language === 'ta' ? 'தண்ணீர் தேட' : 'Find Water'}
          </button>

          <button
            onClick={() => setActiveTab('smart-match')}
            className={`transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'smart-match'
                ? 'text-sky-600 dark:text-sky-400 font-semibold border-b-2 border-sky-500'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            {language === 'ta' ? 'பொருத்தம்' : 'Smart Match'}
          </button>

          <button
            onClick={() => setActiveTab('list-water')}
            className={`transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'list-water'
                ? 'text-sky-600 dark:text-sky-400 font-semibold border-b-2 border-sky-500'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <PlusCircle className="w-4 h-4 opacity-75" />
            {language === 'ta' ? 'வழங்க' : 'List Water'}
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'requests'
                ? 'text-sky-600 dark:text-sky-400 font-semibold border-b-2 border-sky-500'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ClipboardList className="w-4 h-4 opacity-75" />
            {language === 'ta' ? 'கோரிக்கைகள்' : 'Requests'}
          </button>

          <button
            onClick={() => setActiveTab('impact')}
            className={`transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'impact'
                ? 'text-sky-600 dark:text-sky-400 font-semibold border-b-2 border-sky-500'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            {language === 'ta' ? 'தாக்கம்' : 'Impact'}
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'admin'
                ? 'text-sky-600 dark:text-sky-400 font-semibold border-b-2 border-sky-500'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-sky-500" />
            Admin
          </button>

          <button
            onClick={() => setActiveTab('tech-specs')}
            className={`transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'tech-specs'
                ? 'text-sky-600 dark:text-sky-400 font-semibold border-b-2 border-sky-500'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FileCode2 className="w-4 h-4 opacity-75" />
            PRD & PostGIS
          </button>
        </nav>

        {/* Action Controls: Role Switcher, Theme Toggle & Reset */}
        <div className="flex items-center gap-3">
          {/* Role Switcher Pill */}
          <div className="flex items-center text-xs p-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                setUserRole('buyer');
                if (activeTab === 'list-water') setActiveTab('find-water');
              }}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                userRole === 'buyer'
                  ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Buyer
            </button>
            <button
              onClick={() => {
                setUserRole('supplier');
                if (activeTab === 'find-water') setActiveTab('list-water');
              }}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                userRole === 'supplier'
                  ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Supplier
            </button>
            <button
              onClick={() => {
                setUserRole('admin');
                setActiveTab('admin');
              }}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                userRole === 'admin'
                  ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Theme Toggle (☀️ / 🌙) */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Quick Demo Reset Button */}
          <button
            onClick={onResetDemoData}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Load Fresh Tamil Nadu Demo Data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
