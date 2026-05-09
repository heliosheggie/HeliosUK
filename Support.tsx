import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sun, 
  Cloud, 
  Wind, 
  Thermometer, 
  Zap, 
  MapPin, 
  TrendingUp, 
  Calendar,
  Info,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';

interface SolarIntelligenceProps {
  onNavigate: (tab: string) => void;
  currentSolarSize: number;
  onUpdateSolarSize: (size: number) => void;
}

export default function SolarIntelligence({ onNavigate, currentSolarSize, onUpdateSolarSize }: SolarIntelligenceProps) {
  const [location, setLocation] = useState<string>('London, UK');
  const [postcode, setPostcode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  
  // System Configuration State
  const [panelWattage, setPanelWattage] = useState<number>(430);
  const [panelCount, setPanelCount] = useState<number>(Math.round((currentSolarSize * 1000) / 430));
  const [azimuth, setAzimuth] = useState<number>(180); // 180 is South
  const [tilt, setTilt] = useState<number>(35);

  const [yieldData, setYieldData] = useState<any[]>([]);

  // Base production multipliers by month for UK (approximation)
  const monthlyMultipliers = [
    0.3, 0.45, 0.8, 1.1, 1.7, 2.0, 2.1, 1.8, 1.35, 0.85, 0.4, 0.25
  ];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const calculateYield = () => {
    const systemSizeKW = (panelWattage * panelCount) / 1000;
    onUpdateSolarSize(systemSizeKW);
    
    // Simple orientation factor (Azimuth: 180 is South)
    // South = 1.0, East/West = 0.85, North = 0.5
    const angleRad = (azimuth - 180) * (Math.PI / 180);
    const orientationFactor = 0.75 + (0.25 * Math.cos(angleRad)); // Result 0.5 to 1.0
    
    // Tilt factor (simplified: peak at 35)
    const tiltFactor = 1 - Math.abs(tilt - 35) * 0.005;

    const newYieldData = months.map((month, index) => {
      // Base generation per kWp in UK is roughly 850-1000 kWh/year
      // We'll use a base of 80 kWh/month per kWp scaled by the monthly multiplier
      const baseKwh = 80 * systemSizeKW * monthlyMultipliers[index] * orientationFactor * tiltFactor;
      return {
        name: month,
        kwh: Math.round(baseKwh)
      };
    });

    setYieldData(newYieldData);
  };

  const handleAutoLocate = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Simple reverse geocode or just use coords for weather
          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await response.json();
          setLocation(`${data.city || data.locality}, ${data.principalSubdivision}`);
          fetchWeather();
        } catch (err) {
          console.error("Geocoding error", err);
          setLocation(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
        } finally {
          setLoading(false);
        }
      }, () => {
        alert("Location access denied. Please enter your postcode manually.");
        setLoading(false);
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleUpdateAnalysis = () => {
    if (postcode.trim()) {
      setLocation(postcode.toUpperCase());
    }
    fetchWeather();
    calculateYield();
  };

  const fetchWeather = async () => {
    setLoading(true);
    // Simulate API call to OpenMeteo
    setTimeout(() => {
      setWeatherData({
        temp: 18,
        condition: 'Partly Cloudy',
        irradiance: 4.8,
        cloudCover: 32,
        todayPotential: Math.round((panelWattage * panelCount / 1000) * 3.1) // Simple random estimate
      });
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchWeather();
    calculateYield();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold mb-4">Solar Intelligence Engine</h1>
        <p className="text-brand-grey max-w-2xl">
          Get trusted, personalised solar potential for your exact property using 
          historical irradiance and real-time weather data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-8 rounded-3xl">
            <h3 className="text-lg font-bold mb-6 flex items-center">
              <MapPin size={20} className="mr-2 text-brand-yellow" />
              Property Details
            </h3>
            
            <div className="space-y-4">
              <div className="flex space-x-2">
                <div className="flex-grow">
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-2">Postcode</label>
                  <input 
                    type="text" 
                    placeholder="e.g. SW1A 1AA"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    className="w-full bg-brand-grey-light/20 dark:bg-white/5 border border-brand-grey-light/30 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-yellow outline-none text-brand-black dark:text-white"
                  />
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={handleAutoLocate}
                    className="p-3 bg-brand-grey-light/20 dark:bg-white/5 border border-brand-grey-light/30 dark:border-white/10 rounded-xl hover:bg-brand-yellow hover:text-brand-black transition-all"
                    title="Auto-locate me"
                  >
                    <MapPin size={20} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-2">Location</label>
                <input 
                  type="text" 
                  value={location}
                  readOnly
                  className="w-full bg-brand-grey-light/10 dark:bg-white/5 border border-brand-grey-light/30 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none text-brand-grey"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-2">Panel Wattage (W)</label>
                  <input 
                    type="number" 
                    value={panelWattage}
                    onChange={(e) => setPanelWattage(Number(e.target.value))}
                    className="w-full bg-brand-grey-light/20 dark:bg-white/5 border border-brand-grey-light/30 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-yellow outline-none text-brand-black dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-2">No. Panels</label>
                  <input 
                    type="number" 
                    value={panelCount}
                    onChange={(e) => setPanelCount(Number(e.target.value))}
                    className="w-full bg-brand-grey-light/20 dark:bg-white/5 border border-brand-grey-light/30 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-yellow outline-none text-brand-black dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-2">Roof Direction</label>
                <div className="relative">
                  <select 
                    value={azimuth}
                    onChange={(e) => setAzimuth(Number(e.target.value))}
                    className="w-full bg-brand-grey-light/20 dark:bg-brand-black border border-brand-grey-light/30 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-yellow outline-none appearance-none text-brand-black dark:text-white"
                  >
                    <option value={180}>South (Optimum)</option>
                    <option value={135}>South East</option>
                    <option value={225}>South West</option>
                    <option value={90}>East</option>
                    <option value={270}>West</option>
                    <option value={0}>North</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-brand-grey">
                    <ChevronRight size={16} className="rotate-90" />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleUpdateAnalysis}
                className="w-full py-4 bg-brand-yellow text-brand-black font-bold rounded-xl mt-4 flex items-center justify-center hover:scale-[1.02] transition-transform"
              >
                {loading ? 'Processing...' : 'Update Analysis'}
              </button>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl border-brand-yellow/20">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Sun size={20} className="mr-2 text-brand-yellow" />
              Regional Potential
            </h3>
            <p className="text-sm text-brand-grey mb-6">
              Your roof receives <span className="text-brand-black dark:text-white font-bold">4.8 kWh/m²/day</span> on average.
            </p>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-brand-grey">Solar Zone</span>
                <span className="font-bold">Southern Tier 1</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-brand-grey">Annual Sun Hours</span>
                <span className="font-bold">1,620 hrs</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-brand-grey">Grid Intensity</span>
                <span className="font-bold text-green-500">Low Carbon</span>
              </div>
            </div>
          </div>
        </div>

        {/* Forecast & Charts */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-3xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg">
                  <Zap size={20} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-grey">Today's Potential</span>
              </div>
              <div className="text-3xl font-display font-bold">{weatherData?.todayPotential || '12.4'} kWh</div>
              <div className="text-xs text-green-500 mt-2 flex items-center">
                <TrendingUp size={12} className="mr-1" />
                +15% vs yesterday
              </div>
            </div>

            <div className="glass p-6 rounded-3xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                  <Cloud size={20} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-grey">Sky Condition</span>
              </div>
              <div className="text-3xl font-display font-bold">Overcast</div>
              <div className="text-xs text-brand-grey mt-2">Cloud cover: 82%</div>
            </div>

            <div className="glass p-6 rounded-3xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
                  <Calendar size={20} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-grey">Best Month</span>
              </div>
              <div className="text-3xl font-display font-bold">
                {yieldData.length > 0 ? [...yieldData].sort((a, b) => b.kwh - a.kwh)[0].name : 'July'}
              </div>
              <div className="text-xs text-brand-grey mt-2">
                Expected: {yieldData.length > 0 ? [...yieldData].sort((a, b) => b.kwh - a.kwh)[0].kwh : '850'} kWh
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-[32px]">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-xl font-bold">Monthly Yield Expectations</h3>
                <p className="text-sm text-brand-grey">Estimated generation for a {(panelWattage * panelCount / 1000).toFixed(1)}kW system at your location</p>
              </div>
              <div className="flex items-center space-x-2 text-xs font-bold text-brand-grey bg-brand-grey-light/10 p-2 rounded-lg">
                <Info size={14} />
                <span>Source: PVGIS 5.2</span>
              </div>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yieldData}>
                  <defs>
                    <linearGradient id="colorKwh" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#facc15" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#9ca3af20" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    unit="kWh"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0d0d0d', 
                      border: 'none', 
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="kwh" 
                    stroke="#facc15" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorKwh)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-8 p-6 bg-brand-yellow/5 rounded-2xl border border-brand-yellow/10 flex items-start space-x-4">
              <div className="p-2 bg-brand-yellow rounded-lg">
                <Lightbulb size={20} className="text-brand-black" />
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1">Helios Insight</h4>
                <p className="text-sm text-brand-grey leading-relaxed">
                  The gap between your June and December yield is <span className="font-bold text-brand-black dark:text-white">8.2x</span>. 
                  Consider adding a 10kWh battery to shift your May-August surplus into self-consumption, 
                  improving your annual ROI by up to 4%.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              onClick={() => onNavigate('ecosystem')}
              className="flex items-center space-x-2 text-brand-yellow font-bold group"
            >
              <span>Model battery savings next</span>
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Lightbulb({ size, className }: { size: number, className?: string }) {
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
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}
