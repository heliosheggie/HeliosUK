import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calculator, 
  HelpCircle, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Thermometer,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

interface GrantCalculatorProps {
  onNavigate: (tab: string) => void;
}

export default function GrantCalculator({ onNavigate }: GrantCalculatorProps) {
  const [region, setRegion] = useState('England');
  const [isBenefits, setIsBenefits] = useState(false);
  const [epcRating, setEpcRating] = useState('D');

  const grants = [
    {
      name: 'ECO4 Scheme',
      amount: 'Up to 100% Funding',
      description: 'The Energy Company Obligation helps low-income and vulnerable households with major upgrades.',
      measures: ['Solar Panels', 'Solid Wall Insulation', 'Heat Pumps'],
      primary: region === 'England' || region === 'Wales' || region === 'Scotland'
    },
    {
      name: 'Home Energy Scotland (HES)',
      amount: 'Interest-free Loan + Grant',
      description: 'Exclusive to Scottish residents. Up to £10,000 for renewable systems.',
      measures: ['Solar PV', 'Battery Storage', 'Heat Pumps'],
      primary: region === 'Scotland'
    },
    {
      name: 'Boiler Upgrade Scheme (BUS)',
      amount: '£7,500 Grant',
      description: 'Direct grant for air source or ground source heat pumps. Open to most homeowners.',
      measures: ['Air Source Heat Pump', 'Ground Source Heat Pump'],
      primary: region === 'England' || region === 'Wales'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold mb-4">Solar & Grant Calculator</h1>
        <p className="text-brand-grey max-w-2xl">
          Don't leave money on the table. Discover exactly which UK grants and 
          tax rules (0% VAT) apply to your property.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="glass p-8 rounded-3xl border-brand-yellow/20">
            <h3 className="text-xl font-bold mb-8">Tell us about your home</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-3">Region</label>
                <div className="grid grid-cols-2 gap-2">
                  {['England', 'Scotland', 'Wales'].map(r => (
                    <button 
                      key={r}
                      onClick={() => setRegion(r)}
                      className={cn(
                        "py-3 rounded-xl border text-sm font-bold transition-all",
                        region === r 
                          ? "bg-brand-black text-white dark:bg-brand-yellow dark:text-brand-black border-transparent" 
                          : "glass hover:bg-brand-grey-light/20 border-brand-grey-light/20 dark:border-white/10 text-brand-grey"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand-grey mb-3">
                  Are you on any benefits?
                  <HelpCircle size={14} />
                </label>
                <div className="flex bg-brand-grey-light/20 dark:bg-white/5 rounded-xl p-1 relative">
                  <button 
                    onClick={() => setIsBenefits(true)}
                    className={cn(
                      "flex-1 py-3 rounded-lg text-sm font-bold transition-all relative z-10",
                      isBenefits ? "bg-white dark:bg-brand-black shadow-sm" : "text-brand-grey"
                    )}
                  >
                    Yes
                  </button>
                  <button 
                    onClick={() => setIsBenefits(false)}
                    className={cn(
                      "flex-1 py-3 rounded-lg text-sm font-bold transition-all relative z-10",
                      !isBenefits ? "bg-white dark:bg-brand-black shadow-sm" : "text-brand-grey"
                    )}
                  >
                    No
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-3">EPC Rating (Estimate)</label>
                <div className="flex justify-between items-center bg-brand-grey-light/20 dark:bg-white/5 rounded-xl p-2 h-14 overflow-hidden">
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(r => (
                    <button 
                      key={r}
                      onClick={() => setEpcRating(r)}
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all",
                        epcRating === r 
                          ? "bg-brand-yellow text-brand-black scale-110" 
                          : "hover:bg-brand-yellow/20 text-brand-grey"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass p-8 rounded-3xl bg-brand-black text-white">
            <h4 className="text-brand-yellow font-bold text-sm mb-4">VAT Insight</h4>
            <div className="flex items-start space-x-4">
              <div className="bg-brand-yellow/20 p-2 rounded-lg text-brand-yellow">
                <CheckCircle size={20} />
              </div>
              <p className="text-sm text-brand-grey leading-relaxed">
                <span className="text-white font-bold">0% VAT</span> currently applies to solar, batteries, and heat pumps in Great Britain until March 2027. This is a direct saving of 20%.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-12">
          <div>
            <h2 className="text-2xl font-bold mb-8">Eligible Schemes for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {grants.filter(g => g.primary).map((grant, i) => (
                <motion.div
                  key={grant.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass p-8 rounded-[32px] border-brand-yellow/10 border-2 relative group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <ShieldCheck size={120} />
                  </div>
                  
                  <div className="mb-6">
                    <span className="text-brand-yellow font-bold text-4xl font-display">{grant.amount}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4">{grant.name}</h3>
                  <p className="text-sm text-brand-grey mb-6 leading-relaxed">
                    {grant.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-brand-grey">Covers</div>
                    <div className="flex flex-wrap gap-2">
                      {grant.measures.map(m => (
                        <span key={m} className="px-3 py-1 bg-brand-grey-light/20 dark:bg-white/5 rounded-full text-xs font-medium">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button className="w-full py-4 glass mt-10 rounded-xl text-sm font-bold flex items-center justify-center group hover:bg-brand-yellow hover:text-brand-black transition-all">
                    Check Detailed Criteria
                    <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="glass p-12 rounded-[40px] border-brand-grey/10">
            <div className="flex flex-col md:row items-center justify-between gap-12">
              <div className="flex-1 space-y-6">
                <h3 className="text-3xl font-display font-bold">Why wait?</h3>
                <p className="text-brand-grey text-lg leading-relaxed">
                  Combining solar and heat pumps can reduce your heating bills by up to 70%. 
                  With the BUS grant increasing to £7,500, a typical install is now more 
                  affordable than ever.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center space-x-3 text-sm">
                    <div className="p-1 bg-green-500/10 text-green-500 rounded-full"><CheckCircle size={16}/></div>
                    <span>Instant eligibility check</span>
                  </li>
                  <li className="flex items-center space-x-3 text-sm">
                    <div className="p-1 bg-green-500/10 text-green-500 rounded-full"><CheckCircle size={16}/></div>
                    <span>No personal data required for estimates</span>
                  </li>
                </ul>
              </div>
              <div className="flex-1 w-full p-8 glass bg-brand-yellow dark:bg-brand-yellow/10 rounded-3xl text-center space-y-6">
                <div className="text-sm font-bold uppercase tracking-widest text-brand-grey">Estimated Savings</div>
                <div className="text-6xl font-display font-bold text-brand-yellow dark:text-brand-yellow">£11,400</div>
                <p className="text-xs text-brand-grey px-4">Based on BUS Grant (£7.5k) + 0% VAT (£2.5k) + ECO4 eligibility</p>
                <button className="w-full py-5 bg-brand-yellow dark:bg-brand-yellow text-brand-black font-bold rounded-2xl flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-brand-yellow/20">
                  Generate Full Report
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
