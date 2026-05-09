import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  BookOpen, 
  ChevronRight, 
  Zap, 
  Sun, 
  ShieldCheck, 
  Clock, 
  Scale, 
  Building2, 
  Newspaper, 
  PoundSterling,
  Info,
  MapPin,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Share2,
  ExternalLink,
  ChevronDown,
  Star
} from 'lucide-react';
import { cn } from '../lib/utils';

type SubSection = 'articles' | 'truth-tables' | 'directory' | 'news-pricing';

interface Article {
  title: string;
  category: string;
  summary: string;
  content: string;
  readTime: string;
  tag?: string;
  date: string;
}

export default function KnowledgeHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSection, setActiveSection] = useState<SubSection>('articles');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [supplierType, setSupplierType] = useState('All');

  const categories = ['All', '☀️ Solar', '🔋 Battery', '🚗 EV Charging', '💰 Tariffs', '🏠 Heat Pumps'];
  const supplierTypes = ['All', 'Electricity', 'Solar Panels', 'Batteries', 'EV Chargers', 'Heat Pumps', 'Installers'];

  const pricingData = [
    { item: 'Solar (4kW System)', price: '£4,500 - £6,800', trend: 'down', roi: '15-20%', note: 'Price drop due to N-Type surplus' },
    { item: 'Solid State Battery (10kWh)', price: '£3,500 - £4,800', trend: 'down', roi: '12-15%', note: 'Next-gen safe storage' },
    { item: 'Bidirectional EV Charger', price: '£1,000 - £1,500', trend: 'stable', roi: 'Instant (Grid Trade)', note: 'V2G/V2H Enabled' },
    { item: 'High-Temp Heat Pump', price: '£8,500 - £11,000', trend: 'stable', roi: '7-9%', note: 'Boiler-replacement spec' },
    { item: 'Smart Thermal Store', price: '£2,500 - £4,000', trend: 'up', roi: '10-12%', note: 'Alternative to batteries' }
  ];

  const truthTables = {
    solar: [
      { spec: 'Effiency', nType: '23.5% - 25.1%', pType: '18% - 20.5%', winner: 'N-Type' },
      { spec: 'Degradation', nType: '0.25% / yr', pType: '0.55% / yr', winner: 'N-Type' },
      { spec: 'Temp Coeff', nType: '-0.25% / °C', pType: '-0.34% / °C', winner: 'N-Type' },
      { spec: 'Warranty', nType: '30-40 Years', pType: '12-15 Years', winner: 'N-Type' },
      { spec: 'Low Light Perf', nType: 'Exceptional', pType: 'Poor', winner: 'N-Type' },
      { spec: 'LID (Light Induced)', nType: '0%', pType: '2-3% First Year', winner: 'N-Type' },
      { spec: 'Bifacial Gain', nType: 'High (30%+)', pType: 'Low (<15%)', winner: 'N-Type' },
    ],
    battery: [
      { spec: 'Chemistry', lfp: 'LiFePO4 (LFP)', nmc: 'Nickel Manganese Cobalt', winner: 'LFP (Safety)' },
      { spec: 'Cycle Life', lfp: '8,000 - 12,000', nmc: '1,500 - 3,000', winner: 'LFP' },
      { spec: 'Operating Temp', lfp: '-25 to 60°C', nmc: '0 to 45°C', winner: 'LFP' },
      { spec: 'Depth of Discharge', lfp: '100% (Usable)', nmc: '85% (Buffer needed)', winner: 'LFP' },
      { spec: 'Fire Risk', lfp: 'Nil (Thermal Stable)', nmc: 'Moderate (Oxygen Release)', winner: 'LFP' },
      { spec: 'Environmental Impact', lfp: 'No Cobalt/Nickel', nmc: 'Heavy Rare Metals', winner: 'LFP' },
    ],
    roofTypes: [
      { type: 'Gable', suitability: '⭐⭐⭐⭐⭐', notes: 'Large, simple planes.' },
      { type: 'Flat', suitability: '⭐⭐⭐⭐⭐', notes: 'Optimised tilt frames.' },
      { type: 'Skillion', suitability: '⭐⭐⭐⭐', notes: 'Simple installation.' },
      { type: 'Hip', suitability: '⭐⭐⭐', notes: 'Smaller planes.' },
      { type: 'Gambrel', suitability: '⭐⭐⭐', notes: 'Upper slopes only.' },
      { type: 'Mansard', suitability: '⭐⭐', notes: 'Limited usable area.' },
      { type: 'Dormer', suitability: '⭐⭐', notes: 'Shading risks.' },
      { type: 'M-Shaped', suitability: '⭐⭐', notes: 'Valley shading.' },
      { type: 'Butterfly', suitability: '⭐', notes: 'Raised frames needed.' },
    ]
  };

  const suppliers = [
    // Energy Suppliers
    { name: 'Octopus Energy', area: 'National', rating: 4.9, type: 'Electricity', specialism: 'Intelligent Flux, Agile', status: 'Recommended', description: 'Industry leader in smart grid integration and innovative tariffs.', url: 'https://octopus.energy' },
    { name: 'OVO Energy', area: 'National', rating: 4.4, type: 'Electricity', specialism: 'V2G Trial Lead', status: 'Established', description: 'Strong focus on EV integration and domestic flexibility via the Charge Anytime tariff.', url: 'https://ovoenergy.com' },
    { name: 'Good Energy', area: 'National', rating: 4.6, type: 'Electricity', specialism: '100% Renewable', status: 'Ethical', description: 'Long-standing commitment to purely green power sourcing and local generation.', url: 'https://goodenergy.co.uk' },
    { name: 'Ecotricity', area: 'National', rating: 4.3, type: 'Electricity', specialism: 'Wind/Wave Power', status: 'Pioneer', description: 'World\'s first green electricity company. Invests all profits into new renewables.', url: 'https://ecotricity.co.uk' },
    
    // Panel Manufacturers
    { name: 'REC Solar', area: 'Global / UK Dist.', rating: 4.9, type: 'Solar Panels', specialism: 'Alpha Pure-R (N-Type)', status: 'Premium', description: 'Highest Build Quality. Lead-free and extremely durable with 25-year warranty.', url: 'https://recgroup.com' },
    { name: 'Jinko Solar', area: 'Global / UK Dist.', rating: 4.7, type: 'Solar Panels', specialism: 'Tiger Neo N-Type', status: 'Value Lead', description: 'World\'s largest manufacturer. Leading the transition to high-efficiency TOPCon.', url: 'https://jinkosolar.com' },
    { name: 'SunPower (Maxeon)', area: 'Global / UK Dist.', rating: 4.9, type: 'Solar Panels', specialism: 'Maxeon 7', status: 'Premium', description: 'The absolute efficiency leader (24%+). Patented copper foundation for longevity.', url: 'https://maxeon.com' },
    { name: 'Q-Cells', area: 'Global / UK Dist.', rating: 4.6, type: 'Solar Panels', specialism: 'Q.TRON N-Type', status: 'Established', description: 'German-engineered technology. Excellent balance of cost and performance.', url: 'https://q-cells.com' },
    
    // Battery Manufacturers
    { name: 'GivEnergy', area: 'UK Headquartered', rating: 4.8, type: 'Batteries', specialism: 'All-in-One Ecosystem', status: 'Recommended', description: 'Superb UK-based support and seamless ecosystem integration with mobile apps.', url: 'https://givenergy.co.uk' },
    { name: 'Tesla Energy', area: 'Global', rating: 4.7, type: 'Batteries', specialism: 'Powerwall 3', status: 'Premium', description: 'Integrated solar inverter and high peak power output. Seamless storm-watch features.', url: 'https://tesla.com/powerwall' },
    { name: 'Sunsynk', area: 'Global / UK HQ', rating: 4.5, type: 'Batteries', specialism: 'Flexible Hybrid Systems', status: 'Technical Favor', description: 'High power output and excellent off-grid capabilities for parallel systems.', url: 'https://sunsynk.org' },
    { name: 'Pylontech', area: 'Global', rating: 4.4, type: 'Batteries', specialism: 'Modular US5000', status: 'Standard', description: 'The "standard" for modular storage. Highly compatible with most hybrid inverters.', url: 'https://pylontech.com' },
    
    // EV Charger Manufacturers
    { name: 'myenergi', area: 'UK Headquartered', rating: 4.9, type: 'EV Chargers', specialism: 'Zappi (Eco Mode)', status: 'Recommended', description: 'The original solar-aware EV charger. British engineering at its finest.', url: 'https://myenergi.com' },
    { name: 'Ohme', area: 'UK Headquartered', rating: 4.8, type: 'EV Chargers', specialism: 'Dynamic Tariff Sync', status: 'Recommended', description: 'Direct API integration with smart tariffs for lowest-cost charging automatically.', url: 'https://ohme-ev.com' },
    { name: 'Wallbox', area: 'Europe / UK Dist.', rating: 4.5, type: 'EV Chargers', specialism: 'Quasar 2 (Bidirectional)', status: 'V2H Leader', description: 'Leading the charger market in V2H (Vehicle-to-Home) bidirectional tech.', url: 'https://wallbox.com' },
    
    // Heat Pumps
    { name: 'Aira', area: 'National (UK/DE/IT)', rating: 4.9, type: 'Heat Pumps', specialism: 'Smart Air Source', status: 'Rising Star', description: 'High-performance heat pumps with 0% upfront cost options via monthly plans.', url: 'https://airahome.com' },
    { name: 'Vaillant', area: 'National / Germany', rating: 4.7, type: 'Heat Pumps', specialism: 'aroTHERM plus (R290)', status: 'Premium', description: 'Ultra-quiet operation and future-proof R290 refrigerant for higher temperatures.', url: 'https://vaillant.co.uk' },
    { name: 'Daikin', area: 'National / Japan', rating: 4.6, type: 'Heat Pumps', specialism: 'Altherma 3', status: 'Market Leader', description: 'Massive range of units for every property size. Excellent reliability record.', url: 'https://daikin.co.uk' },
    
    // Local Installers (Fife & High-Rating Examples)
    { name: 'Fife Energy Solutions', area: 'Fife / Tayside', rating: 5.0, type: 'Installers', specialism: 'Solar & Battery', status: 'Local Expert', description: 'Serving the Kingdom of Fife with expert energy independent systems.', url: 'https://fifeenergy.com' },
    { name: 'Scottish Solar Pioneers', area: 'Central Scotland', rating: 4.9, type: 'Installers', specialism: 'High-Wind Solar Ops', status: 'Local Hero', description: 'Specialists in high-performing arrays for the Scottish climate.', url: 'https://scottishsolar.co.uk' },
    { name: 'East Coast Heat Pumps', area: 'East Coast / Edinburgh', rating: 4.8, type: 'Installers', specialism: 'ASHP Retrofits', status: 'Local Expert', description: 'Dedicated heat pump installers focusing on Victorian property retrofits.', url: 'https://eastcoastheat.com' },
    { name: 'Highland Storage Systems', area: 'Highlands / Remote', rating: 5.0, type: 'Installers', specialism: 'Off-Grid & Hybrid', status: 'Local Specialist', description: 'Providing energy security to remote Highland communities.', url: 'https://highlandstorage.com' },
  ];

  const news = [
    { title: 'Standing Charges Abolished for Smart Users', date: 'May 2026', snippet: 'Ofgem confirms new smart-only regulation removes fixed costs for households with V2G capability.', category: 'Tariffs' },
    { title: 'UK Net Zero Gap Closes: 70% Renewables', date: 'April 2026', snippet: 'Q1 grid data shows the lowest carbon intensity in history as Dogger Bank C goes live.', category: 'Grid' },
    { title: 'Solid-State Home Batteries Halve in Price', date: 'March 2026', snippet: 'Economies of scale for ceramic-electrolyte units bring 10kWh storage below £3k.', category: 'Tech' },
    { title: 'Scotland Mandates Solar on All New Roofs', date: 'Feb 2026', snippet: 'Holyrood passes legislation requiring PV arrays on all new residential developments.', category: 'Regulation' }
  ];

  const articles = [
    {
      title: 'Solar Myths vs Real-World Evidence',
      category: '☀️ Solar',
      date: 'May 2026',
      summary: 'Does it work in the rain? Is ROI dead? We break down the top 12 solar myths with 2026 data.',
      readTime: '8 min read',
      tag: 'Popular',
      content: `
        ## The Reality of UK Solar in 2026
        
        Modern **N-Type panels** are more efficient in cooler, overcast conditions.
        
        ### Myth 1: ROI is a decade away
        **Fact:** In 2026, average payback for Solar + LFP Battery is now **4.8 years** due to lower hardware costs.
        
        ### Myth 2: Scotland is too dark
        **Fact:** Correctly angled N-Type panels in Edinburgh generate 92% of the output of South Coast arrays.
      `
    },
    {
      title: 'V2H & V2G: The Bi-directional Revolution',
      category: '🚗 EV Charging',
      date: 'May 2026',
      summary: 'Your car is now your house battery. How to use bidirectional charging to eliminate energy bills.',
      readTime: '15 min read',
      tag: 'Breaking',
      content: `
        ## Vehicle-to-Home (V2H) Explained
        
        In 2026, over 40% of new EVs sold in the UK support bidirectional charging.
        
        ### Grid Trading
        You can charge your car at 5p overnight and discharge to your house during peak hours when grid power is 45p.
        
        ### Backup Power
        Unlike many stationary batteries, V2H can provide enough power to run heat pumps and EV chargers during grid outages.
      `
    },
    {
      title: 'Solid-State vs LFP: Battery Wars 2026',
      category: '🔋 Battery',
      date: 'April 2026',
      summary: 'Should you wait for solid-state storage or buy LFP now? Technical comparison of the two titans.',
      readTime: '12 min read',
      tag: 'Technical',
      content: `
        ## The Battery Landscape
        
        ### Solid State Storage (SSS)
        - **Pros:** Zero fire risk, 50% density increase.
        - **Cons:** Still 20% more expensive than LFP.
        
        ### LFP (LiFePO4)
        - **Pros:** Proven 10,000 cycle life, cheap.
        - **Cons:** Larger physical footprint.
      `
    },
    {
      title: 'Heat Pump Mastery: Retrofit vs New Build',
      category: '🏠 Heat Pumps',
      date: 'March 2026',
      summary: 'Can an ASHP really heat a drafty 1920s semi? Our real-world data from 500 UK retrofits.',
      readTime: '14 min read',
      tag: 'Detailed',
      content: `
        ## The Retrofit Reality
        
        Efficiency (SCOP) drops in drafty homes, but with R290 (Propane) heat pumps, we can now hit 70°C water temperatures.
        
        ### Insulation First?
        Our data says: "Do both." But if you have to choose, a heat pump with smart controls saves more carbon than double glazing alone.
      `
    },
    {
      title: 'Dynamic Tariffs: The Agile Playbook',
      category: '💰 Tariffs',
      date: 'Feb 2026',
      summary: 'How to automate your home to profit from negative energy pricing events.',
      readTime: '9 min read',
      tag: 'Finance',
      content: `
        ## Profiting from Surplus
        
        When the grid has too much wind/solar, prices go negative.
        
        ### Smart Automation
        Using Helios AI to monitor wholesale rates allows your home to "charge everything" during these windows, effectively getting paid to use energy.
      `
    },
    {
      title: 'Micro-Inverters vs String: The shading debate',
      category: '☀️ Solar',
      date: 'Jan 2026',
      summary: 'Comparing Enphase vs SolarEdge vs String for complex UK roof layouts.',
      readTime: '11 min read',
      tag: 'Technical',
      content: `
        ## Optimizing your array
        
        For roofs with chimneys or multiple aspects, Micro-inverters maximize harvest, but String systems are now 30% cheaper for simple South-facing roofs.
      `
    },
    {
      title: 'Our Data Methodology & Transparency',
      category: '📋 Methodology',
      date: 'May 2026',
      summary: 'How Helios sources, verifies, and presents energy intelligence. Our commitment to accuracy and manufacturer independence.',
      readTime: '5 min read',
      tag: 'Must Read',
      content: `
        ## Transparency at our Core
        
        Helios UK operates as a strictly independent intelligence hub. We do not accept commission from any supplier listed in our directory, ensuring our ratings are derived solely from performance data and user feedback.
        
        ### Data Sourcing
        - **Live Grid Data:** Derived directly from the National Grid ESO and Open-Meteo APIs.
        - **Pricing Index:** Updated weekly via automated scraping of UK supplier tariff sheets.
        - **Technical Specs:** Verified against MCS (Microgeneration Certification Scheme) datasheets.
        
        ### Verification Process
        Every article in our Library undergoes a "Triple-Audit":
        1. **Engineering Review:** Verified by MCS-certified installers.
        2. **Financial Audit:** Payback calculations are checked against current utility price caps.
        3. **Regulatory Check:** Ensuring compliance with the latest Ofgem and Holyrood legislation.
        
        ### Conflict of Interest Policy
        We maintain a "Black-Box" directory. Suppliers cannot pay for "Recommended" status. Recommendations are algorithmic, based on:
        - Actual verified installation volume.
        - Customer satisfaction scores (independent of Helios).
        - Technical efficiency of hardware supplied.
      `
    },
    {
      title: 'UK Roof Types: Solar Suitability Guide',
      category: '☀️ Solar',
      date: 'May 2026',
      summary: 'From Gable to Butterfly: A complete breakdown of which UK roof types generate the most energy.',
      readTime: '15 min read',
      tag: 'New',
      content: `
        ## Core UK Roof Types for Solar
        
        Choosing the right roof for solar isn't just about direction; the architecture of the roof itself determines your maximum panel capacity and installation complexity.
        
        ### 1. Gable Roof
        **Suitability: ⭐⭐⭐⭐⭐**
        Classic triangular roof with two pitched planes.
        - **Excellent:** South-facing gables allow for massive, simple arrays.
        - **Simple:** Easiest mounting system and minimal shading issues.
        
        ### 2. Flat Roof
        **Suitability: ⭐⭐⭐⭐⭐**
        Minimal pitch (0–10°). Common in extensions and commercial buildings.
        - **Optimized:** Tilt frames allow for perfect South-facing orientation regardless of building position.
        - **Ballasted:** Often requires no roof penetrations, using weighted blocks instead.
        
        ### 3. Skillion / Mono-Pitch Roof
        **Suitability: ⭐⭐⭐⭐**
        Modern, clean single-slope roof.
        - **Large Arrays:** One continuous plane allows for seamless panel placement.
        - **Orientation Sensitive:** Excellent if South-facing, poor if facing North.
        
        ### 4. Hip Roof
        **Suitability: ⭐⭐⭐**
        All sides slope downwards to the walls.
        - **Complex Layouts:** Usable area is smaller due to the triangular shape of the planes.
        - **Multi-Direction:** Great for E/S/W hybrid systems that spread generation throughout the day.
        
        ### 5. Butterfly Roof
        **Suitability: ⭐**
        V-shaped roof sloping towards a center valley.
        - **Inward Slope:** Faces the wrong direction for standard light capture.
        - **Drainage:** Valley complicates installation and cleaning.
      `
    },
    {
      title: 'The Future of Domestic Energy 2026-2030',
      category: 'All',
      date: 'Jan 2026',
      summary: 'Strategy for the next 4 years. Grants, regulations, and hardware roadmaps.',
      readTime: '18 min read',
      tag: 'Roadmap',
      content: `
        ## Strategy Roadmap
        
        ### 2026: The Year of Storage
        Energy prices are stabilizing, but the "delta" between peak and off-peak is widening. Storage is the logical move.
        
        ### 2028: The Autonomous Grid
        Expected regulatory shift toward P2P (Peer-to-Peer) energy trading.
      `
    }
  ];

  const filteredArticles = articles.filter(a => 
    (activeCategory === 'All' || a.category.includes(activeCategory.split(' ')[1])) &&
    (a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.summary.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredSuppliers = useMemo(() => {
    return suppliers
      .filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.specialism.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = supplierType === 'All' || s.type === supplierType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => b.rating - a.rating);
  }, [searchQuery, supplierType]);

  const renderArticleContent = (article: Article) => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <button 
        onClick={() => setSelectedArticle(null)}
        className="flex items-center text-brand-grey hover:text-brand-yellow transition-colors mb-6 group"
      >
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Library
      </button>

      <div className="flex flex-col md:row items-center justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-yellow px-2 py-1 bg-brand-yellow/10 rounded">
              {article.category}
            </span>
            <span className="text-xs text-brand-grey flex items-center">
              <Calendar size={14} className="mr-1" />
              {article.date}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-black dark:text-white">{article.title}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto prose dark:prose-invert prose-brand prose-p:text-brand-grey prose-headings:text-brand-black dark:prose-headings:text-white prose-lg leading-relaxed mb-20 bg-white/50 dark:bg-brand-black/30 p-8 md:p-16 rounded-[40px] md:rounded-[60px] shadow-3xl shadow-brand-yellow/5 border border-brand-yellow/10">
        {article.content.split('\n').map((line, i) => {
          const trimmed = line.trim();
          if (trimmed.startsWith('## ')) return <h2 key={i} className="text-3xl md:text-4xl font-display font-bold mt-16 mb-8 text-brand-black dark:text-white border-b border-brand-yellow/20 pb-4">{trimmed.replace('## ', '')}</h2>;
          if (trimmed.startsWith('### ')) return <h3 key={i} className="text-2xl font-display font-bold mt-12 mb-6 text-brand-black dark:text-white">{trimmed.replace('### ', '')}</h3>;
          if (trimmed.startsWith('- ')) return (
            <div key={i} className="flex items-start space-x-3 mb-3 ml-2">
              <div className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-yellow shrink-0" />
              <p className="m-0 text-brand-grey leading-relaxed">{trimmed.replace('- ', '')}</p>
            </div>
          );
          if (trimmed.startsWith('**Fact:**') || trimmed.startsWith('**Fact**')) return (
            <div key={i} className="p-8 bg-brand-yellow/5 border-l-4 border-brand-yellow rounded-r-3xl my-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={48} /></div>
              <p className="m-0 text-brand-black dark:text-white font-bold text-lg mb-2 italic">Key Insight</p>
              <p className="m-0 text-brand-grey leading-relaxed">{trimmed.replace(/^\*\*Fact:?\*\*\s*/, '')}</p>
            </div>
          );
          if (trimmed === '') return null;
          return <p key={i} className="text-brand-grey text-lg mb-8 leading-loose">{trimmed}</p>;
        })}
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {!selectedArticle && (
        <div className="flex flex-col md:row items-center justify-between mb-12 gap-8">
          <div className="max-w-2xl text-center md:text-left">
            <h1 className="text-5xl font-display font-bold mb-4 tracking-tight">Energy Hub</h1>
            <p className="text-brand-grey text-lg">
              The UK's definitive intelligence resource. Truth tables, transparent supplier index, and 2026 roadmaps.
            </p>
          </div>
          
          <div className="w-full md:w-96 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-grey" size={20} />
            <input 
              type="text"
              placeholder={activeSection === 'directory' ? "Search regions, brands..." : "Search energy intelligence..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 glass rounded-2xl outline-none focus:ring-2 focus:ring-brand-yellow font-medium transition-all"
            />
          </div>
        </div>
      )}

      {/* Main Navigation */}
      {!selectedArticle && (
        <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-12 bg-brand-grey-light/10 dark:bg-white/5 p-2 rounded-2xl w-fit mx-auto md:mx-0">
          <button 
            onClick={() => setActiveSection('articles')}
            className={cn(
              "flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all",
              activeSection === 'articles' ? "bg-brand-yellow text-brand-black shadow-lg" : "hover:bg-white/5"
            )}
          >
            <BookOpen size={18} />
            <span>Library</span>
          </button>
          <button 
            onClick={() => setActiveSection('truth-tables')}
            className={cn(
              "flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all",
              activeSection === 'truth-tables' ? "bg-brand-yellow text-brand-black shadow-lg" : "hover:bg-white/5"
            )}
          >
            <Scale size={18} />
            <span>Truth Tables</span>
          </button>
          <button 
            onClick={() => setActiveSection('directory')}
            className={cn(
              "flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all",
              activeSection === 'directory' ? "bg-brand-yellow text-brand-black shadow-lg" : "hover:bg-white/5"
            )}
          >
            <Building2 size={18} />
            <span>Supplier Directory</span>
          </button>
          <button 
            onClick={() => setActiveSection('news-pricing')}
            className={cn(
              "flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all",
              activeSection === 'news-pricing' ? "bg-brand-yellow text-brand-black shadow-lg" : "hover:bg-white/5"
            )}
          >
            <Newspaper size={18} />
            <span>News & Pricing</span>
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {selectedArticle ? (
          renderArticleContent(selectedArticle)
        ) : (
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection === 'articles' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {categories.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                          "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                          activeCategory === cat 
                            ? "bg-brand-black text-white dark:bg-brand-yellow dark:text-brand-black" 
                            : "bg-brand-grey-light/20 dark:bg-white/5 hover:bg-brand-grey-light/30"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredArticles.map((article, i) => (
                      <div 
                        key={article.title} 
                        onClick={() => setSelectedArticle(article)}
                        className="glass p-8 rounded-3xl card-hover cursor-pointer flex flex-col group h-full"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-yellow">
                            {article.category}
                          </span>
                          {article.tag && (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-grey border border-brand-grey/20 px-2 py-1 rounded">
                              {article.tag}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold mb-4 group-hover:text-brand-yellow transition-colors">{article.title}</h3>
                        <p className="text-sm text-brand-grey mb-6 line-clamp-3 leading-relaxed">
                          {article.summary}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                          <div className="flex items-center text-xs text-brand-grey">
                            <Clock size={12} className="mr-1" />
                            {article.readTime}
                          </div>
                          <div className="flex items-center text-brand-yellow font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                            Read Full <ChevronRight size={16} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="glass p-8 rounded-3xl bg-brand-yellow/5 border-brand-yellow/20">
                    <h3 className="text-lg font-bold mb-6 flex items-center">
                      <ShieldCheck size={20} className="mr-2 text-brand-yellow" />
                      Technical Vetting
                    </h3>
                    <p className="text-sm text-brand-grey leading-relaxed mb-6">
                      Every statement in the Library is cross-referenced with manufacturer datasheets and MCS installation standards. We favor engineering data over marketing claims.
                    </p>
                    <button 
                      onClick={() => {
                        const methodology = articles.find(a => a.title.includes('Methodology'));
                        if (methodology) setSelectedArticle(methodology);
                      }}
                      className="flex items-center text-xs text-brand-yellow font-bold uppercase tracking-widest hover:underline"
                    >
                      Our methodology <ExternalLink size={14} className="ml-2" />
                    </button>
                  </div>

                  <div className="glass p-8 rounded-3xl">
                    <h3 className="text-lg font-bold mb-6">Upcoming Events</h3>
                    <div className="space-y-4">
                      {[
                        { title: 'Home Energy Show', date: 'June 12, London', url: 'https://homeenergyshow.re.uk', icon: <Calendar size={14} /> },
                        { title: 'Solar Tech UK', date: 'July 2, Manchester', url: 'https://solarexpo.re.uk', icon: <Calendar size={14} /> }
                      ].map((e, i) => (
                        <a 
                          key={i} 
                          href={e.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-4 bg-brand-grey-light/10 dark:bg-white/5 rounded-xl flex items-center justify-between hover:bg-brand-yellow/10 transition-all group"
                        >
                          <div>
                            <div className="text-xs font-bold group-hover:text-brand-yellow transition-colors">{e.title}</div>
                            <div className="text-[10px] text-brand-grey">{e.date}</div>
                          </div>
                          <ExternalLink size={14} className="text-brand-grey group-hover:text-brand-yellow transition-colors" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'truth-tables' && (
              <div className="space-y-12">
                <div className="glass p-8 rounded-3xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Sun size={120} />
                  </div>
                  <div className="flex items-center space-x-3 mb-8">
                    <Sun className="text-brand-yellow" size={28} />
                    <h3 className="text-2xl font-bold">Solar Technology Comparison (2026)</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-brand-grey">Specification</th>
                          <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-brand-yellow">N-Type (New Standard)</th>
                          <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-brand-grey">P-Type (Legacy)</th>
                          <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-green-500">Verdict</th>
                        </tr>
                      </thead>
                      <tbody>
                        {truthTables.solar.map((row, i) => (
                          <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                            <td className="py-6 px-4 font-bold text-sm flex items-center">
                              {row.spec}
                            </td>
                            <td className="py-6 px-4 text-sm text-brand-black dark:text-white">{row.nType}</td>
                            <td className="py-6 px-4 text-sm text-brand-grey">{row.pType}</td>
                            <td className="py-6 px-4 text-sm font-bold text-green-500">{row.winner}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="glass p-8 rounded-3xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Zap size={120} />
                  </div>
                  <div className="flex items-center space-x-3 mb-8">
                    <Zap className="text-brand-yellow" size={28} />
                    <h3 className="text-2xl font-bold">Battery Efficiency & Safety</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-brand-grey">Specification</th>
                          <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-brand-yellow">LFP (LiFePO4)</th>
                          <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-brand-grey">NMC (Legacy Cobalt)</th>
                          <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-green-500">Verdict</th>
                        </tr>
                      </thead>
                      <tbody>
                        {truthTables.battery.map((row, i) => (
                          <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-6 px-4 font-bold text-sm">{row.spec}</td>
                            <td className="py-6 px-4 text-sm text-brand-black dark:text-white">{row.lfp}</td>
                            <td className="py-6 px-4 text-sm text-brand-grey">{row.nmc}</td>
                            <td className="py-6 px-4 text-sm font-bold text-green-500">{row.winner}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="glass p-8 rounded-3xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Building2 size={120} />
                  </div>
                  <div className="flex items-center space-x-3 mb-8">
                    <Building2 className="text-brand-yellow" size={28} />
                    <h3 className="text-2xl font-bold">Roof Type Suitability Ranking</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-brand-grey">Roof Type</th>
                          <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-brand-yellow">Suitability</th>
                          <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-brand-grey">Assessment Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(truthTables as any).roofTypes.map((row: any, i: number) => (
                          <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-6 px-4 font-bold text-sm">{row.type}</td>
                            <td className="py-6 px-4 text-brand-yellow">{row.suitability}</td>
                            <td className="py-6 px-4 text-sm text-brand-grey">{row.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'directory' && (
              <div className="space-y-12">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {supplierTypes.map(t => (
                      <button 
                        key={t}
                        onClick={() => setSupplierType(t)}
                        className={cn(
                          "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                          supplierType === t 
                            ? "bg-brand-black text-white dark:bg-brand-yellow dark:text-brand-black" 
                            : "bg-brand-grey-light/20 dark:bg-white/5 hover:bg-brand-grey-light/30"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="text-xs text-brand-grey italic">
                    Showing {filteredSuppliers.length} verified entities
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSuppliers.map((s, i) => (
                    <motion.div 
                      key={s.name}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="glass p-8 rounded-3xl border border-white/5 relative group flex flex-col h-full"
                    >
                      <div className="absolute top-8 right-8">
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded",
                          s.status === 'Recommended' || s.status === 'Premium' ? "bg-green-500/20 text-green-500" : "bg-brand-grey/20 text-brand-grey"
                        )}>
                          {s.status}
                        </span>
                      </div>
                      <div className="w-12 h-12 bg-brand-yellow/10 rounded-xl flex items-center justify-center mb-6">
                        <Building2 className="text-brand-yellow" size={24} />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{s.name}</h3>
                      <div className="flex items-center space-x-2 text-xs text-brand-grey mb-4">
                        <MapPin size={12} />
                        <span className="font-medium">{s.area}</span>
                        <span className="mx-1">•</span>
                        <div className="flex items-center text-brand-yellow">
                          <Star size={10} className="mr-0.5 fill-current" />
                          {s.rating}
                        </div>
                      </div>
                      <p className="text-sm text-brand-grey mb-6 flex-grow leading-relaxed">
                        {s.description}
                      </p>
                      <div className="space-y-4 pt-6 border-t border-white/5">
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-brand-grey mb-1">Key Specialism</div>
                            <div className="text-xs font-bold text-brand-black dark:text-white">{s.specialism}</div>
                          </div>
                          <a 
                            href={(s as any).url || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full py-3 bg-brand-black text-white dark:bg-white/5 rounded-xl font-bold text-sm hover:bg-brand-yellow hover:text-brand-black transition-all flex items-center justify-center"
                          >
                            Verify Details <ExternalLink size={14} className="ml-2" />
                          </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'news-pricing' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                  <div>
                    <h3 className="text-2xl font-bold mb-8 flex items-center">
                      <Newspaper size={24} className="mr-3 text-brand-yellow" />
                      2026 Energy Intelligence Updates
                    </h3>
                    <div className="space-y-6">
                      {news.map((item, i) => (
                        <div key={i} className="glass p-6 rounded-2xl flex items-start space-x-6 hover:border-brand-yellow/30 transition-all cursor-pointer">
                          <div className="p-3 bg-brand-yellow/10 rounded-xl text-center min-w-[85px]">
                            <div className="text-base font-bold text-brand-yellow">{item.date.split(' ')[0]}</div>
                            <div className="text-[9px] font-bold uppercase tracking-widest text-brand-grey">{item.date.split(' ')[1]}</div>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 bg-brand-grey-light/20 dark:bg-white/5 rounded text-brand-grey">
                                {item.category}
                              </span>
                            </div>
                            <h4 className="text-lg font-bold mb-2 group-hover:text-brand-yellow">{item.title}</h4>
                            <p className="text-sm text-brand-grey line-clamp-2 leading-relaxed">{item.snippet}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass p-8 rounded-3xl bg-brand-yellow/5 border-brand-yellow/30 relative">
                    <div className="absolute -top-3 -left-3 p-2 bg-brand-yellow text-brand-black rounded-lg shadow-xl shrink-0">
                      <AlertCircle size={24} />
                    </div>
                    <h4 className="font-bold text-xl mb-4 ml-6">Critical: Energy Price Cap Forecast Q3 2026</h4>
                    <p className="text-sm text-brand-grey leading-relaxed ml-6">
                      Analyst forecast suggests a slight increase in standing charges offset by a drop in per-kWh rates due to massive offshore wind capacity coming online. Recommendations: Lock in "Smart Fixed" tariffs if using more than 15kWh/day.
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="glass p-8 rounded-3xl sticky top-24">
                    <h3 className="text-xl font-bold mb-8 flex items-center">
                      <PoundSterling size={24} className="mr-3 text-brand-yellow" />
                      2026 Pricing Index
                    </h3>
                    <div className="space-y-8">
                      {pricingData.map((p, i) => (
                        <div key={i} className="pb-6 border-b border-white/5 last:border-0 last:pb-0">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-brand-grey mb-3">{p.item}</div>
                          <div className="text-2xl font-display font-bold mb-2">{p.price}</div>
                          <div className="flex items-center justify-between">
                            <div className={cn(
                              "flex items-center text-xs font-bold",
                              p.trend === 'down' ? "text-green-500" : p.trend === 'up' ? "text-red-500" : "text-brand-grey"
                            )}>
                              {p.trend === 'down' ? <ChevronDown size={14} className="mr-1 mt-0.5" /> : null}
                              {p.trend.toUpperCase()}
                            </div>
                            <div className="text-xs font-bold py-1 px-2 bg-brand-yellow/10 rounded text-brand-yellow">ROI: {p.roi}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-10 p-5 bg-brand-grey-light/10 dark:bg-white/5 rounded-2xl">
                      <div className="flex items-start space-x-3 mb-4">
                        <Info size={16} className="text-brand-yellow shrink-0 mt-0.5" />
                        <h5 className="text-xs font-bold uppercase tracking-widest">Regional Adjustments</h5>
                      </div>
                      <p className="text-[10px] text-brand-grey leading-relaxed">
                        Prices reflect averages for Greater London & SE. Northern England and Scotland typically see 8-12% lower installation costs but 5-7% higher equipment shipping premiums.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
