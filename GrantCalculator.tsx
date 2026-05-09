import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, 
  Battery, 
  Zap, 
  Map as MapIcon, 
  Calculator, 
  BookOpen, 
  Menu,
  X,
  Moon,
  Home as HomeIcon,
  TrendingUp,
  Layout,
  ShieldCheck,
  ClipboardList,
  Heart
} from 'lucide-react';
import { cn } from '../lib/utils';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Navigation({ 
  activeTab, 
  setActiveTab, 
  isMenuOpen, 
  setIsMenuOpen,
  isDarkMode,
  toggleDarkMode 
}: NavigationProps) {
  const menuItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'solar', label: 'Solar Intel', icon: Sun },
    { id: 'roof', label: 'Roof Designer', icon: Layout },
    { id: 'ecosystem', label: 'Ecosystem', icon: Zap },
    { id: 'quote-checker', label: 'Quote Checker', icon: ShieldCheck },
    { id: 'tariffs', label: 'Tariffs', icon: TrendingUp },
    { id: 'grants', label: 'Grants', icon: Calculator },
    { id: 'roadmap', label: 'Roadmap', icon: ClipboardList },
    { id: 'support', label: 'Support', icon: Heart },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div 
            className="flex items-center cursor-pointer group" 
            onClick={() => setActiveTab('home')}
            id="helios-logo"
          >
            <div className="mr-3 overflow-hidden rounded-xl shadow-lg shadow-brand-yellow/10 group-hover:scale-105 transition-transform duration-300">
              <img 
                src="assets/images/helios_logo.png" 
                alt="Helios Logo" 
                className="h-10 w-10 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight">
              HELIOS<span className="text-brand-yellow">UK</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-2",
                  activeTab === item.id 
                    ? "bg-brand-yellow text-brand-black shadow-md" 
                    : "text-brand-grey hover:bg-brand-grey-light/20 dark:hover:bg-white/5 hover:text-brand-black dark:hover:text-white"
                )}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </button>
            ))}
            
            <div className="h-6 w-px bg-brand-grey-light/30 mx-4" />
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-brand-grey-light/20 dark:hover:bg-white/5 text-brand-grey hover:text-brand-black dark:hover:text-white transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-brand-grey"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-brand-grey hover:text-brand-black dark:hover:text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-brand-grey-light/20"
          >
            <div className="px-4 py-6 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl text-left font-medium flex items-center space-x-3 transition-all",
                    activeTab === item.id 
                      ? "bg-brand-yellow text-brand-black" 
                      : "text-brand-grey hover:bg-brand-grey-light/20 dark:hover:bg-white/5"
                  )}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
