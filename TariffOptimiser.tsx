import { Mail, Phone, MapPin, Facebook, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-brand-black text-white pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center cursor-pointer group" onClick={() => onNavigate('home')}>
              <div className="mr-3 overflow-hidden rounded-lg shadow-lg shadow-brand-yellow/10 group-hover:scale-105 transition-transform duration-300">
                <img 
                  src="/public/assets/images/helios_logo.png" 
                  alt="Helios Logo" 
                  className="h-8 w-8 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-2xl font-display font-bold tracking-tight">
                HELIOS<span className="text-brand-yellow">UK</span>
              </span>
            </div>
            <p className="text-brand-grey text-sm leading-relaxed">
              Eliminating the noise in the home energy market. Providing unbiased, 
              evidence-based insights for UK homeowners.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61574386582215" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-white/5 rounded-full hover:bg-brand-yellow hover:text-brand-black transition-all"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-display font-semibold mb-6">Tools</h4>
            <ul className="space-y-4 text-brand-grey text-sm">
              <li><button onClick={() => onNavigate('solar')} className="hover:text-brand-yellow transition-colors">Solar Intelligence</button></li>
              <li><button onClick={() => onNavigate('roof')} className="hover:text-brand-yellow transition-colors">Roof Designer</button></li>
              <li><button onClick={() => onNavigate('ecosystem')} className="hover:text-brand-yellow transition-colors">Ecosystem Simulator</button></li>
              <li><button onClick={() => onNavigate('tariffs')} className="hover:text-brand-yellow transition-colors">Tariff Optimiser</button></li>
              <li><button onClick={() => onNavigate('quote-checker')} className="hover:text-brand-yellow transition-colors">Quote Checker</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-display font-semibold mb-6">Resources</h4>
            <ul className="space-y-4 text-brand-grey text-sm">
              <li><button onClick={() => onNavigate('knowledge')} className="hover:text-brand-yellow transition-colors">Knowledge Hub</button></li>
              <li><button onClick={() => onNavigate('grants')} className="hover:text-brand-yellow transition-colors">Grant Eligibility</button></li>
              <li><button onClick={() => onNavigate('roadmap')} className="hover:text-brand-yellow transition-colors">Energy Roadmap</button></li>
              <li><a href="https://share.octopus.energy/new-grove-296" target="_blank" rel="noopener noreferrer" className="hover:text-brand-yellow transition-colors flex items-center">Octopus Referral <ExternalLink size={12} className="ml-1" /></a></li>
              <li><button onClick={() => onNavigate('support')} className="hover:text-brand-yellow transition-colors">Support Helios</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-display font-semibold mb-6">Contact</h4>
            <ul className="space-y-4 text-brand-grey text-sm">
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-brand-yellow" />
                <a href="mailto:heliosheggie@gmail.com" className="hover:text-brand-yellow transition-colors">heliosheggie@gmail.com</a>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin size={18} className="text-brand-yellow" />
                <span>Lochgelly, Fife</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-display font-semibold mb-6">Mailing List</h4>
            <p className="text-sm text-brand-grey mb-4">Stay ahead with energy intelligence updates.</p>
            <form 
              className="space-y-2" 
              onSubmit={(e) => {
                e.preventDefault();
                const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
                window.location.href = `mailto:heliosheggie@gmail.com?subject=Mailing List Sign Up&body=New subscriber request for Helios Intel:%0D%0AEmail: ${email}`;
              }}
            >
              <input 
                type="email" 
                name="email"
                placeholder="you@example.com" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
                required
              />
              <button 
                type="submit"
                className="w-full bg-brand-yellow text-brand-black font-bold py-2 rounded-xl text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Join Helios Intel
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-brand-grey text-xs">
            © {new Date().getFullYear()} Helios UK Platform. All rights reserved. Built for Homeowners.
          </p>
          <div className="flex space-x-6 text-xs text-brand-grey">
            <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">Terms of Service</button>
            <button onClick={() => onNavigate('cookies')} className="hover:text-white transition-colors">Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
