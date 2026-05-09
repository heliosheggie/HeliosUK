import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Sun, 
  Battery, 
  Car, 
  TrendingUp, 
  Home as HomeIcon, 
  ArrowRight,
  TrendingDown,
  Info,
  ShieldCheck,
  Layout,
  RefreshCw
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { cn } from '../lib/utils';

interface EcosystemProps {
  onNavigate: (tab: string) => void;
  solarSize: number;
  setSolarSize: (size: number) => void;
  batterySize: number;
  setBatterySize: (size: number) => void;
  hasEV: boolean;
  setHasEV: (has: boolean) => void;
  tariff: string;
  setTariff: (tariff: string) => void;
}

export default function Ecosystem({ 
  onNavigate, 
  solarSize, 
  setSolarSize, 
  batterySize, 
  setBatterySize, 
  hasEV, 
  setHasEV,
  tariff,
  setTariff
}: EcosystemProps) {
  // Generate dynamic hourly data based on inputs
  const generateProfileData = () => {
    const data = [];
    let currentBatteryEnergy = batterySize * 0.2; // Start with 20%
    const maxBatteryCapacity = batterySize;

    // Solar production profile (Simplified)
    const solarProfile = [0, 0, 0, 0, 0.05, 0.2, 0.5, 0.8, 1.0, 0.9, 0.7, 0.4, 0.1, 0, 0, 0];
    // Baseline load profile (Simplified)
    const loadProfile = [0.2, 0.15, 0.15, 0.2, 0.4, 0.6, 0.8, 0.5, 0.4, 0.4, 0.8, 1.0, 0.7, 0.4, 0.3, 0.2];

    for (let i = 0; i < 24; i += 1.5) {
      const hour = Math.floor(i);
      const hourStr = `${hour.toString().padStart(2, '0')}:00`;
      
      // Calculate Solar
      const solarIndex = Math.floor((i / 24) * 16);
      const solarKwh = solarProfile[solarIndex] * solarSize * 0.8; // Peak scaling
      
      // Calculate Load
      let loadKwh = loadProfile[solarIndex] * 1.5; // Average UK home load scaling
      
      // EV Charging logic (Smart Tariff: 23:30 - 05:30)
      const isSmartChargingWindow = hour >= 23 || hour < 6;
      if (hasEV && isSmartChargingWindow && tariff === 'octopus-intelligent') {
        loadKwh += 7; // 7kW charger
      } else if (hasEV && hour >= 18 && hour < 22 && tariff !== 'octopus-intelligent') {
        loadKwh += 7; // Dumb charging in evening
      }

      // Battery Logic
      const netEnergy = solarKwh - loadKwh;
      if (netEnergy > 0) {
        // Charge battery with surplus
        const chargeAmount = Math.min(netEnergy, (maxBatteryCapacity - currentBatteryEnergy) * 0.9);
        currentBatteryEnergy += chargeAmount;
      } else if (netEnergy < 0) {
        // Discharge battery for deficit (unless it's smart charging window - then pull from grid)
        const isChargingWindow = tariff === 'octopus-intelligent' && isSmartChargingWindow;
        if (!isChargingWindow) {
          const dischargeAmount = Math.min(Math.abs(netEnergy), currentBatteryEnergy * 0.9);
          currentBatteryEnergy -= dischargeAmount;
        }
      }

      data.push({
        hour: hourStr,
        solar: Math.round(solarKwh * 100) / 100,
        load: Math.round(loadKwh * 100) / 100,
        battery: Math.round((currentBatteryEnergy / maxBatteryCapacity) * 100) || 0
      });
    }
    return data;
  };

  const hourlyData = generateProfileData();

  const annualSavings = Math.round((solarSize * 900) * 0.28 + (batterySize * 300) * 0.15);
  const billDropPercent = Math.round(50 + (batterySize > 0 ? 25 : 0) + (solarSize / 10) * 10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold mb-4">Full Ecosystem Savings Simulator</h1>
        <p className="text-brand-grey max-w-2xl">
          Model the complete picture. See how solar + battery + EV + smart tariffs 
          work together to crush your energy bills.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="glass p-8 rounded-3xl">
            <h3 className="text-lg font-bold mb-8">System Config</h3>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-brand-grey">
                  <span>Solar Array</span>
                  <span className="text-brand-yellow">{solarSize.toFixed(1)} kWp</span>
                </div>
                <input 
                  type="range" min="1" max="15" step="0.5" 
                  value={solarSize} 
                  onChange={(e) => setSolarSize(Number(e.target.value))}
                  className="w-full h-1 bg-brand-grey-light/20 rounded-lg appearance-none cursor-pointer accent-brand-yellow" 
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-brand-grey">
                  <span>Battery Storage</span>
                  <span className="text-brand-yellow font-mono text-base">{batterySize} kWh</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[2, 5, 10, 15, 20].map(s => (
                    <button 
                      key={s}
                      onClick={() => setBatterySize(s)}
                      className={cn(
                        "py-2 text-xs font-bold rounded-lg transition-all border",
                        batterySize === s 
                          ? "bg-brand-yellow text-brand-black border-brand-yellow" 
                          : "bg-white/5 border-white/10 hover:border-brand-yellow/50"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <input 
                  type="range" min="0" max="30" step="1" 
                  value={batterySize} 
                  onChange={(e) => setBatterySize(Number(e.target.value))}
                  className="w-full h-1 bg-brand-grey-light/20 rounded-lg appearance-none cursor-pointer accent-brand-yellow" 
                />
              </div>

              <div className="pt-6 border-t border-brand-grey-light/20 dark:border-white/5 space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-grey mb-4">Energy Assets</label>
                  <label className="flex items-center space-x-3 cursor-pointer group mb-3">
                    <div className={cn(
                      "w-10 h-6 rounded-full p-1 transition-colors",
                      hasEV ? "bg-brand-yellow" : "bg-brand-grey-light/30"
                    )} onClick={() => setHasEV(!hasEV)}>
                      <div className={cn("w-4 h-4 rounded-full bg-brand-black transition-transform", hasEV && "translate-x-4")} />
                    </div>
                    <span className="text-sm font-medium">Electric Vehicle (EV)</span>
                  </label>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-grey mb-4">Electricity Tariff</label>
                  <div className="space-y-2">
                    <button 
                      onClick={() => setTariff('octopus-intelligent')}
                      className={cn(
                        "w-full p-3 rounded-xl border text-left text-sm transition-all",
                        tariff === 'octopus-intelligent' 
                          ? "border-brand-yellow bg-brand-yellow/10" 
                          : "border-white/10 glass hover:border-white/30"
                      )}
                    >
                      <div className="font-bold">Octopus Intelligent</div>
                      <div className="text-[10px] text-brand-grey">7.5p/kWh off-peak smart charging</div>
                    </button>
                    <button 
                      onClick={() => setTariff('octopus-flux')}
                      className={cn(
                        "w-full p-3 rounded-xl border text-left text-sm transition-all",
                        tariff === 'octopus-flux' 
                          ? "border-brand-yellow bg-brand-yellow/10" 
                          : "border-white/10 glass hover:border-white/30"
                      )}
                    >
                      <div className="font-bold">Octopus Flux</div>
                      <div className="text-[10px] text-brand-grey">Optimised for high export/battery</div>
                    </button>
                    <button 
                      onClick={() => setTariff('standard')}
                      className={cn(
                        "w-full p-3 rounded-xl border text-left text-sm transition-all",
                        tariff === 'standard' 
                          ? "border-brand-yellow bg-brand-yellow/10" 
                          : "border-white/10 glass hover:border-white/30"
                      )}
                    >
                      <div className="font-bold">Standard Variable</div>
                      <div className="text-[10px] text-brand-grey">28.5p/kWh flat rate</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl bg-brand-yellow/5 border-brand-yellow/20">
            <h4 className="font-bold text-sm mb-4 flex items-center">
              <ShieldCheck size={16} className="mr-2 text-brand-yellow" />
              Optimal Balance
            </h4>
            <p className="text-sm text-brand-grey leading-relaxed">
              For your {solarSize.toFixed(1)}kW array, we recommend a <span className="font-bold text-brand-black dark:text-white">{(solarSize * 1.5).toFixed(1)}kWh - {(solarSize * 2.5).toFixed(1)}kWh</span> battery. 
              The extra capacity allows for "Tariff Arbitrage" during negative pricing events.
            </p>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-12">
          {/* Main Chart */}
          <div className="glass p-8 rounded-[32px]">
            <div className="flex flex-col md:row items-center justify-between mb-10 gap-4">
              <div>
                <h3 className="text-xl font-bold">24-Hour Energy Profile</h3>
                <p className="text-sm text-brand-grey">
                  {tariff === 'octopus-intelligent' ? 'Octopus Intelligent' : 'Standard'} tariff simulation
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-brand-yellow rounded-full" />
                  <span className="text-xs text-brand-grey font-bold">Solar (kW)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-brand-grey rounded-full" />
                  <span className="text-xs text-brand-grey font-bold">Load (kW)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-xs text-brand-grey font-bold">Battery SOC (%)</span>
                </div>
              </div>
            </div>

            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#9ca3af10" />
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#0d0d0d', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="solar" stroke="#facc15" fill="#facc15" fillOpacity={0.2} strokeWidth={2} />
                  <Area type="monotone" dataKey="load" stroke="#9ca3af" fill="#9ca3af" fillOpacity={0.1} strokeWidth={2} />
                  <Area type="monotone" dataKey="battery" stroke="#3b82f6" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass p-6 rounded-2xl text-center">
              <div className="text-[10px] font-bold uppercase tracking-widest text-brand-grey mb-2">Self-Consumption</div>
              <div className="text-3xl font-display font-bold">{Math.min(98, 60 + batterySize * 3)}%</div>
            </div>
            <div className="glass p-6 rounded-2xl text-center">
              <div className="text-[10px] font-bold uppercase tracking-widest text-brand-grey mb-2">Self-Sufficiency</div>
              <div className="text-3xl font-display font-bold">{Math.min(95, 40 + (solarSize / 6) * 30 + batterySize * 2)}%</div>
            </div>
            <div className="glass p-6 rounded-2xl text-center">
              <div className="text-[10px] font-bold uppercase tracking-widest text-brand-grey mb-2">Annual Bill Drop</div>
              <div className="text-3xl font-display font-bold text-green-500">{billDropPercent}%</div>
            </div>
            <div className="glass p-6 rounded-2xl text-center bg-brand-yellow/10">
              <div className="text-[10px] font-bold uppercase tracking-widest text-brand-grey mb-2">Est. Annual Savings</div>
              <div className="text-3xl font-display font-bold text-brand-yellow">£{annualSavings}</div>
            </div>
          </div>

          <div className="glass p-12 rounded-[40px] border-brand-grey/10 relative overflow-hidden">
            <div className="flex flex-col md:row items-center justify-between gap-12">
              <div className="flex-1 space-y-6">
                <h3 className="text-3xl font-display font-bold">The Bottom Line</h3>
                <p className="text-brand-grey text-lg leading-relaxed">
                  With a <span className="text-brand-black dark:text-white font-bold">{solarSize.toFixed(1)}kW system + {batterySize}kWh battery</span>, your annual 
                  bill drops significantly from <span className="line-through decoration-red-500">£2,150</span> to <span className="text-brand-yellow font-bold">£{2150 - annualSavings}</span>.
                </p>
                <div className="p-4 bg-brand-grey-light/20 dark:bg-white/5 rounded-xl flex items-center space-x-3 text-sm">
                  <TrendingDown size={20} className="text-green-500" />
                  <span>Includes {hasEV ? 'EV smart charging' : 'optimised'} savings on {tariff === 'octopus-intelligent' ? 'Octopus Intelligent' : 'standard'} tariff.</span>
                </div>
              </div>
              <div className="flex-1 w-full flex flex-col space-y-4">
                <button 
                  onClick={() => onNavigate('roadmap')}
                  className="w-full py-5 bg-brand-black text-white dark:bg-brand-yellow dark:text-brand-black font-bold rounded-2xl flex items-center justify-center hover:scale-[1.02] transition-transform"
                >
                  Generate Energy Roadmap
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
