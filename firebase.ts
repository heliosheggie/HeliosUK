import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Upload, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  ShieldAlert, 
  BadgeHelp,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function QuoteChecker() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setResult({
        score: 68,
        findings: [
          { type: 'warning', text: 'Inverter is slightly undersized for an 8kW array (Solis 5kW)' },
          { type: 'alert', text: 'Battery quote is 25% above UK average for 10kWh LFP' },
          { type: 'success', text: 'Panel efficiency (22.3%) is excellent for the price point' },
          { type: 'info', text: 'MCS certification is mentioned but verify the number on MCA website' }
        ]
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold mb-4">Installer Quote Checker (Coming Soon)</h1>
        <p className="text-brand-grey max-w-2xl">
          Upload or paste your solar/battery quote. We'll highlight overpricing, 
          undersized components, and potential warranty issues.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="glass p-12 rounded-[40px] border-dashed border-2 border-brand-grey-light/30 dark:border-white/10 flex flex-col items-center justify-center text-center">
            <div className="p-6 bg-brand-yellow/10 rounded-full mb-6">
              <Upload size={40} className="text-brand-yellow" />
            </div>
            <h3 className="text-xl font-bold mb-2">Drop your PDF or Image</h3>
            <p className="text-brand-grey text-sm mb-8">We'll scan it for hardware specs and prices</p>
            <button className="px-8 py-4 bg-brand-black text-white font-bold rounded-xl hover:scale-105 transition-transform">
              Browse Files
            </button>
          </div>
          
          <div className="glass p-8 rounded-3xl">
            <h3 className="text-lg font-bold mb-6">Or Paste Text Manually</h3>
            <textarea 
              placeholder="e.g. 14 x Jinko 430W panels, Solis 5kW inverter, GivEnergy 9.5kWh battery. Total price: £8,500..."
              className="w-full h-40 bg-brand-grey-light/20 dark:bg-white/5 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-brand-yellow outline-none border border-brand-grey-light/30 dark:border-white/10"
            />
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full py-4 bg-brand-yellow text-brand-black font-bold rounded-xl mt-6 flex items-center justify-center space-x-2"
            >
              {isAnalyzing ? <RefreshCw className="animate-spin" size={20} /> : <Search size={20} />}
              <span>{isAnalyzing ? 'Analyzing Quote...' : 'Run Audit'}</span>
            </button>
          </div>
        </div>

        <div>
          <AnimatePresence mode="wait">
            {!result ? (
              <div className="h-full glass p-12 rounded-[40px] flex flex-col items-center justify-center text-center opacity-50">
                <BadgeHelp size={64} className="mb-6 text-brand-grey" />
                <h3 className="text-xl font-bold mb-2">Awaiting Data</h3>
                <p className="text-sm">Upload a quote to see the audit results</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="glass p-8 rounded-3xl flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-1">Audit Score</h3>
                    <p className="text-xs text-brand-grey">Based on UK market averages</p>
                  </div>
                  <div className="text-5xl font-display font-bold text-brand-yellow">{result.score}/100</div>
                </div>

                <div className="space-y-4">
                  {result.findings.map((f: any, i: number) => (
                    <div key={i} className="glass p-6 rounded-2xl flex items-start space-x-4 border-l-4 pr-12 relative overflow-hidden" 
                         style={{ borderLeftColor: f.type === 'alert' ? '#ef4444' : f.type === 'warning' ? '#facc15' : f.type === 'success' ? '#22c55e' : '#3b82f6' }}>
                      <div className="shrink-0 mt-1">
                        {f.type === 'alert' && <ShieldAlert className="text-red-500" size={20} />}
                        {f.type === 'warning' && <AlertTriangle className="text-brand-yellow" size={20} />}
                        {f.type === 'success' && <CheckCircle className="text-green-500" size={20} />}
                        {f.type === 'info' && <FileText className="text-blue-500" size={20} />}
                      </div>
                      <p className="text-sm leading-relaxed">{f.text}</p>
                    </div>
                  ))}
                </div>

                <div className="glass p-8 rounded-3xl bg-brand-black text-white">
                  <h4 className="font-bold mb-4">Helios Recommendation</h4>
                  <p className="text-sm text-brand-grey mb-6">
                    This quote is broadly fair but the battery markup is high. 
                    Ask the installer if they can price-match the GivEnergy 9.5kWh 
                    at £3,200 (hardware cost) + £600 installation.
                  </p>
                  <button className="text-brand-yellow font-bold text-sm flex items-center group">
                    Download Negotiation Template
                    <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function RefreshCw({ size, className }: { size: number, className?: string }) {
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
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}
