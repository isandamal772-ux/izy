import React, { useState } from "react";
import { PLACES_DATA, HOTELS_DATA, RESTAURANTS_DATA } from "../data/srilankaData";
import { DestinationCategory, Place, Hotel, Restaurant, TripPlan } from "../types";
import { Compass, Calendar, MapPin, Eye, FileText, Globe, Plus, Trash2, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

export default function TripPlanner() {
  const [selectedDuration, setSelectedDuration] = useState<number>(3); // Default 3 Days
  const [selectedBeaches, setSelectedBeaches] = useState<string[]>([]);
  const [selectedWaterfalls, setSelectedWaterfalls] = useState<string[]>([]);
  const [selectedHotels, setSelectedHotels] = useState<string[]>(["ht-98acres"]); // Pre-select a default hotel
  const [selectedRestaurants, setSelectedRestaurants] = useState<string[]>(["rs-cafechill"]); // Pre-select a default restaurant
  
  const [generatedPlan, setGeneratedPlan] = useState<TripPlan | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Group locations
  const beaches = PLACES_DATA.filter(p => p.category === DestinationCategory.BEACHES).slice(0, 8);
  const waterfalls = PLACES_DATA.filter(p => p.category === DestinationCategory.WATERFALLS).slice(0, 8);

  const toggleSelection = (id: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(id)) {
      setter(list.filter(item => item !== id));
    } else {
      setter([...list, id]);
    }
  };

  const handleGenerateItinerary = () => {
    // Collect entities using lookups
    const chosenBeaches = PLACES_DATA.filter(p => selectedBeaches.includes(p.id));
    const chosenWaterfalls = PLACES_DATA.filter(p => selectedWaterfalls.includes(p.id));
    const chosenHotels = HOTELS_DATA.filter(h => selectedHotels.includes(h.id));
    const chosenRestaurants = RESTAURANTS_DATA.filter(r => selectedRestaurants.includes(r.id));

    const totalSelectedCount = chosenBeaches.length + chosenWaterfalls.length + chosenHotels.length + chosenRestaurants.length;

    // Default library to pull activities if nothing was selected
    const fallbackBeaches = PLACES_DATA.filter(p => p.category === DestinationCategory.BEACHES).slice(0, 4);
    const fallbackWaterfalls = PLACES_DATA.filter(p => p.category === DestinationCategory.WATERFALLS).slice(0, 4);

    const beachesList = chosenBeaches.length > 0 ? chosenBeaches : fallbackBeaches;
    const waterfallsList = chosenWaterfalls.length > 0 ? chosenWaterfalls : fallbackWaterfalls;
    const hotelList = chosenHotels.length > 0 ? chosenHotels : [HOTELS_DATA[0]];
    const restaurantList = chosenRestaurants.length > 0 ? chosenRestaurants : RESTAURANTS_DATA.slice(0, 2);

    const generatedItinerary: TripPlan["itinerary"] = {};

    for (let day = 1; day <= selectedDuration; day++) {
      const activeHotel = hotelList[(day - 1) % hotelList.length];
      const activeRestaurant1 = restaurantList[((day * 2) - 2) % restaurantList.length];
      const activeRestaurant2 = restaurantList[((day * 2) - 1) % restaurantList.length];
      const activeBeach = beachesList[(day - 1) % beachesList.length];
      const activeWaterfall = waterfallsList[(day - 1) % waterfallsList.length];

      // Define daily itinerary slots
      generatedItinerary[`Day ${day}`] = {
        theme: day === 1 ? "Coastal Exploration & Welcome Feast" : day === 2 ? "Highland Waterfalls & Summit Hiking" : "Culinary Exploration & Local Souvenirs",
        morning: [
          `Greet the sunrise with a hearty organic breakfast at ${activeHotel.name}.`,
          `Set off early to visit ${activeWaterfall.name} at ${activeWaterfall.location}. ${activeWaterfall.visitorTips[0]}`
        ],
        afternoon: [
          `Relish a delicious culinary platter of local and international fusion specialties at ${activeRestaurant1.name}. Try their recommended menu highlights.`,
          `Unwind at ${activeBeach.name}. ${activeBeach.description}`
        ],
        evening: [
          `Gather for a tropical sunset cocktail and a candlelight seafood feast by the sea at ${activeRestaurant2.name}.`,
          `Return to your comfort suite at ${activeHotel.name} for an overnight stay.`
        ]
      };
    }

    const newTrip: TripPlan = {
      id: `plan-${Date.now()}`,
      userId: "local-user",
      title: `Personalized ${selectedDuration}-Day Sri Lanka Dream Journey`,
      durationDays: selectedDuration,
      itinerary: generatedItinerary,
      createdAt: new Date().toISOString()
    };

    setGeneratedPlan(newTrip);
    setIsSaved(false);

    // Auto-scroll to results
    setTimeout(() => {
      document.getElementById("planner-itinerary-output")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const savePlanningToUser = () => {
    if (!generatedPlan) return;
    const existingPlansStr = localStorage.getItem("izysl_plans") || localStorage.getItem("visit_srilanka_plans") || "[]";
    const existingPlans = JSON.parse(existingPlansStr);
    localStorage.setItem("izysl_plans", JSON.stringify([...existingPlans, generatedPlan]));
    setIsSaved(true);
  };

  return (
    <div id="trip-planner-container" className="bg-slate-50 dark:bg-slate-900/40 rounded-3xl p-6 md:p-10 border border-slate-200/60 dark:border-slate-800">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <span className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider font-sans inline-flex items-center gap-1.5 mb-3">
          <Compass className="w-3.5 h-3.5" /> Customized Itinerary Generator
        </span>
        <h2 className="text-3xl md:text-4xl font-sans font-bold text-slate-900 dark:text-white tracking-tight leading-none">
          Assemble Your Paradise Itinerary
        </h2>
        <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xl mx-auto">
          Choose your favorite waterfalls, golden coastlines, premium retreats, and specialty restaurants. Let our smart scheduling algorithms design your optimal day-by-day travel guide instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Setup Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Step 1: Select Duration */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block font-sans mb-3.5">
              1. Select Trip Duration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 3, 7, 14].map((duration) => (
                <button
                  key={duration}
                  id={`btn-dur-${duration}`}
                  onClick={() => setSelectedDuration(duration)}
                  className={`py-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                    selectedDuration === duration
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-md font-semibold"
                      : "border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span className="text-sm font-sans">{duration}</span>
                  <span className="text-[9px] font-medium tracking-wider opacity-90 uppercase">Day{duration > 1 ? "s" : ""}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Choose Beaches */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block font-sans mb-1">
              2. Add Beaches to Route
            </span>
            <span className="text-[10px] text-slate-400 block mb-3 leading-none">Select paths you want to include</span>
            <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
              {beaches.map((beach) => {
                const active = selectedBeaches.includes(beach.id);
                return (
                  <button
                    key={beach.id}
                    id={`btn-select-b-${beach.id}`}
                    onClick={() => toggleSelection(beach.id, selectedBeaches, setSelectedBeaches)}
                    className={`px-3 py-2 text-left rounded-xl border text-xs transition-all truncate flex items-center justify-between cursor-pointer ${
                      active
                        ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold"
                        : "border-slate-250 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850"
                    }`}
                  >
                    <span>{beach.name.split(" ")[0]}</span>
                    {active ? <span className="text-emerald-600 font-bold ml-1">✓</span> : <span className="text-xs opacity-50">+</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Choose Waterfalls */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block font-sans mb-1">
              3. Check Highland Waterfalls
            </span>
            <span className="text-[10px] text-slate-400 block mb-3 leading-none">Choose specific water drops</span>
            <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
              {waterfalls.map((wf) => {
                const active = selectedWaterfalls.includes(wf.id);
                return (
                  <button
                    key={wf.id}
                    id={`btn-select-w-${wf.id}`}
                    onClick={() => toggleSelection(wf.id, selectedWaterfalls, setSelectedWaterfalls)}
                    className={`px-3 py-2 text-left rounded-xl border text-xs transition-all truncate flex items-center justify-between cursor-pointer ${
                      active
                        ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold"
                        : "border-slate-250 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850"
                    }`}
                  >
                    <span>{wf.name.split(" ")[0]}</span>
                    {active ? <span className="text-emerald-600 font-bold ml-1">✓</span> : <span className="text-xs opacity-50">+</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Choose Hotels & Dining */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800 space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block font-sans mb-2">
                4. Select Hospitality Base
              </span>
              <div className="grid grid-cols-1 gap-1.5 max-h-[130px] overflow-y-auto">
                {HOTELS_DATA.slice(0, 5).map((hotel) => {
                  const active = selectedHotels.includes(hotel.id);
                  return (
                    <div
                      key={hotel.id}
                      onClick={() => toggleSelection(hotel.id, selectedHotels, setSelectedHotels)}
                      className={`px-3 py-2 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                        active
                          ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-800 dark:text-emerald-300"
                          : "border-slate-150 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850"
                      }`}
                    >
                      <div className="truncate pr-2">
                        <span className="font-semibold block">{hotel.name}</span>
                        <span className="text-[10px] text-slate-400">{hotel.location}</span>
                      </div>
                      <span className="text-xs flex-shrink-0">{active ? "✓" : "+"}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block font-sans mb-2">
                5. Add Gourmet Restaurants
              </span>
              <div className="grid grid-cols-1 gap-1.5 max-h-[130px] overflow-y-auto">
                {RESTAURANTS_DATA.slice(0, 5).map((r) => {
                  const active = selectedRestaurants.includes(r.id);
                  return (
                    <div
                      key={r.id}
                      onClick={() => toggleSelection(r.id, selectedRestaurants, setSelectedRestaurants)}
                      className={`px-3 py-2 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                        active
                          ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-800 dark:text-emerald-300"
                          : "border-slate-150 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850"
                      }`}
                    >
                      <div className="truncate pr-2">
                        <span className="font-semibold block">{r.name}</span>
                        <span className="text-[10px] text-slate-400">{r.cuisine.split(",")[0]}</span>
                      </div>
                      <span className="text-xs flex-shrink-0">{active ? "✓" : "+"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            id="btn-trigger-generation"
            onClick={handleGenerateItinerary}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-105 active:scale-[0.98] text-white font-semibold font-sans uppercase tracking-wider text-xs py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Calendar className="w-4 h-4" /> Assemble Itinerary Plan
          </button>
        </div>

        {/* Right Side: Generated Output Column */}
        <div className="lg:col-span-7">
          {generatedPlan ? (
            <div id="planner-itinerary-output" className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-5 md:p-8 shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-sans">
                    Custom Route Ready
                  </span>
                  <h3 className="text-xl md:text-2xl font-sans font-bold text-slate-900 dark:text-white mt-1">
                    {generatedPlan.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    id="btn-save-plan"
                    onClick={savePlanningToUser}
                    disabled={isSaved}
                    className={`px-4 py-2 rounded-xl text-xs font-medium font-sans flex items-center gap-1.5 transition-all ${
                      isSaved
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                        : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 cursor-pointer"
                    }`}
                  >
                    {isSaved ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" /> Saved to Wishlist
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" /> Save Plan
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Day Details Accordions/Cards */}
              <div className="mt-6 space-y-6">
                {Object.keys(generatedPlan.itinerary).map((dayName) => {
                  const dayData = generatedPlan.itinerary[dayName];
                  return (
                    <motion.div
                      key={dayName}
                      id={`itinerary-card-${dayName.replace(" ", "-")}`}
                      className="bg-slate-50 dark:bg-slate-850 rounded-2xl p-5 border border-slate-150 dark:border-slate-800/80"
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <div className="flex items-center gap-3 mb-2.5">
                        <span className="bg-emerald-600 text-white font-mono text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                          {dayName}
                        </span>
                        <h4 className="text-sm font-sans font-bold text-slate-800 dark:text-slate-200">
                          {dayData.theme}
                        </h4>
                      </div>

                      {/* Morning, Afternoon, Evening Slots */}
                      <div className="space-y-4 mt-4 text-xs">
                        {/* Morning */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-start">
                          <span className="md:col-span-2 text-slate-400 font-sans tracking-wider block font-bold uppercase text-[9px] pt-1">
                            🌅 Morning
                          </span>
                          <ul className="md:col-span-10 space-y-1.5 text-slate-600 dark:text-slate-350 list-none pl-0">
                            {dayData.morning.map((act, i) => (
                              <li key={i} className="relative pl-4">
                                <span className="absolute left-0 top-1.5 w-1 h-1 bg-emerald-500 rounded-full"></span>
                                {act}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Afternoon */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-start pt-3 border-t border-slate-100 dark:border-slate-800">
                          <span className="md:col-span-2 text-slate-400 font-sans tracking-wider block font-bold uppercase text-[9px] pt-1">
                            ☀️ Afternoon
                          </span>
                          <ul className="md:col-span-10 space-y-1.5 text-slate-600 dark:text-slate-350 list-none pl-0">
                            {dayData.afternoon.map((act, i) => (
                              <li key={i} className="relative pl-4">
                                <span className="absolute left-0 top-1.5 w-1 h-1 bg-sky-500 rounded-full"></span>
                                {act}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Evening */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-start pt-3 border-t border-slate-100 dark:border-slate-800">
                          <span className="md:col-span-2 text-slate-400 font-sans tracking-wider block font-bold uppercase text-[9px] pt-1">
                            🌙 Evening
                          </span>
                          <ul className="md:col-span-10 space-y-1.5 text-slate-600 dark:text-slate-350 list-none pl-0">
                            {dayData.evening.map((act, i) => (
                              <li key={i} className="relative pl-4">
                                <span className="absolute left-0 top-1.5 w-1 h-1 bg-indigo-500 rounded-full"></span>
                                {act}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* PDF print button simulation */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  id="btn-print-itinerary"
                  onClick={() => window.print()}
                  className="bg-slate-900 hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-750 text-white font-sans text-xs px-5 py-3 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4" /> Open Print layout (PDF)
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-100/50 dark:bg-slate-900/60 border border-dashed border-slate-250 dark:border-slate-800 rounded-3xl h-[450px] flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-slate-200/50 dark:bg-slate-800/50 p-4 rounded-full mb-4">
                <Compass className="w-8 h-8 text-slate-400 dark:text-slate-500 animate-spin" style={{ animationDuration: "12s" }} />
              </div>
              <h3 className="font-sans font-bold text-slate-800 dark:text-slate-200">Your custom itinerary will show here</h3>
              <p className="text-slate-400 dark:text-slate-500 text-xs max-w-sm mt-1.5 leading-relaxed">
                Configure your preferred duration, list active beach breaks, waterfalls and high-end dining parameters to craft an elite sitemap route.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
