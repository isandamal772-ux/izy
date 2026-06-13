import React, { useState, useEffect } from "react";
import { CloudRain, Sun, CloudLightning, Wind, CloudSun, Loader2 } from "lucide-react";

interface WeatherRegion {
  name: string;
  temp: number;
  condition: string;
  humidity: string;
  bestFor: string;
  icon: "sun" | "rain" | "thunder" | "wind" | "cloudsun";
}

export default function WeatherWidget() {
  const [activeRegionIndex, setActiveRegionIndex] = useState(1); // Default Ella
  const [loading, setLoading] = useState(false);
  const [liveWeather, setLiveWeather] = useState<{
    temp: number;
    condition: string;
    humidity: string;
    icon: "sun" | "rain" | "thunder" | "wind" | "cloudsun";
    source: string;
  } | null>(null);

  const regions: WeatherRegion[] = [
    {
      name: "Colombo & Coast",
      temp: 31,
      condition: "Tropical Humidity",
      humidity: "82%",
      bestFor: "Sunset walk on Galle Face & street-food sampling 🌆",
      icon: "cloudsun"
    },
    {
      name: "Ella & Hill Country",
      temp: 21,
      condition: "Cool Misty Highlands",
      humidity: "65%",
      bestFor: "Perfect conditions for hiking Ella Rock & Nine Arch Bridge ⛰️",
      icon: "wind"
    },
    {
      name: "Mirissa & South Coast",
      temp: 29,
      condition: "Sunny Shorelines",
      humidity: "75%",
      bestFor: "Excellent wave breaks for surfing & early morning whale watching 🐋",
      icon: "sun"
    },
    {
      name: "Sigiriya & Cultural Triangle",
      temp: 33,
      condition: "Dry Heat & Sunshine",
      humidity: "50%",
      bestFor: "Climb the Sigiriya Rock fortress early to bypass midday heat 🏰",
      icon: "sun"
    },
    {
      name: "Yala National Park",
      temp: 32,
      condition: "Arid & Windy",
      humidity: "58%",
      bestFor: "Clear sky visibility. Ideal for leopard tracking safaris 🐆",
      icon: "sun"
    }
  ];

  const regionCoords = [
    { city: "Colombo", lat: 6.9271, lon: 79.8612 },
    { city: "Ella", lat: 6.8724, lon: 81.0470 },
    { city: "Mirissa", lat: 5.9482, lon: 80.4573 },
    { city: "Sigiriya", lat: 7.9570, lon: 80.7603 },
    { city: "Yala", lat: 6.3692, lon: 81.5173 }
  ];

  const activeRegion = regions[activeRegionIndex];

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      const coords = regionCoords[activeRegionIndex];
      const apiKey = (import.meta as any).env?.VITE_OPENWEATHERMAP_API_KEY;

      // 1. Try OpenWeatherMap if key is available
      if (apiKey && apiKey !== "YOUR_API_KEY" && !apiKey.startsWith("YOUR_")) {
        try {
          const resp = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${apiKey}`
          );
          if (resp.ok) {
            const data = await resp.json();
            const mainCond = data.weather?.[0]?.main?.toLowerCase() || "";
            let iconType: "sun" | "rain" | "thunder" | "wind" | "cloudsun" = "cloudsun";
            
            if (mainCond.includes("clear") || mainCond.includes("sun")) iconType = "sun";
            else if (mainCond.includes("thunder") || mainCond.includes("lightning")) iconType = "thunder";
            else if (mainCond.includes("rain") || mainCond.includes("drizzle") || mainCond.includes("shower")) iconType = "rain";
            else if (mainCond.includes("wind") || mainCond.includes("cloudy")) iconType = "wind";

            setLiveWeather({
              temp: Math.round(data.main?.temp ?? activeRegion.temp),
              condition: data.weather?.[0]?.description
                ? (data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1))
                : activeRegion.condition,
              humidity: `${data.main?.humidity ?? activeRegion.humidity}%`,
              icon: iconType,
              source: "Live OpenWeatherMap"
            });
            setLoading(false);
            return;
          }
        } catch (error) {
          console.warn("OpenWeatherMap retrieval issue, trying Open-Meteo fallback:", error);
        }
      }

      // 2. Try Open-Meteo Free API as high-reliability keyless fallback
      try {
        const resp = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true&hourly=relative_humidity_2m`
        );
        if (resp.ok) {
          const data = await resp.json();
          const current = data.current_weather;
          if (current) {
            const code = current.weathercode;
            let cond = "Pleasant Climate";
            let iconType: "sun" | "rain" | "thunder" | "wind" | "cloudsun" = "cloudsun";

            if (code === 0) { cond = "Clear Skies"; iconType = "sun"; }
            else if (code >= 1 && code <= 3) { cond = "Partly Cloudy"; iconType = "cloudsun"; }
            else if (code >= 45 && code <= 48) { cond = "Misty Fog"; iconType = "wind"; }
            else if (code >= 51 && code <= 55) { cond = "Passing Drizzle"; iconType = "rain"; }
            else if (code >= 61 && code <= 65) { cond = "Heavy Rain"; iconType = "rain"; }
            else if (code >= 80 && code <= 82) { cond = "Passing Showers"; iconType = "rain"; }
            else if (code >= 95) { cond = "Heavy Thunderstorms"; iconType = "thunder"; }

            const mappedHumidity = data.hourly?.relative_humidity_2m?.[0] || parseInt(activeRegion.humidity);

            setLiveWeather({
              temp: Math.round(current.temperature),
              condition: cond,
              humidity: `${mappedHumidity}%`,
              icon: iconType,
              source: "Live Satellite Tracker"
            });
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Failed to retrieve Open-Meteo weather details, using static metadata:", err);
      }

      // 3. Fallback to offline defaults
      setLiveWeather(null);
      setLoading(false);
    };

    fetchWeather();
  }, [activeRegionIndex]);

  const displayTemp = liveWeather?.temp ?? activeRegion.temp;
  const displayCondition = liveWeather?.condition ?? activeRegion.condition;
  const displayHumidity = liveWeather?.humidity ?? activeRegion.humidity;
  const displayIcon = liveWeather?.icon ?? activeRegion.icon;
  const displaySource = liveWeather?.source ? liveWeather.source : "Cached Baseline Coordinates";

  const renderWeatherIcon = (icon: "sun" | "rain" | "thunder" | "wind" | "cloudsun") => {
    switch (icon) {
      case "sun":
        return <Sun className="w-10 h-10 text-amber-500 animate-spin" style={{ animationDuration: "35s" }} />;
      case "rain":
        return <CloudRain className="w-10 h-10 text-blue-400 animate-bounce" />;
      case "thunder":
        return <CloudLightning className="w-10 h-10 text-violet-500" />;
      case "wind":
        return <Wind className="w-10 h-10 text-teal-400 animate-pulse" />;
      default:
        return <CloudSun className="w-10 h-10 text-amber-500" />;
    }
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-205/60 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-500" />
          <h4 className="text-sm font-sans font-bold text-slate-800 dark:text-slate-100 font-sans tracking-tight">Active Microclimate Tracker</h4>
        </div>
        {loading && <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />}
      </div>

      {/* Select buttons */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-4">
        {regions.map((region, idx) => (
          <button
            key={region.name}
            id={`btn-weather-region-${idx}`}
            onClick={() => setActiveRegionIndex(idx)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-sans font-semibold border transition-all whitespace-nowrap cursor-pointer ${
              idx === activeRegionIndex
                ? "bg-amber-55 border-amber-500 text-amber-800 dark:bg-amber-955/20 dark:text-amber-400 font-bold"
                : "border-slate-150 dark:border-slate-850 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850"
            }`}
          >
            {region.name.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Current climate display */}
      <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-150 dark:border-slate-850 flex items-center justify-between mb-3.5">
        <div>
          <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest">{activeRegion.name}</span>
          <div className="text-2xl font-sans font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
            {displayTemp}°C <span className="text-xs font-normal text-slate-400">/ {((displayTemp * 9/5) + 32).toFixed(0)}°F</span>
          </div>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mt-0.5">
            {displayCondition} • Humidity: {displayHumidity}
          </span>
          <span className="text-[8.5px] font-mono text-emerald-600/80 dark:text-emerald-500/80 block mt-1 uppercase tracking-wide">
            {displaySource}
          </span>
        </div>
        <div className="pr-1">
          {renderWeatherIcon(displayIcon)}
        </div>
      </div>

      {/* Live Advice banner */}
      <div className="p-3 bg-amber-50/40 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-950/30 rounded-xl">
        <span className="text-[9px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest block font-sans mb-1">Local Travel Recommendation</span>
        <p className="text-[10.5px] leading-relaxed text-slate-600 dark:text-slate-300">
          {activeRegion.bestFor}
        </p>
      </div>
    </div>
  );
}
