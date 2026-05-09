export interface SolarPotential {
  dailyYield: number;
  annualYield: number;
  bestMonths: string[];
}

export interface WeatherData {
  temp: number;
  condition: string;
  solarIrradiance: number;
  cloudCover: number;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface MenuItem {
  title: string;
  href: string;
  icon?: string;
}

export interface ComparisonItem {
  name: string;
  efficiency: number;
  warranty: number;
  costPerWatt: number;
  rating: number;
}
