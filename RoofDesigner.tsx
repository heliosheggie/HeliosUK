import { motion } from 'motion/react';
import { 
  Sun, 
  Zap, 
  ShieldCheck,
  ChevronRight,
  Layout,
  ArrowRight,
  TrendingUp,
  Calculator,
  BookOpen
} from 'lucide-react';
import { cn } from '../lib/utils';

interface HomeProps {
  onNavigate: (tab: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const features = [
    {
      id: 'solar',
      title: 'Solar Intelligence',
      description: 'Personalised solar potential for your exact property using weather and irradiance data.',
      icon: Sun,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10'
    },
    {
      id: 'roof',
      title: 'Roof & Panel Designer',
      description: 'Draw your roof and test different panel layouts with real-world yield estimates.',
      icon: Layout,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      id: 'tariffs',
      title: 'Tariff Optimiser',
      description: 'Find the best energy tariff (Octopus, etc.) based on your specific usage and system.',
      icon: TrendingUp,
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    {
      id: 'ecosystem',
      title: 'Ecosystem Simulator',
      description: 'Model solar, battery, and EV charging together to see your total potential savings.',
      icon: Zap,
      color: 'text-brand-yellow',
      bg: 'bg-brand-yellow/10'
    },
    {
      id: 'grants',
      title: 'Grant Calculator',
      description: 'Check eligibility for ECO4, HES, and BUS grants. See how much you can save upfront.',
      icon: Calculator,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    {
      id: 'knowledge',
      title: 'Knowledge Hub',
      description: 'Unbiased brand comparisons, ROI analysis, and truth tables for home energy.',
      icon: BookOpen,
      color: 'text-red-500',
      bg: 'bg-red-500/10'
    }
  ];

  const stats = [
    { label: 'Avg. Annual Savings', value: '£1,420' },
    { label: 'Typical Payback', value: '6.2 Years' },
    { label: 'Carbon Reduction', value: '1.2t / year' },
    { label: 'System ROI', value: '14.5%' },
  ];

  return (
    <div className="pb-20">

      {/* HERO SECTION */}
      <section className="relative pt-10 pb-14 overflow-hidden">
        
        {/* BACKGROUND GLOW */}
        <div className="absolute top-0 right-0 -z-10 opacity-30 dark:opacity-40 animate-pulse-slow">
          <div className="w-[700px] h-[700px] bg-brand-yellow rounded-full blur-[140px] -mr-72 -mt-72" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* TRUE 50/50 GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

            {/* LEFT — TEXT BOX */}
            <div className="p-6 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-lg border border-white/10">

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-yellow/10 text-brand-yellow-dark dark:text-brand-yellow text-xs font-semibold uppercase tracking-wider mb-3"
              >
                <ShieldCheck size={14} />
                <span>Evidence-Based Insights</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-display font-bold leading-tight mb-3"
              >
                Home Energy <br />
                <span className="text-brand-yellow">Intelligence</span> for UK <br />
                Homeowners
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base text-brand-grey dark:text-brand-grey mb-5"
              >
                Eliminate the noise. Get unbiased, property-specific insights on 
                solar, batteries, EV chargers, and tariffs.
              </motion.p>

              {/* NEW PREMIUM CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-3"
              >
                <button 
                  onClick={() => onNavigate('solar')}
                  className="px-7 py-3 bg-brand-yellow text-brand-black font-bold rounded-xl shadow-md shadow-brand-yellow/30 flex items-center group hover:scale-[1.04] transition-transform"
                >
                  Start Free Analysis
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>

                <button 
                  onClick={() => onNavigate('knowledge')}
                  className="px-7 py-3 bg-white/20 dark:bg-white/10 text-brand-black dark:text-white font-bold rounded-xl border border-white/20 hover:bg-white/30 dark:hover:bg-white/20 transition-all"
                >
                  Energy Hub
                </button>
              </motion.div>
            </div>

            {/* RIGHT — LARGE LOGO WITH ANIMATED GLOW */}
            <div className="relative flex justify-center md:justify-end">
              
              {/* Animated glow ring */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[500px] h-[500px] rounded-full bg-brand-yellow/20 blur-[120px] animate-pulse-slow" />
              </div>

              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                src="/public/assets/images/helios_logo.png"
                alt="Helios Logo"
                className="relative w-[420px] h-[420px] md:w-[480px] md:h-[480px] object-contain drop-shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>

          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-16 border-y border-brand-grey-light/20 dark:border-white/5 bg-brand-grey-light/5 dark:bg-white/2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-display font-bold text-brand-yellow mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-brand-grey uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Built for Homeowners</h2>
            <p className="text-brand-grey">
              Everything you need to confidently transition to clean energy, 
              backed by data, not sales commissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                onClick={() => onNavigate(feature.id)}
                className="group p-8 rounded-3xl glass card-hover cursor-pointer"
              >
                <div className={cn("inline-flex p-4 rounded-2xl mb-6 transition-transform group-hover:scale-110", feature.bg, feature.color)}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-display font-bold mb-4 flex items-center">
                  {feature.title}
                  <ChevronRight size={18} className="ml-2 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-brand-grey text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto bg-brand-black rounded-[40px] p-12 md:p-16 relative overflow-hidden text-white border border-white/5">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-yellow/10 rounded-full blur-[100px] -mr-40 -mt-40" />
          
          <div className="relative z-10 text-center space-y-10">
            <h2 className="text-4xl md:text-6xl font-display font-bold">Ready to future-proof <br />your home?</h2>
            <p className="text-brand-grey max-w-xl mx-auto text-lg leading-relaxed">
              Join thousands of UK homeowners saving on bills and reducing 
              emissions with Helios Intelligence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => onNavigate('solar')}
                className="w-full sm:w-auto px-10 py-5 bg-brand-yellow text-brand-black font-bold rounded-2xl flex items-center justify-center hover:scale-[1.05] transition-transform"
              >
                Get Property Report
                <ArrowRight className="ml-2" />
              </button>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
