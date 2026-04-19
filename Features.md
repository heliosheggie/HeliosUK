\# 🌞 Helios — Full Platform Specification



\## 📌 Overview

Helios is a transparent, homeowner‑first energy intelligence platform.  

It delivers personalised insights across \*\*solar\*\*, \*\*battery\*\*, \*\*EV\*\*, \*\*tariffs\*\*, \*\*export\*\*, and \*\*full‑ecosystem savings\*\* — without sales pressure.



This document outlines \*\*all core features\*\*, \*\*all additional tools\*\*, and \*\*all engagement modules\*\*.



\---



\# 🚀 MAIN FEATURES



\## 1. 🌤️ Solar Intelligence Engine

\*\*Purpose:\*\* Provide trusted, personalised solar potential for any UK property.



\### Components

\- Historical irradiance  

\- 7–14 day solar forecast  

\- Seasonal yield expectations  

\- Cloud cover \& temperature impact  

\- Optional: shading estimation  



\### Free Data Sources

\- Open‑Meteo Solar API  

\- NASA POWER  

\- PVGIS  

\- Met Office (limited free tier)



\### User Output

\- “Your roof receives \*\*X kWh/m²/day\*\* on average.”  

\- “Expected annual solar generation: \*\*Y kWh\*\*.”  

\- “Best months for solar at your location.”



\---



\## 2. 🏠 Roof \& Panel Designer

\*\*Purpose:\*\* Let users draw their roof, test layouts, and calculate generation.



\### Features

\- Upload or auto‑fetch satellite image  

\- Draw polygon for roof area  

\- Optional: auto‑detect pitch \& orientation  

\- Drag‑and‑drop solar panels  

\- Auto‑calculate:

&#x20; - Max panel count  

&#x20; - Total wattage  

&#x20; - Estimated annual generation  

&#x20; - Cost vs ROI  



\### Free/Open Tools

\- Leaflet.js / Mapbox  

\- Turf.js  

\- Three.js (optional 3D)  

\- PVGIS modelling  



\### User Output

\- “Your roof can fit \*\*18 × 430W panels = 7.74 kW\*\*.”  

\- “Estimated annual output: \*\*7,100 kWh\*\*.”



\---



\## 3. 💷 Solar \& Grant Calculator

\*\*Purpose:\*\* Provide a clear, unbiased financial picture.



\### Inputs

\- Roof suitability  

\- Panel count \& wattage  

\- Inverter size  

\- Battery size  

\- Orientation \& pitch  

\- Local irradiance  

\- Annual electricity usage  



\### Outputs

\- System cost estimate  

\- Annual savings  

\- Payback period  

\- ROI %  

\- Carbon savings  

\- Grant eligibility  



\### Grants

\- ECO4  

\- Home Energy Scotland  

\- Boiler Upgrade Scheme  

\- VAT 0% rules  



\---



\## 4. ⚡ Tariff \& Supplier Optimiser

\*\*Purpose:\*\* Match homeowners to the best tariff for their system.



\### Tariffs

\- Octopus Agile  

\- Octopus Go  

\- Octopus Cosy  

\- Intelligent Octopus  

\- Economy 7  

\- Standard variable  

\- EV‑specific tariffs  



\### Features

\- Compare cheap/peak windows  

\- Battery charging opportunities  

\- Savings if switching  

\- Integrate Octopus referral link  



\### User Output

\- “Octopus Go saves you \*\*£X/year\*\*.”  

\- “Charging at \*\*00:30–04:30\*\* reduces costs by \*\*Y%\*\*.”



\---



\## 5. 🔄 Full Ecosystem Savings Simulator

\*\*Purpose:\*\* Show the complete picture: solar + battery + EV + tariff.



\### Inputs

\- Solar generation  

\- Battery size  

\- EV charging habits  

\- Tariff windows  

\- Usage profile  

\- Export tariff (SEG)



\### Outputs

\- Annual grid import  

\- Annual export  

\- Self‑consumption %  

\- Savings vs no‑solar  

\- Savings vs different tariffs  

\- Payback period  

\- Best configuration  



\### Example

“With a \*\*5kW system + 10kWh battery + EV on Go\*\*, your bill drops from \*\*£1,850 → £420\*\*.”



\---



\## 6. 💛 Support Layer (Monetisation)

\*\*Purpose:\*\* Keep Helios free while enabling optional support.



\### Options

\- Stripe donation button  

\- “Buy Me a Coffee” micro‑donations  

\- Octopus referral link  

\- Future: vetted installer partnerships  



\---



\# ➕ ADDITIONAL TOOLS



\## 1. 🏡 Live Home Energy Dashboard

\*\*Inputs:\*\*  

\- Home size  

\- Occupants  

\- Monthly bill  

\- Heating type  

\- EV ownership  

\- Battery size  

\- Solar system size  



\*\*Outputs:\*\*  

\- Estimated daily usage  

\- Peak vs off‑peak profile  

\- Best tariff match  

\- Solar savings  

\- Battery savings  

\- EV optimisation  

\- Carbon footprint  



\---



\## 2. 🌤️ Live Solar Forecast Widget

\- Today/tomorrow potential  

\- Weekly trend  

\- Best charging window  

\- Expected generation today  



\---



\## 3. 🧭 Roof Suitability Checker

\*\*Inputs:\*\* direction, pitch, shading, material, age  

\*\*Outputs:\*\* suitability score, system size, generation, payback, battery recommendation  



\---



\## 4. 🧮 Battery Sizing Wizard

\*\*Inputs:\*\* usage, peak usage, EV, tariff, solar size  

\*\*Outputs:\*\* ideal battery size, cost, savings, payback, smart charging windows  



\---



\## 5. 🚗 EV Charging Optimiser

\*\*Inputs:\*\* EV model, battery size, commute, tariff, solar size  

\*\*Outputs:\*\* cheapest window, annual cost, savings, solar‑only potential, smart schedule  



\---



\## 6. 🧾 SEG Export Tariff Comparison

Compare: Octopus Outgoing, Flux, BG SEG, E.ON, EDF  

\*\*Outputs:\*\* best rate, annual export income, best tariff for system size  



\---



\## 7. 🧱 Installer Quote Checker

Highlights: overpriced items, missing components, inverter mismatch, battery sizing issues, warranty gaps  



\---



\## 8. 🧲 Solar Panel Comparison Tool

Compare: wattage, efficiency, warranty, degradation, brand reputation, cost per watt  



\---



\## 9. 🔌 Inverter \& Battery Compatibility Checker

Outputs: compatible?, gateway needed?, hybrid inverter?, alternatives  



\---



\## 10. 🧭 Home Energy Roadmap Generator

Generates a personalised 5‑step roadmap:

1\. Insulation  

2\. Solar  

3\. Battery  

4\. EV  

5\. Tariff optimisation  



\---



\## 11. 📚 Knowledge Hub Tools

\- Myth Buster Zone  

\- Truth Table  

\- Insight Ticker Bar  

\- External Articles Feed  



\---



\## 12. 🧠 AI‑Powered “Ask Helios Anything” Widget

A small assistant for solar, battery, EV, tariff, and savings questions.



\---



\## 13. 🧲 Lead Magnet Tools

\- Solar Potential Report (PDF)  

\- Energy Savings Blueprint  

\- EV Charging Cost Report  



\---



\## 14. 🧡 Community \& Engagement Tools

\- Polls  

\- Quizzes  

\- Savings leaderboard  

\- Local solar map  



\---



\# 🎯 End of Document



