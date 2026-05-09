import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Car, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Percent,
  Search,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { cn } from '../lib/utils';

interface TariffOptimiserProps {
  onNavigate: (tab: string) => void;
}

export default function TariffOptimiser({ onNavigate }: TariffOptimiserProps) {
  const [hasEV, setHasEV] = useState(true);
  const [hasBattery, setHasBattery] = useState(true);

  const tariffs = [
    {
      name: 'Octopus Agile',
      type: 'Dynamic half-hourly',
      bestFor: 'Battery Owners & Flexible Users',
      pros: ['Zero or negative prices', 'Max savings if automated'],
      cons: ['Price spikes during peak', 'Requires smart automation'],
      savings: 'High potential',
      link: 'https://share.octopus.energy/new-grove-296'
    },
    {
      name: 'Intelligent Octopus Go',
      type: 'Fixed EV Window',
      bestFor: 'EV Owners',
      pros: ['7p/kWh for 6 hours', 'Smart EV management', 'Cheap whole-home energy'],
      cons: ['Requires compatible car/charger'],
      savings: 'Consistent',
      highlight: true
    },
    {
      name: 'Octopus Cosy',
      type: 'Heat Pump Specific',
      bestFor: 'Heat Pump Owners',
      pros: ['3 cheap windows daily', 'Boosted export rates'],
      cons: ['Less effective without HP'],
      savings: 'Medium'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 flex flex-col md:row items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-display font-bold mb-4">Tariff & Supplier Optimiser</h1>
          <p className="text-brand-grey max-w-2xl">
            Stop overpaying for grid energy. Compare the best UK smart tariffs 
            designed for solar, batteries, and EVs.
          </p>
        </div>
        <a 
          href="https://share.octopus.energy/new-grove-296" 
          target="_blank" 
          rel="noopener noreferrer"
          className="px-6 py-3 bg-brand-yellow/10 text-brand-yellow-dark dark:text-brand-yellow font-bold rounded-xl border border-brand-yellow/20 flex items-center hover:bg-brand-yellow/20 transition-all"
        >
          Get Octopus Referral (£50) <ExternalLink size={16} className="ml-2" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-8 rounded-3xl">
            <h3 className="text-lg font-bold mb-6">Your Setup</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 rounded-xl glass cursor-pointer hover:bg-white/10 transition-all">
                <div className="flex items-center space-x-3">
                  <Car size={20} className="text-blue-500" />
                  <span className="text-sm font-medium">EV Owned</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={hasEV} 
                  onChange={e => setHasEV(e.target.checked)}
                  className="w-5 h-5 accent-brand-yellow"
                />
              </label>
              <label className="flex items-center justify-between p-4 rounded-xl glass cursor-pointer hover:bg-white/10 transition-all">
                <div className="flex items-center space-x-3">
                  <Zap size={20} className="text-brand-yellow" />
                  <span className="text-sm font-medium">Home Battery</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={hasBattery} 
                  onChange={e => setHasBattery(e.target.checked)}
                  className="w-5 h-5 accent-brand-yellow"
                />
              </label>
            </div>

            <div className="mt-8 space-y-4 pt-8 border-t border-brand-grey-light/20 dark:border-white/5">
              <div className="text-xs font-bold uppercase tracking-widest text-brand-grey mb-4">Household usage</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Small Flat</span>
                  <span className="text-brand-grey">2,000 kWh</span>
                </div>
                <div className="h-1 bg-brand-grey-light/20 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-yellow w-[65%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl bg-blue-600/10 border-blue-600/20">
            <h4 className="flex items-center text-blue-500 font-bold text-sm mb-4">
              <Clock size={16} className="mr-2" />
              Smart Window
            </h4>
            <p className="text-sm text-brand-grey leading-relaxed">
              Based on your usage + battery, the <span className="text-brand-black dark:text-white font-bold">00:30–04:30</span> window 
              is key. Charging your battery during this time reduces your daily average cost to <span className="font-bold text-brand-black dark:text-white">8.4p/kWh</span>.
            </p>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tariffs.map((tariff, i) => (
              <motion.div
                key={tariff.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "glass p-8 rounded-[32px] flex flex-col border-2 transition-all group cursor-pointer",
                  tariff.highlight 
                    ? "border-brand-yellow/30 bg-brand-yellow/5 scale-105" 
                    : "border-transparent hover:border-brand-grey-light/30 dark:hover:border-white/10"
                )}
              >
                {tariff.highlight && (
                  <div className="mb-4 inline-flex px-3 py-1 bg-brand-yellow text-brand-black text-[10px] font-bold uppercase tracking-widest rounded-full self-start">
                    Recommended
                  </div>
                )}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-display font-bold mb-1">{tariff.name}</h3>
                    <div className="text-xs text-brand-grey font-medium">{tariff.type}</div>
                  </div>
                  <div className="p-3 bg-brand-grey-light/20 dark:bg-white/5 rounded-2xl">
                    {tariff.name.includes('Go') ? <Car size={24} className="text-blue-500" /> : <TrendingUp size={24} className="text-brand-yellow" />}
                  </div>
                </div>

                <div className="mb-8 p-4 bg-white dark:bg-brand-black/40 rounded-2xl border dark:border-white/5">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-brand-grey mb-2">Best For</div>
                  <div className="text-sm font-bold">{tariff.bestFor}</div>
                </div>

                <div className="space-y-4 mb-8 flex-grow">
                  {tariff.pros.map(pro => (
                    <div key={pro} className="flex items-start space-x-2 text-sm">
                      <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
                      <span>{pro}</span>
                    </div>
                  ))}
                  {tariff.cons.map(con => (
                    <div key={con} className="flex items-start space-x-2 text-sm text-brand-grey">
                      <AlertCircle size={14} className="mt-0.5 shrink-0" />
                      <span>{con}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-brand-grey-light/20 dark:border-white/5 flex items-center justify-between">
                  <div className="text-xs font-bold text-brand-grey">Savings Potential</div>
                  <div className="flex items-center text-sm font-bold text-brand-yellow">
                    {tariff.savings}
                    <ChevronRight size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 glass p-12 rounded-[40px] border-brand-yellow/10">
            <div className="flex flex-col md:row items-center gap-12">
              <div className="flex-1 space-y-6 text-center md:text-left">
                <h3 className="text-3xl font-display font-bold">SEG Export Comparison</h3>
                <p className="text-brand-grey leading-relaxed">
                  Don't give your energy away for free. Smart export tariffs like 
                  <span className="text-brand-black dark:text-white font-bold"> Octopus Outgoing</span> pay up to 15p/kWh, compared 
                  to the standard 3-5p.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass p-4 rounded-2xl text-center">
                    <div className="text-2xl font-display font-bold text-brand-yellow">15p</div>
                    <div className="text-[10px] uppercase font-bold text-brand-grey">Octopus Outgoing</div>
                  </div>
                  <div className="glass p-4 rounded-2xl text-center">
                    <div className="text-2xl font-display font-bold text-brand-grey">4.2p</div>
                    <div className="text-[10px] uppercase font-bold text-brand-grey">Standard SEG</div>
                  </div>
                </div>
              </div>
              <div className="w-px h-32 bg-brand-grey-light/20 hidden md:block" />
              <div className="flex-1 space-y-6 text-center md:text-left">
                <h3 className="text-xl font-bold">Estimated Benefit</h3>
                <div className="flex items-baseline justify-center md:justify-start space-x-2">
                  <span className="text-5xl font-display font-bold">£480</span>
                  <span className="text-brand-grey font-medium">/ year</span>
                </div>
                <p className="text-xs text-brand-grey italic">Equivalent to +12% annual generation efficiency</p>
                <button className="px-8 py-4 bg-brand-black text-white font-bold rounded-xl flex items-center justify-center hover:scale-105 transition-all w-full md:w-auto">
                  Compare All Export Rates
                  <ArrowRight size={18} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertCircle({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
