import React, { useState } from "react";
import { DollarSign, Landmark, RefreshCw, Smartphone } from "lucide-react";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number>(100);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");

  const conversionRates: { [key: string]: number } = {
    USD: 300, // 1 USD = 300 LKR
    EUR: 325, // 1 EUR = 325 LKR
    GBP: 382, // 1 GBP = 382 LKR
    AUD: 198, // 1 AUD = 198 LKR
    CAD: 218  // 1 CAD = 218 LKR
  };

  const currentRate = conversionRates[selectedCurrency] || 300;
  const lkrAmount = amount * currentRate;

  // Typical local item costs dictionary requested by the prompt
  const standardCosts = [
    { name: "Fresh King Coconut (Thambili) 🥥", costLkr: 150 },
    { name: "Spicy Kottu Roti Dinner 🍛", costLkr: 600 },
    { name: "Scenic Kandy-Ella Train Ticket 🚂", costLkr: 1200 },
    { name: "1-Hour Surf Board Rental 🏄‍♂️", costLkr: 1500 },
    { name: "Half-Day Safari Jeep Rental (Group) 🐅", costLkr: 18000 }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-emerald-500" />
        <h4 className="text-sm font-sans font-bold text-slate-800 dark:text-slate-100">Currency Exchange Calculator</h4>
      </div>

      <div className="space-y-4">
        {/* Converter Fields */}
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-7">
            <label className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Foreign Amount</label>
            <input
              id="input-conv-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-3 py-2.5 rounded-xl text-xs outline-none text-slate-800 dark:text-slate-100 font-mono focus:border-emerald-500"
            />
          </div>
          <div className="col-span-5">
            <label className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Currency</label>
            <select
              id="select-conv-curr"
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-3 py-2.5 rounded-xl text-xs outline-none text-slate-800 dark:text-slate-100 font-sans focus:border-emerald-500"
            >
              {Object.keys(conversionRates).map(curr => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-100/60 dark:border-emerald-900/30 text-center">
          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-widest font-sans">Equivalent in Sri Lankan Rupees</span>
          <div className="text-xl font-mono font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
            Rs. {lkrAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} LKR
          </div>
          <span className="text-[9px] text-slate-400 block mt-1">Official Mid-Market Rate: 1 {selectedCurrency} = {currentRate} LKR</span>
        </div>

        {/* Local Expenses Benchmark */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[9px] font-bold text-slate-450 block uppercase tracking-widest mb-2 font-sans">
            Typical Local Costs Benchmark:
          </span>
          <div className="space-y-1.5">
            {standardCosts.map((item, id) => {
              const matchesAmount = lkrAmount >= item.costLkr;
              return (
                <div key={id} className="flex justify-between items-center text-[10px] leading-tight">
                  <span className="text-slate-500 dark:text-slate-400">{item.name}</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-slate-400">Rs.{item.costLkr}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-sans font-bold leading-none ${
                      matchesAmount ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                    }`}>
                      {matchesAmount ? "Affordable" : `${(item.costLkr / currentRate).toFixed(1)} ${selectedCurrency}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
