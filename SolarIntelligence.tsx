/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, 
  Battery, 
  Zap, 
  Map as MapIcon, 
  Calculator, 
  BookOpen, 
  MessageSquare, 
  ChevronRight,
  Menu,
  X,
  Plus,
  ArrowRight,
  Globe,
  Home as HomeIcon,
  Search,
  ShoppingCart,
  Lightbulb,
  Thermometer,
  ShieldCheck,
  TrendingDown,
  ExternalLink
} from 'lucide-react';
import { cn } from './lib/utils';

// Pages/Tabs
import Home from './pages/Home';
import SolarIntelligence from './pages/SolarIntelligence';
import RoofDesigner from './pages/RoofDesigner';
import Ecosystem from './pages/Ecosystem';
import KnowledgeHub from './pages/KnowledgeHub';
import GrantCalculator from './pages/GrantCalculator';
import TariffOptimiser from './pages/TariffOptimiser';
import Roadmap from './pages/Roadmap';
import QuoteChecker from './pages/QuoteChecker';
import Support from './pages/Support';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';

// Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark as per Helios branding

  // Global System Configuration
  const [solarSize, setSolarSize] = useState(4.3); // Initial value from default 10 * 430w
  const [batterySize, setBatterySize] = useState(9.5);
  const [hasEV, setHasEV] = useState(true);
  const [tariff, setTariff] = useState('octopus-intelligent');

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [isDarkMode]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Home onNavigate={setActiveTab} />;
      case 'solar': return (
        <SolarIntelligence 
          onNavigate={setActiveTab} 
          currentSolarSize={solarSize}
          onUpdateSolarSize={setSolarSize}
        />
      );
      case 'roof': return <RoofDesigner onNavigate={setActiveTab} />;
      case 'ecosystem': return (
        <Ecosystem 
          onNavigate={setActiveTab} 
          solarSize={solarSize}
          setSolarSize={setSolarSize}
          batterySize={batterySize}
          setBatterySize={setBatterySize}
          hasEV={hasEV}
          setHasEV={setHasEV}
          tariff={tariff}
          setTariff={setTariff}
        />
      );
      case 'knowledge': return <KnowledgeHub />;
      case 'grants': return <GrantCalculator onNavigate={setActiveTab} />;
      case 'tariffs': return <TariffOptimiser onNavigate={setActiveTab} />;
      case 'roadmap': return <Roadmap />;
      case 'quote-checker': return <QuoteChecker />;
      case 'support': return <Support />;
      case 'privacy': return <PrivacyPolicy />;
      case 'terms': return <TermsOfService />;
      case 'cookies': return <CookiePolicy />;
      default: return <Home onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col font-sans selection:bg-brand-yellow selection:text-brand-black transition-colors duration-300",
      isDarkMode ? "dark bg-brand-black text-white" : "bg-white text-brand-black"
    )}>
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
      
      <main className="flex-grow pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer onNavigate={setActiveTab} />
      
      {/* Knowledge Hub Shortcut (Replacing AI Widget) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setActiveTab('knowledge')}
        className="fixed bottom-6 right-6 p-4 bg-brand-yellow text-brand-black rounded-full shadow-2xl z-50 flex items-center space-x-2 group"
      >
        <BookOpen size={24} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold whitespace-nowrap px-0 group-hover:px-2">
          Knowledge Hub
        </span>
      </motion.button>
    </div>
  );
}
