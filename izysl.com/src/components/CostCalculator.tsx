import React, { useState } from "react";
import { CreditCard, Landmark, Plane, Info, ShieldAlert } from "lucide-react";

export default function CostCalculator() {
  const [duration, setDuration] = useState<number>(7);
  const [tier, setTier] = useState<"backpack" | "moderate" | "luxury">("moderate");
  const [transport, setTransport] = useState<"public" | "tuktuk" | "chauffeur">("tuktuk");
  const [parksCount, setParksCount] = useState<number>(2);

  const tierRates = {
    backpack: 25, // $25 active rate per day
    moderate: 75,  // $75 rate per day
    luxury: 250    // $250 rate per day
  };

  const transportRates = {
    public: 5,     // $5 per day
    tuktuk: 22,    // $22 per day (self drive/hire)
    chauffeur: 65  // $65 per day private car
  };

  const parkTicketRate = 35; // ~$35 USD average national park/Sigiriya entry fee for foreign tourists

  // Calculations
  const dailyAccomGourmet = tierRates[tier];
  const dailyTransit = transportRates[transport];
  const activitiesTotal = parksCount * parkTicketRate;

  const totalUsd = (dailyAccomGourmet + dailyTransit) * duration + activitiesTotal;
  const totalLkr = totalUsd * 300; // 1 USD = 300 LKR

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-5 h-5 text-sky-500" />
        <h4 className="text-sm font-sans font-bold text-slate-800 dark:text-slate-100 font-sans tracking-tight">Travel Budget Calculator</h4>
      </div>

      <div className="space-y-4">
        {/* Sliders and Toggles */}
        <div>
          <div className="flex justify-between items-center text-[10px] mb-1.5 font-bold uppercase text-slate-450">
            <span>Trip Duration: {duration} days</span>
          </div>
          <input
            id="slider-cost-duration"
            type="range"
            min="1"
            max="30"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-450 block uppercase tracking-wider mb-2 font-sans">Accommodation & Style</label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { key: "backpack", name: "Backpacker", icon: "🎒" },
              { key: "moderate", name: "Mid-Range", icon: "🏡" },
              { key: "luxury", name: "Elite Luxury", icon: "💎" }
            ].map(opt => (
              <button
                key={opt.key}
                id={`btn-cost-tier-${opt.key}`}
                onClick={() => setTier(opt.key as any)}
                className={`py-2 px-1 text-[10px] rounded-xl border text-center font-sans tracking-tight transition-all cursor-pointer ${
                  tier === opt.key
                    ? "bg-slate-900 border-slate-900 text-white font-bold dark:bg-slate-850"
                    : "border-slate-150 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-850"
                }`}
              >
                <div className="text-base mb-0.5">{opt.icon}</div>
                {opt.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-450 block uppercase tracking-wider mb-2 font-sans">Transport Preference</label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { key: "public", name: "Bus & Train", icon: "🚂" },
              { key: "tuktuk", name: "TukTuk Rent", icon: "🛺" },
              { key: "chauffeur", name: "Private Car", icon: "🚗" }
            ].map(opt => (
              <button
                key={opt.key}
                id={`btn-cost-trans-${opt.key}`}
                onClick={() => setTransport(opt.key as any)}
                className={`py-2 px-1 text-[10px] rounded-xl border text-center font-sans tracking-tight transition-all cursor-pointer ${
                  transport === opt.key
                    ? "bg-slate-900 border-slate-900 text-white font-bold dark:bg-slate-850"
                    : "border-slate-150 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-850"
                }`}
              >
                <div className="text-base mb-0.5">{opt.icon}</div>
                {opt.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center text-[10px] mb-1.5 font-bold uppercase text-slate-450">
            <span>Special Tickets (Sigiriya, Yala Safari): {parksCount}</span>
          </div>
          <input
            id="slider-cost-parks"
            type="range"
            min="0"
            max="10"
            value={parksCount}
            onChange={(e) => setParksCount(parseInt(e.target.value))}
            className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
          />
        </div>

        {/* Calculated Breakdown Output */}
        <div className="bg-sky-50/50 dark:bg-sky-950/20 rounded-2xl p-4 border border-sky-100/65 dark:border-sky-900/30">
          <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-widest text-center mb-1 font-sans">Estimated Holiday Investment</span>
          <div className="text-center">
            <h5 className="text-2xl font-mono font-extrabold text-sky-800 dark:text-sky-400">
              ${totalUsd.toLocaleString()} <span className="text-xs font-normal text-slate-500 dark:text-slate-400 font-sans">USD</span>
            </h5>
            <span className="text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400 block mt-0.5">
              ≈ Rs. {totalLkr.toLocaleString()} LKR
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-sky-100/60 dark:border-sky-900/30 space-y-1.5 text-[10px] text-slate-600 dark:text-slate-350">
            <div className="flex justify-between">
              <span>Accom. & Dining (~${dailyAccomGourmet}/day):</span>
              <span className="font-mono">${dailyAccomGourmet * duration} USD</span>
            </div>
            <div className="flex justify-between">
              <span>Local Transit (~${dailyTransit}/day):</span>
              <span className="font-mono">${dailyTransit * duration} USD</span>
            </div>
            <div className="flex justify-between">
              <span>National Park tickets / Entries:</span>
              <span className="font-mono">${activitiesTotal} USD</span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl flex items-start gap-2 border border-slate-150 dark:border-slate-850">
          <Info className="w-3.5 h-3.5 text-slate-450 mt-0.5 flex-shrink-0" />
          <p className="text-[9.5px] leading-tight text-slate-400 font-sans">
            Budgets exclude intercontinental flight costs. In Sri Lanka, carrying cash (LKR) is highly recommended outside cities as small local fruit vendors and tuk-tuks rarely accept credit cards.
          </p>
        </div>
      </div>
    </div>
  );
}
