import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Map as MapIcon, 
  Layers, 
  Plus, 
  Trash2, 
  Save, 
  Maximize, 
  Maximize2,
  AlertCircle,
  Sun,
  Zap,
  Calculator,
  ChevronRight,
  Info,
  Building2
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '../lib/utils';

import L from 'leaflet';

interface RoofDesignerProps {
  onNavigate: (tab: string) => void;
}

export default function RoofDesigner({ onNavigate }: RoofDesignerProps) {
  const [activeLayer, setActiveLayer] = useState<'osm' | 'satellite'>('osm');
  const [panels, setPanels] = useState<number>(0);
  const [wattage, setWattage] = useState<number>(430);
  const [panelScale, setPanelScale] = useState<number>(1.5);
  const [selectedSlope, setSelectedSlope] = useState<string>('Primary Slope');
  const [roofType, setRoofType] = useState<'Gable' | 'Hip' | 'Mansard' | 'Flat' | 'Skillion' | 'Gambrel' | 'Dormer' | 'Butterfly' | 'M-Shaped'>('Gable');
  const [azimuth, setAzimuth] = useState<number>(180);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [isDrawing, setIsDrawing] = useState(false);
  const [markers, setMarkers] = useState<[number, number][]>([]);
  const [placedPanels, setPlacedPanels] = useState<{ x: number, y: number, slope: string }[]>([]);

  const handleAddPanel = () => setPanels(prev => prev + 1);
  const handleRemovePanel = () => {
    setPanels(prev => Math.max(0, prev - 1));
    if (placedPanels.length > 0) {
      setPlacedPanels(prev => prev.slice(0, -1));
    }
  };

  const totalKw = (panels * wattage) / 1000;
  
  const roofIntelligence = {
    Gable: { 
      suitability: 'Excellent', 
      rank: 5,
      slopes: ['Slope A (Front)', 'Slope B (Back)'],
      description: 'Classic triangular roof with two pitched planes meeting at a ridge.',
      notes: 'South-facing gables allow for maximum yield and simple, rectangular panel layouts.' 
    },
    Hip: { 
      suitability: 'Good', 
      rank: 3,
      slopes: ['South Plane', 'East Plane', 'West Plane', 'North Plane'],
      description: 'All sides slope downwards to the walls; no vertical gable ends.',
      notes: 'Smaller usable planes due to internal angles. Excellent for E/S/W hybrid systems.' 
    },
    Mansard: { 
      suitability: 'Fair', 
      rank: 4,
      slopes: ['Upper Shallow', 'Lower Steep'],
      description: 'Four sides, each with two slopes—a steep lower and a shallow upper.',
      notes: 'Upper shallow slopes are best for PV. Lower steep slopes are usually unsuitable.' 
    },
    Flat: { 
      suitability: 'Excellent', 
      rank: 5,
      slopes: ['Main Roof Area'],
      description: 'Minimal pitch (0–10°). Common in extensions and commercial buildings.',
      notes: 'Allows for perfect South-facing orientation using ballast-weighted tilt frames.' 
    },
    Skillion: { 
      suitability: 'Excellent', 
      rank: 4,
      slopes: ['Main Slope'],
      description: 'Modern, clean single-slope roof.',
      notes: 'One continuous plane allows for very efficient installation if facing South.' 
    },
    Gambrel: { 
      suitability: 'Good', 
      rank: 3,
      slopes: ['Upper Slope', 'Lower Slope'],
      description: 'Barn-style roof with steep lower slopes and shallow upper slopes.',
      notes: 'Focus panels on the upper shallow slopes to maximize irradiance capture.' 
    },
    Dormer: { 
      suitability: 'Fair', 
      rank: 3,
      slopes: ['Main Roof', 'Dormer Roof'],
      description: 'Windows projecting from the roof, breaking up the continuous planes.',
      notes: 'Reduces usable area. Panels must be modeled carefully to avoid dormer-cast shadows.' 
    },
    Butterfly: { 
      suitability: 'Poor', 
      rank: 1,
      slopes: ['Slope A (Internal)', 'Slope B (Internal)'],
      description: 'Inward-sloping V-shape that meets in a central drainage valley.',
      notes: 'Inward slopes face the wrong direction. Needs raised frames and extra drainage care.' 
    },
    'M-Shaped': { 
      suitability: 'Fair', 
      rank: 2,
      slopes: ['Ridge 1 (S)', 'Ridge 2 (S)'],
      description: 'Two gable roofs joined side-by-side forming an "M" profile.',
      notes: 'Multiple small planes. Ridges can cast significant shadows on neighboring panels.' 
    }
  };

  // Canvas interaction
  const handleBoardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setPlacedPanels(prev => [...prev, { x, y, slope: selectedSlope }]);
    setPanels(prev => prev + 1);
  };

  const clearDesign = () => {
    setPlacedPanels([]);
    setPanels(0);
    setMarkers([]);
  };
  const azimuthMultiplier = Math.max(0.5, 1 - (Math.abs(180 - azimuth) / 180) * 0.5);
  const estAnnualGen = totalKw * 950 * azimuthMultiplier;

  const getAzimuthLabel = (deg: number) => {
    if (deg >= 337.5 || deg < 22.5) return 'North';
    if (deg >= 22.5 && deg < 67.5) return 'North-East';
    if (deg >= 67.5 && deg < 112.5) return 'East';
    if (deg >= 112.5 && deg < 157.5) return 'South-East';
    if (deg >= 157.5 && deg < 202.5) return 'South';
    if (deg >= 202.5 && deg < 247.5) return 'South-West';
    if (deg >= 247.5 && deg < 292.5) return 'West';
    return 'North-West';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold mb-4">Roof & Panel Designer</h1>
          <p className="text-brand-grey max-w-2xl">
            See your roof, draw your usable area, and test different panel layouts. 
            Get instant estimates on wattage and annual generation.
          </p>
        </div>
        <div className="flex bg-brand-grey-light/20 dark:bg-white/5 p-1 rounded-2xl h-14">
          <button 
            onClick={() => setActiveLayer('osm')}
            className={cn(
              "px-6 rounded-xl flex items-center space-x-2 text-sm font-bold transition-all",
              activeLayer === 'osm' ? "bg-white dark:bg-brand-black shadow-sm" : "text-brand-grey"
            )}
          >
            <MapIcon size={18} />
            <span>Map</span>
          </button>
          <button 
            onClick={() => setActiveLayer('satellite')}
            className={cn(
              "px-6 rounded-xl flex items-center space-x-2 text-sm font-bold transition-all",
              activeLayer === 'satellite' ? "bg-white dark:bg-brand-black shadow-sm" : "text-brand-grey"
            )}
          >
            <Layers size={18} />
            <span>Satellite</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-8 rounded-3xl">
            <h3 className="text-lg font-bold mb-6">Roof Configuration</h3>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-grey">Roof Type</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['Gable', 'Hip', 'Mansard', 'Flat', 'Skillion', 'Gambrel', 'Dormer', 'Butterfly', 'M-Shaped'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setRoofType(type)}
                      className={cn(
                        "py-3 px-1 rounded-xl text-[9px] font-bold uppercase tracking-tight border transition-all",
                        roofType === type 
                          ? "bg-brand-yellow border-brand-yellow text-brand-black shadow-lg shadow-brand-yellow/10" 
                          : "bg-white/5 border-white/10 text-brand-grey hover:border-brand-yellow/50"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-grey">Azimuth (Direction)</span>
                  <span className="text-xs font-bold text-brand-yellow">{azimuth}° {getAzimuthLabel(azimuth)}</span>
                </div>
                <input 
                  type="range" min="0" max="359" step="1" 
                  value={azimuth}
                  onChange={(e) => setAzimuth(Number(e.target.value))}
                  className="w-full h-1 bg-brand-grey-light/20 rounded-lg appearance-none cursor-pointer accent-brand-yellow"
                />
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-grey">Panel Orientation</span>
                <div className="flex p-1 bg-brand-grey-light/20 dark:bg-white/5 rounded-xl">
                  <button 
                    onClick={() => setOrientation('portrait')}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                      orientation === 'portrait' ? "bg-white dark:bg-brand-black shadow-sm" : "text-brand-grey"
                    )}
                  >
                    Portrait
                  </button>
                  <button 
                    onClick={() => setOrientation('landscape')}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                      orientation === 'landscape' ? "bg-white dark:bg-brand-black shadow-sm" : "text-brand-grey"
                    )}
                  >
                    Landscape
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-brand-grey-light/20 dark:border-white/5 space-y-6">
                <button 
                  onClick={() => setIsDrawing(!isDrawing)}
                  className={cn(
                    "w-full py-4 rounded-xl flex items-center justify-center space-x-2 font-bold transition-all shadow-xl",
                    isDrawing 
                      ? "bg-red-500 text-white" 
                      : "bg-brand-black text-white dark:bg-brand-yellow dark:text-brand-black shadow-brand-yellow/10"
                  )}
                >
                  {isDrawing ? <Trash2 size={20} /> : <Plus size={20} />}
                  <span>{isDrawing ? 'Confirm Area' : 'Draw Roof Area'}</span>
                </button>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-grey">Panel Wattage</span>
                    <span className="text-sm font-bold">{wattage}W</span>
                  </div>
                  <input 
                    type="range" min="300" max="500" step="10" 
                    value={wattage}
                    onChange={(e) => setWattage(Number(e.target.value))}
                    className="w-full h-1 bg-brand-grey-light/20 rounded-lg appearance-none cursor-pointer accent-brand-yellow"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-grey">Panel Count</span>
                    <div className="flex items-center space-x-3">
                      <button onClick={handleRemovePanel} className="w-8 h-8 flex items-center justify-center glass rounded-lg hover:bg-brand-grey-light/20">-</button>
                      <span className="text-sm font-bold w-6 text-center">{panels}</span>
                      <button onClick={handleAddPanel} className="w-8 h-8 flex items-center justify-center glass rounded-lg hover:bg-brand-grey-light/20">+</button>
                    </div>
                  </div>
                  {placedPanels.length > 0 && (
                    <button 
                      onClick={clearDesign}
                      className="w-full py-2 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/5 transition-colors rounded-lg"
                    >
                      Clear Visual Layout
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl bg-brand-yellow/5 border-brand-yellow/20">
            <h4 className="text-sm font-bold mb-4 flex items-center text-brand-black dark:text-white">
              <Building2 size={16} className="mr-2 text-brand-yellow" />
              {roofType} Profile
            </h4>
            <div className="space-y-4">
              <div className="text-xs text-brand-grey leading-relaxed border-b border-brand-yellow/10 pb-4">
                {roofIntelligence[roofType].description}
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-brand-grey">Suitability</span>
                <span className="flex text-brand-yellow">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Sun 
                      key={i} 
                      size={12} 
                      className={i < roofIntelligence[roofType].rank ? "fill-brand-yellow" : "opacity-20"} 
                    />
                  ))}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-brand-grey">Yield Index</span>
                <span className={cn(
                  "font-bold",
                  roofIntelligence[roofType].rank >= 4 ? "text-green-500" :
                  roofIntelligence[roofType].rank === 3 ? "text-brand-yellow" : "text-red-500"
                )}>
                  {roofIntelligence[roofType].suitability}
                </span>
              </div>
              <p className="text-[10px] text-brand-grey leading-relaxed border-t border-brand-yellow/10 pt-4 italic">
                Expert Note: {roofIntelligence[roofType].notes}
              </p>
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="h-[600px] w-full rounded-[40px] overflow-hidden glass relative border-4 border-white dark:border-zinc-800 shadow-2xl">
            <MapContainer 
              center={[51.505, -0.09]} 
              zoom={19} 
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <TileLayer
                url={activeLayer === 'osm' 
                  ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                }
                attribution='&copy; Helios UK | Imagery &copy; ESRI'
              />
              <MapEvents setMarkers={setMarkers} isDrawing={isDrawing} />
            </MapContainer>

            {/* Design Board Overlay */}
            {isDrawing && (
              <div className="absolute inset-0 z-[500] bg-brand-black/40 backdrop-blur-md flex items-center justify-center p-4 md:p-12">
                <div className="w-full h-full max-w-5xl glass rounded-[40px] border-brand-yellow/30 relative flex flex-col overflow-hidden shadow-2xl shadow-brand-yellow/20">
                  
                  {/* Top Bar: Slope & Scaling */}
                  <div className="p-8 border-b border-white/10 flex flex-col md:row items-center justify-between gap-6 bg-brand-black/20">
                    <div className="text-white">
                      <h4 className="text-2xl font-display font-bold">Replicate Roof Side: {roofType}</h4>
                      <p className="text-sm text-brand-grey">Place panels on {selectedSlope}</p>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-grey block">Target Slope</span>
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                          {roofIntelligence[roofType].slopes.map((slope) => (
                            <button
                              key={slope}
                              onClick={() => setSelectedSlope(slope)}
                              className={cn(
                                "px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                                selectedSlope === slope ? "bg-brand-yellow text-brand-black" : "text-brand-grey hover:text-white"
                              )}
                            >
                              {slope}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 w-48">
                        <div className="flex justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-grey">Panel Size scaling</span>
                          <span className="text-[10px] font-bold text-brand-yellow">x{panelScale.toFixed(1)}</span>
                        </div>
                        <input 
                          type="range" min="0.5" max="4" step="0.1" 
                          value={panelScale}
                          onChange={(e) => setPanelScale(Number(e.target.value))}
                          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-yellow"
                        />
                      </div>
                    </div>
                  </div>

                  <div 
                    className="flex-1 relative cursor-crosshair group flex items-center justify-center overflow-hidden p-12"
                    onClick={handleBoardClick}
                  >
                    {/* Architectural Template Visualization */}
                    <svg viewBox="0 0 100 60" className="w-[85%] h-full drop-shadow-2xl opacity-40">
                      {roofType === 'Gable' && (
                        <path d="M10 50 L50 10 L90 50 Z" fill="rgba(255,255,255,0.05)" stroke="white" strokeWidth="0.2" />
                      )}
                      {roofType === 'Hip' && (
                        <path d="M10 50 L30 15 L70 15 L90 50 Z M30 15 L50 10 L70 15" fill="rgba(255,255,255,0.05)" stroke="white" strokeWidth="0.2" />
                      )}
                      {roofType === 'Flat' && (
                        <rect x="10" y="10" width="80" height="40" fill="rgba(255,255,255,0.05)" stroke="white" strokeWidth="0.2" />
                      )}
                      {roofType === 'Skillion' && (
                        <path d="M10 10 L90 20 L90 50 L10 40 Z" fill="rgba(255,255,255,0.05)" stroke="white" strokeWidth="0.2" />
                      )}
                      {(roofType === 'Mansard' || roofType === 'Gambrel') && (
                        <path d="M10 50 L20 30 L50 10 L80 30 L90 50 Z" fill="rgba(255,255,255,0.05)" stroke="white" strokeWidth="0.2" />
                      )}
                      {roofType === 'Dormer' && (
                        <>
                          <path d="M10 50 L50 20 L90 50 Z" fill="rgba(255,255,255,0.05)" stroke="white" strokeWidth="0.2" />
                          <rect x="40" y="30" width="20" height="15" fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="0.2" />
                        </>
                      )}
                      {roofType === 'Butterfly' && (
                        <path d="M10 10 L50 30 L90 10 L90 40 L50 50 L10 40 Z" fill="rgba(255,255,255,0.05)" stroke="white" strokeWidth="0.2" />
                      )}
                      {roofType === 'M-Shaped' && (
                        <path d="M10 50 L25 10 L40 50 L55 10 L70 50 Z" fill="rgba(255,255,255,0.05)" stroke="white" strokeWidth="0.2" />
                      )}
                    </svg>

                    {/* Placed Panels - Now Scalable and Filtering by Slope */}
                    {placedPanels.map((panel, i) => (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: panel.slope === selectedSlope ? 1 : 0.2 }}
                        key={i}
                        className={cn(
                          "absolute bg-brand-yellow rounded shadow-lg shadow-brand-yellow/30 border border-brand-black/20 z-[600] transition-opacity duration-300",
                          orientation === 'portrait' ? "rounded-sm" : "rounded-sm"
                        )}
                        style={{ 
                          left: `${panel.x}%`, 
                          top: `${panel.y}%`,
                          width: `${(orientation === 'portrait' ? 10 : 15) * panelScale}px`,
                          height: `${(orientation === 'portrait' ? 15 : 10) * panelScale}px`,
                          transform: 'translate(-50%, -50%)' 
                        }}
                      >
                        <div className="w-full h-full flex items-center justify-center p-[10%]">
                          <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-[1px]">
                            <div className="bg-brand-black/20" />
                            <div className="bg-brand-black/20" />
                            <div className="bg-brand-black/20" />
                            <div className="bg-brand-black/20" />
                          </div>
                        </div>
                        {panel.slope !== selectedSlope && (
                          <div className="absolute inset-0 bg-brand-black/40 flex items-center justify-center">
                            <span className="text-[6px] font-bold text-white uppercase text-center">{panel.slope.split(' ')[0]}</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <div className="p-8 bg-brand-black/20 border-t border-white/10 flex items-center justify-between">
                    <button 
                      onClick={clearDesign}
                      className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors"
                    >
                      Clear Visuals
                    </button>

                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-brand-grey">Projected Total</div>
                        <div className="text-xl font-display font-bold text-brand-yellow">{panels} Panels • {totalKw.toFixed(2)} kWp</div>
                      </div>
                      <button 
                        onClick={() => setIsDrawing(false)}
                        className="px-10 py-4 bg-brand-yellow text-brand-black font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-brand-yellow/20"
                      >
                        Finalise Layout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Map Overlay Controls */}
            <div className="absolute top-6 left-6 z-[400] flex flex-col space-y-2">
              <button className="p-3 glass rounded-xl shadow-lg hover:bg-brand-yellow hover:text-brand-black transition-all">
                <Maximize2 size={20} />
              </button>
            </div>

            <div className="absolute bottom-6 left-6 z-[400] glass px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
              Live Design Mode
            </div>

            {/* Visual Direction & Panel Indicator Overlay */}
            <div className="absolute top-6 right-6 z-[400] space-y-4">
              <div className="glass p-4 rounded-2xl flex flex-col items-center">
                <div 
                  className="w-16 h-16 rounded-full border-2 border-brand-yellow/30 flex items-center justify-center relative shadow-inner"
                  style={{ transform: `rotate(${azimuth}deg)` }}
                >
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-brand-yellow rounded-full shadow-lg shadow-brand-yellow/50" />
                  <div className="text-[10px] font-bold text-brand-grey transform rotate-[-inherit]">N</div>
                </div>
                <div className="text-[8px] font-bold uppercase tracking-widest mt-2">{getAzimuthLabel(azimuth)}</div>
              </div>

              <div className="glass p-4 rounded-2xl flex flex-col items-center">
                <div className="w-12 h-16 border border-brand-grey/30 rounded flex flex-col gap-0.5 p-0.5 overflow-hidden">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-full bg-brand-yellow/40 rounded-[1px]",
                        orientation === 'portrait' ? "h-2" : "h-1"
                      )} 
                    />
                  ))}
                </div>
                <div className="text-[8px] font-bold uppercase tracking-widest mt-2">{orientation}</div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass p-6 rounded-2xl flex flex-col items-center">
              <div className="text-[10px] font-bold uppercase tracking-widest text-brand-grey mb-1">Max Power</div>
              <div className="text-2xl font-display font-bold text-brand-yellow">{totalKw.toFixed(2)} kWp</div>
            </div>
            <div className="glass p-6 rounded-2xl flex flex-col items-center">
              <div className="text-[10px] font-bold uppercase tracking-widest text-brand-grey mb-1">Annual Output</div>
              <div className="text-2xl font-display font-bold">{estAnnualGen.toLocaleString()} kWh</div>
            </div>
            <div className="glass p-6 rounded-2xl flex flex-col items-center">
              <div className="text-[10px] font-bold uppercase tracking-widest text-brand-grey mb-1">ROI Est.</div>
              <div className="text-2xl font-display font-bold text-green-500">14.2%</div>
            </div>
            <div className="glass p-6 rounded-2xl flex flex-col items-center">
              <div className="text-[10px] font-bold uppercase tracking-widest text-brand-grey mb-1">Payback</div>
              <div className="text-2xl font-display font-bold">5.8 Yrs</div>
            </div>
          </div>

          <div className="flex justify-between items-center bg-brand-yellow/10 p-6 rounded-3xl border border-brand-yellow/20">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-brand-yellow text-brand-black rounded-2xl">
                <Calculator size={24} />
              </div>
              <div>
                <div className="font-bold">Next: Financial Deep Dive</div>
                <div className="text-xs text-brand-grey">See how grants and tax rules apply to this system.</div>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('grants')}
              className="px-6 py-3 bg-brand-black text-white dark:bg-brand-yellow dark:text-brand-black font-bold rounded-xl flex items-center group"
            >
              Continue
              <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom hook-like component for Leaflet events
function MapEvents({ setMarkers, isDrawing }: { setMarkers: any, isDrawing: boolean }) {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;
    
    const handleClick = (e: L.LeafletMouseEvent) => {
      if (!isDrawing) return;
      setMarkers((prev: any) => [...prev, [e.latlng.lat, e.latlng.lng]]);
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [map, isDrawing, setMarkers]);

  return null;
}
