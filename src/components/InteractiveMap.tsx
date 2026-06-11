import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShimmerImage } from "./ShimmerImage";
import { MapPin, Star, Sparkles, Compass } from "lucide-react";

// Types for data structure
interface PlaceData {
  name: string;
  img: string;
  desc: string;
}

interface ProvinceData {
  beaches: PlaceData[];
  temples: PlaceData[];
  rivers: PlaceData[];
  forests: PlaceData[];
}

const sriLankaData: Record<string, ProvinceData> = {
  "Western": {
    beaches: [
      { name: "Galle Face Green", img: "https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg?w=600", desc: "An oceanfront city park along the coast of Colombo, vibrant with food carts, flying kites, and twilight sea views." },
      { name: "Mount Lavinia", img: "https://images.unsplash.com/photo-1540206395-68808572332f?auto=format&fit=crop&w=600&q=80", desc: "A cozy golden beach close to Colombo, famous for sunset views and colonial charm." },
      { name: "Negombo Beach", img: "https://images.unsplash.com/photo-150752428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80", desc: "A colossal beachfront near the airport, featuring active windsurfing and fresh fish markets." }
    ],
    temples: [
      { name: "Gangaramaya Temple", img: "https://images.unsplash.com/photo-1546842931-886c185b4c8c?auto=format&fit=crop&w=600&q=80", desc: "Colombo's iconic lake temple displaying complex architectural styles and Buddhist relics." },
      { name: "Kelaniya Raja Maha Viharaya", img: "https://images.unsplash.com/photo-1608958416715-db1eff002444?auto=format&fit=crop&w=600&q=80", desc: "A highly sacred temple visited by the Buddha, celebrated for spectacular historical frescoes." }
    ],
    rivers: [
      { name: "Kelani River", img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80", desc: "One of Sri Lanka's largest rivers, feeding Colombo and winding through beautiful green hills." },
      { name: "Dandugam Oya", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80", desc: "A peaceful coastal waterway rich in mangrove swamps and local bird life." }
    ],
    forests: [
      { name: "Beddagana Wetland Park", img: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80", desc: "An urban marshy oasis supporting migratory birds, butterfly walks, and dynamic wooden trails." },
      { name: "Bellanwila Forest Reserve", img: "https://images.unsplash.com/photo-1472214222541-d510753a4707?auto=format&fit=crop&w=600&q=80", desc: "A protected green wetland hosting rich biodiversity in the Colombo suburbs." }
    ]
  },
  "Southern": {
    beaches: [
      { name: "Mirissa Beach", img: "https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?w=600", desc: "A dreamy palm-fringed beach world-renowned for blue whale watching and beachside seafood dinners." },
      { name: "Unawatuna Beach", img: "https://images.pexels.com/photos/2486168/pexels-photo-2486168.jpeg?w=600", desc: "A colorful, active coral bay perfect for scuba diving, beach yoga, and sunset cafes." },
      { name: "Tangalle Beach", img: "https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?w=600", desc: "A long, sandy, and pristine stretch of beach where you can enjoy secluded walks and breathtaking Indian Ocean views." }
    ],
    temples: [
      { name: "Kande Viharaya", img: "https://images.unsplash.com/photo-1627885065406-8b9aee603f0b?auto=format&fit=crop&w=600&q=80", desc: "Hosts one of the tallest sitting Buddha statues on earth, overlooking beautiful Aluthgama hills." },
      { name: "Yatagala Raja Maha Viharaya", img: "https://images.unsplash.com/photo-1598977123418-45f04b616a4e?auto=format&fit=crop&w=600&q=80", desc: "A 2300-year-old rock cave temple tucked beneath giant granite boulders in Galle." }
    ],
    rivers: [
      { name: "Walawe River", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80", desc: "An amazing river ending in Ambalantota, housing wild crocodiles and lush river safaris." },
      { name: "Maduganga Lake", img: "https://images.unsplash.com/photo-1437719417030-150193ded372?auto=format&fit=crop&w=600&q=80", desc: "A complex RAMSAR mangrove estuary famous for boat trips, cinnamon grinding islets, and fish therapy." }
    ],
    forests: [
      { name: "Yala National Park", img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80", desc: "Sri Lanka's premier safari park, home to the world's highest density of wild leopards." },
      { name: "Bundala National Park", img: "https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=600&q=80", desc: "A pristine wetland sanctuary attracting thousands of wintering greater flamingos." }
    ]
  },
  "Central": {
    beaches: [
      { name: "Gregory Lake Front", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80", desc: "While there is no sea around the hills, Gregory Lake serves as Kandy/Nuwara Eliya's iconic water resort." }
    ],
    temples: [
      { name: "Temple of the Sacred Tooth Relic", img: "https://images.unsplash.com/photo-1597075922460-626d1c2e6ea4?w=600", desc: "Sri Lanka's most sacred shrine houses the physical tooth relic of Lord Buddha in Kandy's royal palace." },
      { name: "Dambulla Cave Temple", img: "https://images.unsplash.com/photo-1587337041236-f0f6a5f6dd18?w=600", desc: "A majestic, UNESCO World Heritage site consisting of five massive rock coves decorated with ancient murals." },
      { name: "Ramboda Viharaya", img: "https://images.pexels.com/photos/11815555/pexels-photo-11815555.jpeg?w=600", desc: "A serene temple located on the highlands near Ramboda Falls, offering stunning mountain views and spiritual peace." }
    ],
    rivers: [
      { name: "Mahaweli River", img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80", desc: "The longest river in Sri Lanka, powering major hydroelectric dams and forming deep highland gorges." },
      { name: "Aberdeen Waterfalls", img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80", desc: "A spectacular 98-meter mountain cascade falling into a deep emerald rock pool." }
    ],
    forests: [
      { name: "Knuckles Conservation Forest", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80", desc: "A breathtaking UNESCO mist-covered mountain range offering wild mountain trails and rich biodiversity." },
      { name: "Horton Plains National Park", img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80", desc: "An alpine highland grassland plateau that drops over 1,200 meters at the World's End drop-off." }
    ]
  },
  "Northern": {
    beaches: [
      { name: "Casuarina Beach", img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80", desc: "Famous for its powdery white sands and unique Casuarina pine-like trees growing along the shore." },
      { name: "Charty Beach", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80", desc: "A highly quiet and scenic beach on the jackpot peninsula, ideal for peaceful strolls." }
    ],
    temples: [
      { name: "Nallur Kandaswamy Kovil", img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80", desc: "A striking golden Hindu temple with a massive, ornate tower, serving as the cultural heart of Jaffna." },
      { name: "Nagadeepa Purana Viharaya", img: "https://images.unsplash.com/photo-1598977123418-45f04b616a4e?auto=format&fit=crop&w=600&q=80", desc: "An island Buddhist temple off the Jaffna Coast, commemorating Buddha's historic second visit to the country." }
    ],
    rivers: [
      { name: "Thondamanaru Lagoon", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80", desc: "A beautiful brackish lake where flamingos gather, bridged by the historic Selva Sannidhi Shrine." }
    ],
    forests: [
      { name: "Chundikkulam Sanctuary", img: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80", desc: "A wild bird wetland reserve where dense coastal scrubwoods host deer, storks, and rare sea eagles." }
    ]
  },
  "Eastern": {
    beaches: [
      { name: "Nilaveli Beach", img: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80", desc: "A world-class pristine beachfront in Trincomalee, boasting soft sands and clear turquoise tides." },
      { name: "Arugam Bay", img: "https://images.unsplash.com/photo-1437719417030-150193ded372?auto=format&fit=crop&w=600&q=80", desc: "The ultimate surfing capital of Sri Lanka, offering incredible right-hand point breaks and chill surf bars." }
    ],
    temples: [
      { name: "Koneswaram Temple", img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80", desc: "A majestic classical Hindu temple built on a sheer cliff high above the deep blue Trincomalee sea." }
    ],
    rivers: [
      { name: "Maduru Oya", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80", desc: "A wide scenic river feeding the beautiful national park, providing water to wild elephant herds." }
    ],
    forests: [
      { name: "Kumana National Park", img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80", desc: "Sri Lanka's premier bird sanctuary, famous for a large natural mangrove swamp lake hosting nesting egrets." },
      { name: "Pigeon Island Marine Park", img: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=600&q=80", desc: "A protected ocean reef island rich in shallow corals, nesting rock pigeons, and sea turtles." }
    ]
  },
  "Uva": {
    beaches: [
      { name: "Senanayake Samudra Beach Front", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80", desc: "An immense inland beach-like reservoir shoreline located in Gal Oya National Park." }
    ],
    temples: [
      { name: "Kataragama Temple", img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80", desc: "A sacred multi-religious woodland complex visited by Buddhists, Hindus, and Islamic pilgrims alike." },
      { name: "Muthiyangana Raja Maha Viharaya", img: "https://images.unsplash.com/photo-1598977123418-45f04b616a4e?auto=format&fit=crop&w=600&q=80", desc: "An ancient shrine residing in Badulla, with a stupa built originally during the lifetime of Buddha." }
    ],
    rivers: [
      { name: "Bambarakanda Falls", img: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?w=600", desc: "The tallest waterfall in Sri Lanka, dropping from a height of 263 meters amid pine forests." },
      { name: "Diyaluma Falls", img: "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?w=600", desc: "The second highest waterfall in Sri Lanka, boasting beautiful natural rock pools on top for swimming." },
      { name: "Ravana Falls", img: "https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg?w=600", desc: "A popular, wide multi-layered waterfall linked to legendary myths from the Ramayana epic." }
    ],
    forests: [
      { name: "Gal Oya National Park", img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80", desc: "A unique park where guests take boat safaris to spot wild elephants swimming across the blue lake." },
      { name: "Ella Rock Cloud Forest", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80", desc: "A famous mist-shrouded peak offering challenging hiking trails through pine woods and visual drop-offs." }
    ]
  },
  "Sabaragamuwa": {
    beaches: [
      { name: "Chandrika Lake Front", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80", desc: "A calm, picturesque turquoise reservoir near Embilipitiya, providing an beachy feel in the interior wet zone." }
    ],
    temples: [
      { name: "Saman Devalaya Ratnapura", img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80", desc: "The supreme temple dedicated to God Saman, protector of the holy Sri Pada mountain wilderness." },
      { name: "Sankapala Raja Maha Viharaya", img: "https://images.unsplash.com/photo-1598977123418-45f04b616a4e?auto=format&fit=crop&w=600&q=80", desc: "An ancient fortress cave temple where King Dutugemunu's giant warriors retired to meditate." }
    ],
    rivers: [
      { name: "Seethawaka River", img: "https://images.pexels.com/photos/33045/lion-wild-africa-african.jpg?w=600", desc: "A gorgeous watercourse flowing through Avissawella and Sabaragamuwa, great for river hikes and watersports." },
      { name: "Kitulgala Kelani Rapids", img: "https://images.unsplash.com/photo-1437719417030-150193ded372?auto=format&fit=crop&w=600&q=80", desc: "The ultimate center for white water rafting, kayaking, and canyoning through jungle rivers." }
    ],
    forests: [
      { name: "Sinharaja Rain Forest", img: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80", desc: "Sri Lanka's last viable primeval tropical rainforest, housing hundreds of rare endemic bird, frog, and insect species." },
      { name: "Udawalawe National Park", img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80", desc: "A vast grassy park famous for regular, guaranteed sightings of massive herds of wild elephants." }
    ]
  },
  "North Western": {
    beaches: [
      { name: "Kalpitiya Beach", img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80", desc: "A dynamic windswept sandy spit celebrated for kitesurfing, sand dunes, and dolphin safari boats." },
      { name: "Marawila Beach", img: "https://images.unsplash.com/photo-150752428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80", desc: "A long, quiet coast lined with coconut plantations, ideal for deep sunset relaxation." }
    ],
    temples: [
      { name: "Munneswaram Temple", img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80", desc: "A legendary temple mentioned in the Ramayana, dedicated to Shiva and Kali, attracting massive multi-ethnic crowds." },
      { name: "Ridi Viharaya", img: "https://images.unsplash.com/photo-1598977123418-45f04b616a4e?auto=format&fit=crop&w=600&q=80", desc: "The 'Silver Temple', built over an ancient silver mine cave that produced ore for King Dutugemunu." }
    ],
    rivers: [
      { name: "Deduru Oya", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80", desc: "A wide major river irrigating thousands of crop acres, bridged by an impressive engineering dam." }
    ],
    forests: [
      { name: "Wilpattu National Park", img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80", desc: "Sri Lanka's largest national park, characterized by a complex grid of unique natural rain-fed basin lakes called 'Villus'." }
    ]
  },
  "North Central": {
    beaches: [
      { name: "Kala Wewa Shoreline", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80", desc: "A massive historic tank lake mimicking an ocean, built by King Dhatusena in 459 AD." }
    ],
    temples: [
      { name: "Sigiriya Fortress", img: "https://images.unsplash.com/photo-1563492065-2520a66ac20e?w=600", desc: "The world-famous ancient palace complex perched atop a spectacular 200m vertical granite column." },
      { name: "Polonnaruwa", img: "https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?w=600", desc: "The magnificent ancient ruins of the second historic capital of Sri Lanka, showing highly preserved stupas." }
    ],
    rivers: [
      { name: "Malwathu Oya", img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80", desc: "The historic river along which the early Sinhalese civilization settled and constructed Anuradhapura's high kingdom." }
    ],
    forests: [
      { name: "Minneriya National Park", img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80", desc: "Hosts 'The Gathering', where hundreds of wild Asian elephants congregate on the dried reservoir bed during winter months." },
      { name: "Ritigala Strict Nature Reserve", img: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80", desc: "A mysterious mist-shrouded mountain reserve housing ancient monastery ruins and rare microclimate plants." }
    ]
  }
};

// SVG paths representing the 9 provinces
interface ProvincePath {
  id: string;
  name: string;
  d: string;
}

const PROVINCE_PATHS: ProvincePath[] = [
  {
    id: "Northern",
    name: "Northern Province",
    d: "M135,40 L160,20 L185,55 L180,95 L145,110 L125,100 L115,70 Z"
  },
  {
    id: "North Central",
    name: "North Central Province",
    d: "M145,110 L180,95 L215,130 L220,185 L185,215 L140,200 L125,160 Z"
  },
  {
    id: "North Western",
    name: "North Western Province",
    d: "M125,100 L145,110 L125,160 L140,200 L125,250 L85,240 L80,180 Z"
  },
  {
    id: "Eastern",
    name: "Eastern Province",
    d: "M215,130 L245,170 L250,230 L265,300 L240,340 L210,310 L215,255 L185,215 L220,185 Z"
  },
  {
    id: "Central",
    name: "Central Province",
    d: "M140,200 L185,215 L215,255 L210,310 L165,330 L155,270 L145,240 L125,250 Z"
  },
  {
    id: "Western",
    name: "Western Province",
    d: "M125,250 L145,240 L155,270 L150,330 L110,360 L105,330 L115,300 L100,280 Z"
  },
  {
    id: "Sabaragamuwa",
    name: "Sabaragamuwa Province",
    d: "M155,270 L165,330 L195,335 L200,370 L145,390 L110,360 L150,330 Z"
  },
  {
    id: "Uva",
    name: "Uva Province",
    d: "M210,310 L240,340 L245,385 L200,400 L200,370 L195,335 Z"
  },
  {
    id: "Southern",
    name: "Southern Province",
    d: "M110,360 L145,390 L200,370 L200,400 L245,385 L240,410 L210,435 L160,440 L120,415 Z"
  }
];

type CategoryKey = "beaches" | "temples" | "rivers" | "forests";

export default function InteractiveMap() {
  const [selectedProvince, setSelectedProvince] = useState<string>("Western");
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("beaches");
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    // Get mouse position relative to container
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left + 15,
      y: e.clientY - rect.top + 15,
    });
  };

  const categories = [
    { key: "beaches", label: "Beaches", icon: "🏖️" },
    { key: "temples", label: "Temples", icon: "⛩️" },
    { key: "rivers", label: "Rivers/Waterfalls", icon: "🌊" },
    { key: "forests", label: "National Parks", icon: "🌲" }
  ];

  const currentProvinceData = sriLankaData[selectedProvince] || {
    beaches: [],
    temples: [],
    rivers: [],
    forests: []
  };

  const currentPlaces = currentProvinceData[activeCategory] || [];

  return (
    <div id="interactive-map-section" className="w-full bg-slate-900/40 dark:bg-slate-950/40 backdrop-blur-md rounded-3xl border border-slate-250/20 p-4 md:p-8 space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/30 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gold">
            <Compass className="w-5 h-5 text-[#FFD700] animate-pulse" />
            <span className="text-[10px] tracking-widest font-mono text-[#FFD700] font-bold uppercase">PROVINCIAL DISCOVERY GEAR</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-medium text-white tracking-tight flex items-center gap-2">
            Interactive <span className="text-sky-400 font-bold">Sri Lanka Map</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-xl font-sans">
            භූගෝලීය පලත් 9 ඔස්සේ ශ්‍රී ලංකාවේ සැඟවුණු සුන්දරත්වය සොයා යන්න. පලතක් තෝරා තොරතුරු සහ විශේෂිත ස්ථාන ක්ෂණිකව නරඹන්න.
          </p>
        </div>

        {/* Selected breadcrumbs display */}
        <div className="bg-slate-800/55 border border-slate-700/40 px-4 py-2.5 rounded-2xl flex items-center gap-3">
          <div className="text-right">
            <span className="text-[9px] text-slate-400 font-mono block uppercase">Active Exploration Unit</span>
            <span className="text-sm font-bold text-[#FFD700] block">{selectedProvince} Province</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-white text-base">
            🗺️
          </div>
        </div>
      </div>

      {/* Main Grid: Map and details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        
        {/* Left Column: Interactive Map container (4 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center bg-slate-900/60 dark:bg-slate-950/60 border border-slate-800/40 rounded-2xl p-6 relative overflow-visible min-h-[460px] justify-center" onMouseMove={handleMouseMove}>
          
          {/* Compass Rose Backdrop Decoration */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <Compass className="w-80 h-80 text-white animate-spin" style={{ animationDuration: "60s" }} />
          </div>

          <div className="absolute top-4 left-4 bg-slate-800/50 backdrop-blur-md border border-slate-700/40 px-3 py-1.5 rounded-lg text-[10px] font-mono text-slate-350">
            📍 Select or click a Province on Map
          </div>

          {/* Map SVG */}
          <div className="relative w-full max-w-[340px] aspect-[3/4] flex items-center justify-center p-2">
            <svg 
              viewBox="0 0 320 450" 
              className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,119,190,0.25)] select-none"
            >
              <defs>
                {/* Glow filter */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                {/* Ocean gradient background for select */}
                <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0077be" />
                  <stop offset="100%" stopColor="#005295" />
                </linearGradient>
                {/* Gold gradient for highlight borders */}
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFE066" />
                  <stop offset="100%" stopColor="#FFD400" />
                </linearGradient>
              </defs>

              <g id="provinces-group">
                {PROVINCE_PATHS.map((path) => {
                  const isSelected = selectedProvince === path.id;
                  const isHovered = hoveredProvince === path.id;
                  
                  return (
                    <path
                      key={path.id}
                      d={path.d}
                      className="transition-all duration-300 cursor-pointer outline-none"
                      fill={
                        isSelected 
                          ? "url(#oceanGrad)" 
                          : isHovered 
                            ? "rgba(0, 119, 190, 0.45)" 
                            : "rgba(30, 41, 59, 0.6)"
                      }
                      stroke={isSelected ? "#FFD700" : isHovered ? "#38bdf8" : "rgba(255, 255, 255, 0.15)"}
                      strokeWidth={isSelected ? "3" : "1.5"}
                      filter={isSelected ? "url(#glow)" : ""}
                      onClick={() => setSelectedProvince(path.id)}
                      onMouseEnter={() => setHoveredProvince(path.id)}
                      onMouseLeave={() => setHoveredProvince(null)}
                      style={{
                        transformOrigin: "center",
                        transform: isSelected ? "scale(1.02)" : "scale(1)"
                      }}
                    />
                  );
                })}
              </g>

              {/* Text labels for selected or hovered province to help alignment */}
              <text 
                x="160" 
                y="435" 
                textAnchor="middle" 
                className="fill-slate-400 font-mono text-[9px] tracking-widest font-semibold opacity-85 uppercase"
              >
                🇮🇱 Indian Ocean Navigator
              </text>
            </svg>
          </div>

          {/* Floating dynamic state tooltip follows map cursor */}
          {hoveredProvince && (
            <div 
              className="absolute pointer-events-none bg-slate-950/90 backdrop-blur-md border border-[#FFD700]/70 text-white rounded-xl py-1 px-3 shadow-2xl text-xs font-bold font-sans flex items-center gap-2 z-50 animate-fade-in"
              style={{
                left: `${cursorPos.x}px`,
                top: `${cursorPos.y}px`
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-ping" />
              {hoveredProvince} Province
            </div>
          )}

          {/* Quick Stats list */}
          <div className="w-full mt-4 flex items-center justify-between border-t border-slate-800/40 pt-4 text-[11px] text-slate-400 font-mono">
            <span>📡 Native Coordinates: Mercator Stylized</span>
            <span className="text-[#FFD700] font-bold">● Online GPS Link</span>
          </div>

        </div>

        {/* Right Column: Province Categories and dynamic place grid (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Category tabs */}
          <div className="bg-slate-900/60 dark:bg-slate-950/60 border border-slate-800/40 rounded-2xl p-4">
            <span className="text-[10px] text-slate-450 uppercase tracking-wider font-mono font-bold block mb-3">
              Explore Categories inside {selectedProvince}
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key as CategoryKey)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-300 text-xs font-bold border cursor-pointer ${
                      isActive
                        ? "bg-[#0077be] text-white border-[#FFD700]"
                        : "bg-slate-850/60 hover:bg-slate-800/80 text-slate-300 border-slate-750/50"
                    }`}
                  >
                    <span className="text-sm">{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Places View Dashboard */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-widest text-slate-400 font-mono">
                📍 Places in {selectedProvince} — {activeCategory.toUpperCase()} ({currentPlaces.length})
              </span>
              <span className="text-[10px] bg-sky-500/10 text-sky-400 border border-sky-400/20 px-2 py-0.5 rounded-md font-mono">
                Glassmorphism Grid
              </span>
            </div>

            <AnimatePresence mode="wait">
              {currentPlaces.length > 0 ? (
                <motion.div 
                  key={`${selectedProvince}-${activeCategory}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {currentPlaces.map((place, idx) => (
                    <motion.div
                      key={`${place.name}-${idx}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-slate-900/40 dark:bg-slate-950/40 border border-slate-750/30 rounded-2xl overflow-hidden hover:border-sky-400/40 transition-all duration-300 group flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,119,190,0.1)]"
                    >
                      <div>
                        {/* Image section using exactly requested img tag and styles */}
                        <div className="w-full overflow-hidden relative rounded-t-2xl">
                          <img 
                            src={place.img} 
                            alt={`${place.name} Sri Lanka`} 
                            loading="lazy" 
                            style={{ objectFit: "cover", height: "220px", width: "100%", borderRadius: "16px" }}
                            className="group-hover:scale-105 transition-transform duration-550"
                          />
                          <div className="absolute top-3 right-3 bg-slate-950/65 backdrop-blur-md border border-slate-800 text-[#FFD700] rounded-xl px-2 py-0.5 text-[10px] font-mono flex items-center gap-1">
                            <Star className="w-3 h-3 fill-[#FFD700]" /> 4.9 Premium
                          </div>
                        </div>

                        {/* Title and details */}
                        <div className="p-4 space-y-2">
                          <h4 className="font-bold text-sm text-white group-hover:text-sky-400 transition-colors flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                            {place.name}
                          </h4>
                          <p className="text-xs text-slate-350 dark:text-slate-400 leading-relaxed font-sans">
                            {place.desc}
                          </p>
                        </div>
                      </div>

                      {/* Accent highlight bar */}
                      <div className="p-4 bg-slate-900/60 dark:bg-slate-950/60 border-t border-slate-800/30 flex items-center justify-between mt-auto">
                        <span className="text-[9px] text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/15 px-2 py-1 rounded-md uppercase font-bold tracking-wider">
                          ★ High Density Vibe
                        </span>
                        <div className="text-[10px] font-medium text-slate-400 flex items-center gap-1 font-mono">
                          Explore Route <Sparkles className="w-3 h-3 text-sky-400 animate-spin" style={{ animationDuration: "8s" }} />
                        </div>
                      </div>

                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-slate-900/50 border border-slate-850 p-12 text-center rounded-2xl flex flex-col items-center justify-center space-y-3"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-800/60 border border-slate-700/40 flex items-center justify-center text-xl text-slate-400">
                    🔍
                  </div>
                  <h4 className="text-sm font-bold text-slate-300">No Custom Items Found</h4>
                  <p className="text-xs text-slate-500 max-w-sm">
                    We could not find listing records for {activeCategory} in the {selectedProvince} Province right now. Check back soon for guides!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>

    </div>
  );
}
