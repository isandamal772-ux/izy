import React, { useState, useEffect } from "react";
import { 
  Compass, 
  Search, 
  MapPin, 
  Star, 
  Heart, 
  PhoneCall, 
  Info, 
  Mail,
  ExternalLink, 
  Share2, 
  BookOpen, 
  MessageSquare, 
  X, 
  Menu, 
  Sun, 
  Moon, 
  Plus, 
  Map, 
  Settings, 
  CheckCircle,
  Clock, 
  HelpCircle,
  ArrowRight,
  Globe,
  DollarSign
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PLACES_DATA, HOTELS_DATA, RESTAURANTS_DATA, BLOG_ARTICLES, TRAVEL_TIPS } from "./data/srilankaData";
import { DestinationCategory, Place, Hotel, Restaurant, UserProfile, UserReview } from "./types";
import { ShimmerImage } from "./components/ShimmerImage";
import { loginWithGoogle, logoutUser, isReady } from "./firebase";
import { getStaticReviewsFor, ALL_TOURIST_PHOTOS } from "./data/reviewsData";

// Import modular widgets
import TripPlanner from "./components/TripPlanner";
import AiAssistant from "./components/AiAssistant";
import CurrencyConverter from "./components/CurrencyConverter";
import WeatherWidget from "./components/WeatherWidget";
import CostCalculator from "./components/CostCalculator";
import InteractiveMap from "./components/InteractiveMap";

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<DestinationCategory | "ALL" | "HOTELS" | "RESTAURANTS">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"explore" | "planner" | "tips" | "blog" | "reviews" | "emergency" | "map">("explore");
  const [activeModalTab, setActiveModalTab] = useState<"overview" | "reach" | "tips">("overview");

  // Mobile Bottom-Sheet states
  const [isFeedbackSheetOpen, setIsFeedbackSheetOpen] = useState(false);
  const [isReviewSheetOpen, setIsReviewSheetOpen] = useState(false);
  
  // Suggestions states
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestDropdown, setShowSuggestDropdown] = useState(false);

  // Debounce Search Input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Handle suggested items listing based on debounced search
  useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const query = debouncedSearchQuery.toLowerCase();
    
    const matchedPlaces = PLACES_DATA.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.location.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    ).map(p => ({ ...p, type: "place" }));

    const matchedHotels = HOTELS_DATA.filter(h => 
      h.name.toLowerCase().includes(query) || 
      h.location.toLowerCase().includes(query)
    ).map(h => ({ ...h, type: "hotel" }));

    const matchedRestaurants = RESTAURANTS_DATA.filter(r => 
      r.name.toLowerCase().includes(query) || 
      r.location.toLowerCase().includes(query)
    ).map(r => ({ ...r, type: "restaurant" }));

    const allMatches = [...matchedPlaces, ...matchedHotels, ...matchedRestaurants].slice(0, 6);
    setSuggestions(allMatches);
  }, [debouncedSearchQuery]);

  // Detail Modal target states
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  // States for reviews tracking
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentRating, setNewCommentRating] = useState<number>(5);
  const [newCommentText, setNewCommentText] = useState("");
  const [simulatedPhoto, setSimulatedPhoto] = useState<string | null>(null);

  // Wishlist / Favorites tracker
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Language selection simulation
  const [language, setLanguage] = useState<"EN" | "DE" | "FR" | "RU">("EN");

  // Newsletter tracking states
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Contact Form tracking states
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSent, setContactSent] = useState(false);

  // Escape key global listener for modal closes
  useEffect(() => {
    const handleEscapeClose = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPlace(null);
        setSelectedHotel(null);
        setSelectedRestaurant(null);
        setIsFeedbackSheetOpen(false);
        setIsReviewSheetOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscapeClose);
    return () => window.removeEventListener("keydown", handleEscapeClose);
  }, []);

  // Load state and system initial parameters
  useEffect(() => {
    // Check dark mode preference
    const savedDark = localStorage.getItem("visit_srilanka_dark");
    if (savedDark !== null) {
      setDarkMode(savedDark === "true");
    }

    // Load active session profile
    try {
      const savedUser = localStorage.getItem("visit_srilanka_user");
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.warn("Error parsing user state:", e);
    }

    // Load wishlist favorites securely with try-catch and syntax fallback
    try {
      const savedFavs = localStorage.getItem("visit_srilanka_favs");
      if (savedFavs) {
        const parsed = JSON.parse(savedFavs);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        } else {
          setFavorites([]);
        }
      }
    } catch (e) {
      console.warn("Favorites deserialization issue, resetting to empty:", e);
      setFavorites([]);
    }

    // Load custom comments
    try {
      const savedComments = localStorage.getItem("visit_srilanka_comments");
      if (savedComments) {
        setUserReviews(JSON.parse(savedComments));
      }
    } catch (e) {
      console.warn("Comments parse concern:", e);
    }
  }, []);

  // Update Dark Mode document rules
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("visit_srilanka_dark", String(darkMode));
  }, [darkMode]);

  // Auth operations
  const handleSignIn = async () => {
    try {
      const user = await loginWithGoogle();
      setCurrentUser(user);
    } catch (e) {
      console.error("Auth helper issue: ", e);
    }
  };

  const handleSignOut = async () => {
    await logoutUser();
    setCurrentUser(null);
  };

  // Toggle Favorite
  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter(f => f !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("visit_srilanka_favs", JSON.stringify(updated));
  };

  // Handle Review Insertion with dynamic rating calc
  const handleAddReview = (entityId: string) => {
    if (!newCommentText.trim()) return;

    const newRev: UserReview = {
      id: `rev-${Date.now()}`,
      userId: currentUser?.uid || "anonymous-explorer",
      userName: newCommentName.trim() || currentUser?.displayName || "International Nomad",
      userPhoto: currentUser?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      entityId,
      rating: newCommentRating,
      comment: newCommentText.trim(),
      photoUrl: simulatedPhoto || undefined,
      createdAt: new Date().toISOString()
    };

    const updated = [newRev, ...userReviews];
    setUserReviews(updated);
    localStorage.setItem("visit_srilanka_comments", JSON.stringify(updated));

    // Clear state inputs
    setNewCommentName("");
    setNewCommentRating(5);
    setNewCommentText("");
    setSimulatedPhoto(null);
  };

  // Fetch reviews for specific entity
  const getReviewsForEntity = (id: string) => {
    return userReviews.filter(r => r.entityId === id);
  };

  // Calculate dynamic compound ratings incorporating user comments
  const getCompoundRating = (id: string, baseRating: number) => {
    const custom = getReviewsForEntity(id);
    if (custom.length === 0) return baseRating;
    const sum = custom.reduce((acc, curr) => acc + curr.rating, 0) + baseRating;
    return parseFloat((sum / (custom.length + 1)).toFixed(1));
  };

  // Client Filter logic matching destination, category, waterfalls tag list etc.
  const getFilteredItems = () => {
    let items: (Place | Hotel | Restaurant)[] = [];

    if (selectedCategory === "ALL") {
      items = [...PLACES_DATA, ...HOTELS_DATA, ...RESTAURANTS_DATA];
    } else if (selectedCategory === "HOTELS") {
      items = HOTELS_DATA;
    } else if (selectedCategory === "RESTAURANTS") {
      items = RESTAURANTS_DATA;
    } else {
      items = PLACES_DATA.filter(p => p.category === selectedCategory);
    }

    if (debouncedSearchQuery.trim() !== "") {
      const q = debouncedSearchQuery.toLowerCase();
      items = items.filter(item => {
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesLoc = item.location.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        // Look up categories, tags, or extra metadata references
        return matchesName || matchesLoc || matchesDesc;
      });
    }

    return items;
  };

  const filteredItems = getFilteredItems();

  // Social Sharing Link Simulation
  const handleShareSystem = (name: string) => {
    const url = `https://visitsrilankaguide.com/island/${encodeURIComponent(name)}`;
    navigator.clipboard.writeText(url);
    alert(`Tourism Link copied to clipboard for: ${name}! Share this boutique destination with friends.\n${url}`);
  };

  // Multi-lingual translation mapping dictionary
  const dictionary = {
    EN: {
      heroTitle: "Explore Paradise Island",
      heroSub: "Embark on an unforgettable journey across golden-red sand beaches, misty mountain rails, cascading waterfalls, and sacred world heritage reserves.",
      searchPlaceholder: "Search beaches, ancient waterfalls, safari parks, restaurants...",
      categories: "Browse Categories",
      exploreBtn: "Explore Places",
      plannerBtn: "Plan My Trip",
      all: "All Paradises",
      beaches: "Beaches",
      waterfalls: "Waterfalls",
      mountains: "Highlands",
      safari: "Safari Reserves",
      heritage: "Ancient Heritage",
      hotels: "Lux Hotels",
      dining: "Specialty Dining",
      emergency: "Emergencies & Contacts",
      newsletterTitle: "Join Our Wanderlust newsletter",
      newsletterSub: "Get weekly curated boutique Sri Lankan retreats and transport discount alerts."
    },
    DE: {
      heroTitle: "Entdecken Sie die Paradiesinsel Sri Lanka",
      heroSub: "Erkunden Sie goldene Strände, Bergzüge, Wasserfälle, Wildreservate und reiche Kultur.",
      searchPlaceholder: "Suchen Sie nach Stränden, Wasserfällen, Nationalparks...",
      categories: "Kategorien durchsuchen",
      exploreBtn: "Orte erkunden",
      plannerBtn: "Reise planen",
      all: "Alle Paradiese",
      beaches: "Strände",
      waterfalls: "Wasserfälle",
      mountains: "Hochland",
      safari: "Safari-Parks",
      heritage: "Kulturerbe",
      hotels: "Resorts & Hotels",
      dining: "Restaurants",
      emergency: "Notfallnummern",
      newsletterTitle: "Abonnieren Sie unseren Newsletter",
      newsletterSub: "Erhalten Sie wöchentlich kuratierte Ausflugstipps für das wunderschöne Sri Lanka."
    },
    FR: {
      heroTitle: "Découvrez l'Île Paradis du Sri Lanka",
      heroSub: "Explorez des plages dorées, des trains de montagne, des cascades sauvages et une faune riche.",
      searchPlaceholder: "Rechercher des plages, des cascades, des parcs nationaux...",
      categories: "Parcourir les catégories",
      exploreBtn: "Explorer les lieux",
      plannerBtn: "Planifier mon voyage",
      all: "Tout voir",
      beaches: "Plages",
      waterfalls: "Cascades",
      mountains: "Montagnes",
      safari: "Parcs safaris",
      heritage: "Monuments historiques",
      hotels: "Hôtels de luxe",
      dining: "Gastronomie",
      emergency: "Urgences voyage",
      newsletterTitle: "Inscrivez-vous à notre newsletter",
      newsletterSub: "Recevez chaque semaine des idées de retraite et des réductions de voyage locales."
    },
    RU: {
      heroTitle: "Откройте для себя Райский Остров Шри-Ланка",
      heroSub: "Исследуйте золотые пляжи, горные поезда, бурные водопады и древнее наследие.",
      searchPlaceholder: "Поиск пляжей, водопадов, заповедников, отелей...",
      categories: "Категории",
      exploreBtn: "Исследовать",
      plannerBtn: "Запланировать",
      all: "Все места",
      beaches: "Пляжи",
      waterfalls: "Водопады",
      mountains: "Горы",
      safari: "Сафари-парки",
      heritage: "Культурное наследие",
      hotels: "Отели класса люкс",
      dining: "Рестораны",
      emergency: "Телефоны экстренных служб",
      newsletterTitle: "Подписаться на рассылку",
      newsletterSub: "Получайте еженедельные советы о лучших отелях и достопримечательностях Шри-Ланки."
    }
  };

  const t = dictionary[language];

  return (
    <div className="min-h-screen w-full overflow-x-hidden text-slate-150 font-sans bg-transparent selection:bg-gold-500/20 selection:text-gold-200">
      
      {/* -------------------- UPPER HEADER / BANNER / NAV -------------------- */}
      <header className="sticky top-0 z-40 bg-ocean-900/65 backdrop-blur-md border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          {/* Logo & Slogan with custom Leaf icon */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab("explore")}>
            <div className="bg-white/5 border border-white/12 text-gold-500 p-2 rounded-xl shadow-lg">
              <svg xmlns="http://www.w3.org/2050/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#FFB703] animate-pulse">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-13.9.2" />
                <path d="M9 22v-4h4" />
              </svg>
            </div>
            <div>
              <span className="font-display font-extrabold text-white tracking-normal block text-base md:text-xl leading-none">
                VISIT <span className="text-[#FFB703]">SRI LANKA</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#FFB703] block uppercase font-bold mt-1">
                Luxury Travel Portal
              </span>
            </div>
          </div>

          {/* Desktop Navigation Link Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold font-sans">
            <button 
              id="nav-btn-explore" 
              onClick={() => setActiveTab("explore")}
              className={`px-3 focus:outline-none py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === "explore" ? "bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-350 hover:text-slate-900"}`}
            >
              Explore Paradises
            </button>
            <button 
              id="nav-btn-map" 
              onClick={() => setActiveTab("map")}
              className={`px-3 focus:outline-none py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === "map" ? "bg-slate-100 dark:bg-slate-800 text-[#0077be] dark:text-[#ffea6c]" : "text-slate-600 dark:text-slate-200 hover:text-slate-900"}`}
            >
              🗺️ Interactive Map
            </button>
            <button 
              id="nav-btn-planner" 
              onClick={() => setActiveTab("planner")}
              className={`px-3 focus:outline-none py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === "planner" ? "bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-350 hover:text-slate-900"}`}
            >
              🎯 Trip Itinerary Planner
            </button>
            <button 
              id="nav-btn-tips" 
              onClick={() => setActiveTab("tips")}
              className={`px-3 focus:outline-none py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === "tips" ? "bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-350 hover:text-slate-900"}`}
            >
              🌴 Island Tips
            </button>
            <button 
              id="nav-btn-blog" 
              onClick={() => setActiveTab("blog")}
              className={`px-3 focus:outline-none py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === "blog" ? "bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-350 hover:text-slate-900"}`}
            >
              📖 Travel Journal
            </button>
            <button 
              id="nav-btn-reviews" 
              onClick={() => setActiveTab("reviews")}
              className={`px-3 focus:outline-none py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === "reviews" ? "bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-350 hover:text-slate-900"}`}
            >
              📸 Reviews & Gallery
            </button>
            <button 
              id="nav-btn-emergency" 
              onClick={() => setActiveTab("emergency")}
              className={`px-3 focus:outline-none py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === "emergency" ? "bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-350 hover:text-slate-900"}`}
            >
              ☎️ Directory
            </button>
          </nav>

          {/* Quick Actions (Theme, Language, User Login Profile) */}
          <div className="flex items-center gap-2.5">
            {/* Language Selector */}
            <select
              id="nav-lang-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-[10px] uppercase font-bold border border-slate-200 dark:border-slate-700 rounded-lg px-1.5 py-1 outline-none cursor-pointer focus:border-emerald-500"
            >
              <option value="EN">EN 🇺🇸</option>
              <option value="DE">DE 🇩🇪</option>
              <option value="FR">FR 🇫🇷</option>
              <option value="RU">RU 🇷🇺</option>
            </select>

            {/* Theme Toggle */}
            <button
              id="btn-nav-theme"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              title="Toggle Contrast Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Login Wrapper */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <ShimmerImage
                  src={currentUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                  alt={currentUser.displayName || "User"}
                  className="w-7.25 h-7.25 rounded-full border border-emerald-500 shadow-sm"
                  height="29px"
                />
                <button
                  id="btn-nav-logout"
                  onClick={handleSignOut}
                  className="hidden md:block text-[10px] font-bold text-red-600 hover:text-red-500 font-mono tracking-wider cursor-pointer"
                >
                  SIGN OUT
                </button>
              </div>
            ) : (
              <button
                id="btn-nav-login"
                onClick={handleSignIn}
                className="bg-gradient-to-r from-emerald-600 to-sky-600 hover:brightness-105 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm font-sans tracking-wide cursor-pointer"
              >
                LOGIN
              </button>
            )}
          </div>

        </div>
      </header>

      {/* -------------------- FULLSCREEN PARALLAX HERO SECTION -------------------- */}
      {activeTab === "explore" && searchQuery === "" && (
        <section id="hero-interactive" className="relative w-full h-[520px] md:h-[650px] overflow-hidden flex items-center justify-center p-4">
          {/* Ambient Video Backdrop of Beautiful Sri Lankan Paradise */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-102"
            style={{ filter: "brightness(0.35)" }}
            poster="https://images.unsplash.com/photo-1588598126707-167bb336599b?auto=format&fit=crop&w=1920&q=80"
          >
            <source src="https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0542d87e14e0c2f3959da60611990ec&profile_id=139&oauth2_token_id=57447761" type="video/mp4" />
            <source src="https://assets.mixkit.co/videos/preview/mixkit-island-with-palm-trees-in-the-ocean-43184-large.mp4" type="video/mp4" />
          </video>

          {/* Glassmorphism premium dark overlay shield */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/45 to-slate-950/90" />

          {/* Sparkly interactive light dots decor */}
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />

          {/* Hero text items */}
          <div className="relative text-center max-w-4xl mx-auto space-y-6 flex flex-col items-center z-10 w-full">
            <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[10.5px] font-bold px-3 py-1.5 rounded-full border border-emerald-500/30 uppercase tracking-widest leading-none flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-yellow-300 animate-spin" style={{ animationDuration: "12s" }} /> visit-srilankaguide.com
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6.5xl font-display font-medium text-white tracking-tight leading-[1.1] drop-shadow-lg">
              {t.heroTitle}
            </h1>
            <p className="text-sm md:text-base text-slate-200/90 font-sans max-w-2xl leading-relaxed">
              {t.heroSub}
            </p>

            {/* CTA action buttons */}
            <div className="flex flex-wrap gap-2 justify-center pt-2">
              <button 
                id="btn-cta-explore" 
                onClick={() => {
                  setSelectedCategory("ALL");
                  document.getElementById("interactive-places-anchor")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-[#D4AF37] hover:bg-[#C5A028] text-slate-950 font-bold px-5 py-3 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                {t.exploreBtn}
              </button>
              <button 
                id="btn-cta-planner" 
                onClick={() => setActiveTab("planner")}
                className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-5 py-3 rounded-xl border border-white/20 transition-all font-semibold cursor-pointer"
              >
                {t.plannerBtn}
              </button>
            </div>

            {/* Instant Multi-attribute Search Bar component with Suggestions */}
            <div className="w-full max-w-2xl pt-4 relative">
              {/* Overlay cover to close suggestions dropdown when clicking outside */}
              {showSuggestDropdown && suggestions.length > 0 && (
                <div className="fixed inset-0 z-30" onClick={() => setShowSuggestDropdown(false)} />
              )}
              
              <div className="bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl p-2 shadow-2xl flex items-center relative z-40">
                <Search className="w-5 h-5 text-emerald-300 ml-2 flex-shrink-0" />
                <input
                  id="hero-chat-input"
                  type="text"
                  value={searchQuery}
                  onFocus={() => setShowSuggestDropdown(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestDropdown(true);
                  }}
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-transparent border-0 outline-none text-white placeholder-slate-350 px-3 text-xs md:text-sm font-sans"
                />
                {searchQuery !== "" && (
                  <button 
                    id="btn-clear-search" 
                    onClick={() => {
                      setSearchQuery("");
                      setSuggestions([]);
                    }}
                    className="p-1 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs mr-1 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
                <button 
                  id="btn-search-trigger"
                  onClick={() => document.getElementById("interactive-places-anchor")?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold font-sans px-4 py-2.5 rounded-xl ml-2 text-xs cursor-pointer flex-shrink-0"
                >
                  Locate
                </button>
              </div>

              {/* Suggestions Popup panel */}
              {showSuggestDropdown && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-2xl z-50 text-left divide-y divide-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
                  {suggestions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSearchQuery(item.name);
                        setShowSuggestDropdown(false);
                        if (item.type === "place") {
                          setSelectedPlace(item);
                        } else if (item.type === "hotel") {
                          setSelectedHotel(item);
                        } else if (item.type === "restaurant") {
                          setSelectedRestaurant(item);
                        }
                        document.getElementById("interactive-places-anchor")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="px-4 py-3 hover:bg-emerald-950/40 cursor-pointer flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-450">
                          {item.type === "place" ? (
                            <MapPin className="w-3.5 h-3.5" />
                          ) : item.type === "hotel" ? (
                            <Star className="w-3.5 h-3.5 text-amber-400" />
                          ) : (
                            <Compass className="w-3.5 h-3.5 text-sky-400" />
                          )}
                        </div>
                        <div>
                          <span className="text-xs md:text-sm font-sans font-medium text-white group-hover:text-emerald-300 transition-colors">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {item.location} • {item.type.toUpperCase() === "PLACE" ? item.category.toUpperCase() : item.type.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  ))}
                </div>
              )}

              <p className="text-[10px] text-slate-400 mt-2 font-mono text-center">
                Try searching <span className="underline cursor-pointer" onClick={() => { setSearchQuery("Ella"); setShowSuggestDropdown(true); }}>"Ella"</span>, <span className="underline cursor-pointer" onClick={() => { setSearchQuery("Beach"); setShowSuggestDropdown(true); }}>"Beach"</span>, <span className="underline cursor-pointer" onClick={() => { setSearchQuery("Sigiriya"); setShowSuggestDropdown(true); }}>"Sigiriya"</span> or <span className="underline cursor-pointer" onClick={() => { setSearchQuery("Café Chill"); setShowSuggestDropdown(true); }}>"Café Chill"</span>
              </p>
            </div>

          </div>
        </section>
      )}

      {/* -------------------- MAIN APP CORE LAYOUT CONTAINER -------------------- */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">

        {/* -------------------- TAB 1: DESTINATION LANDSCAPES PORTAL -------------------- */}
        {activeTab === "explore" && (
          <div className="space-y-10">

            {/* Category selection row */}
            <div id="interactive-places-anchor" className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold font-sans tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Compass className="w-5 h-5 text-emerald-600" /> Catalog Selection
                  </h3>
                  <p className="text-xs text-slate-400">Instantly toggle specialized micro-databases</p>
                </div>
                {/* Wishlist quick-link indicator */}
                {favorites.length > 0 && (
                  <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 text-rose-500 dark:text-rose-400 px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-2 shadow-sm">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    <span>Wishlisted Destinations: <strong>{favorites.length}</strong></span>
                  </div>
                )}
              </div>

              {/* Grid buttons representing main categories requested */}
              <div className="flex flex-wrap gap-2">
                <button
                  id="cat-all"
                  onClick={() => setSelectedCategory("ALL")}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold font-sans uppercase tracking-wide transition-all cursor-pointer ${
                    selectedCategory === "ALL"
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 hover:bg-slate-50"
                  }`}
                >
                  ✨ {t.all} ({PLACES_DATA.length + HOTELS_DATA.length + RESTAURANTS_DATA.length})
                </button>
                <button
                  id="cat-beaches"
                  onClick={() => setSelectedCategory(DestinationCategory.BEACHES)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold font-sans uppercase tracking-wide transition-all cursor-pointer ${
                    selectedCategory === DestinationCategory.BEACHES
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 hover:bg-slate-50"
                  }`}
                >
                  🏄‍♂️ {t.beaches}
                </button>
                <button
                  id="cat-waterfalls"
                  onClick={() => setSelectedCategory(DestinationCategory.WATERFALLS)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold font-sans uppercase tracking-wide transition-all cursor-pointer ${
                    selectedCategory === DestinationCategory.WATERFALLS
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 hover:bg-slate-50"
                  }`}
                >
                  💦 {t.waterfalls}
                </button>
                <button
                  id="cat-mountains"
                  onClick={() => setSelectedCategory(DestinationCategory.MOUNTAINS_HILL_COUNTRY)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold font-sans uppercase tracking-wide transition-all cursor-pointer ${
                    selectedCategory === DestinationCategory.MOUNTAINS_HILL_COUNTRY
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 hover:bg-slate-50"
                  }`}
                >
                  ⛰️ {t.mountains}
                </button>
                <button
                  id="cat-safari"
                  onClick={() => setSelectedCategory(DestinationCategory.SAFARI_PARKS)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold font-sans uppercase tracking-wide transition-all cursor-pointer ${
                    selectedCategory === DestinationCategory.SAFARI_PARKS
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 hover:bg-slate-50"
                  }`}
                >
                  🐆 {t.safari}
                </button>
                <button
                  id="cat-heritage"
                  onClick={() => setSelectedCategory(DestinationCategory.HERITAGE_SITES)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold font-sans uppercase tracking-wide transition-all cursor-pointer ${
                    selectedCategory === DestinationCategory.HERITAGE_SITES
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 hover:bg-slate-50"
                  }`}
                >
                  🏛️ {t.heritage}
                </button>
                <button
                  id="cat-hotels"
                  onClick={() => setSelectedCategory("HOTELS")}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold font-sans uppercase tracking-wide transition-all cursor-pointer ${
                    selectedCategory === "HOTELS"
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 hover:bg-slate-50"
                  }`}
                >
                  🏨 {t.hotels}
                </button>
                <button
                  id="cat-restaurants"
                  onClick={() => setSelectedCategory("RESTAURANTS")}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold font-sans uppercase tracking-wide transition-all cursor-pointer ${
                    selectedCategory === "RESTAURANTS"
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 hover:bg-slate-50"
                  }`}
                >
                  🍛 {t.dining}
                </button>
              </div>
            </div>

            {/* Grid Display of filtered items (Beaches, Waterfalls, etc.) */}
            <div>
              {searchQuery !== "" && (
                <p className="text-xs text-slate-400 mb-4 font-mono">
                  Showing <strong>{filteredItems.length}</strong> matching criteria for query: <em>"{searchQuery}"</em>
                </p>
              )}

              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => {
                    const isFavorite = favorites.includes(item.id);
                    // Determine if it is Place, Hotel or Restaurant
                    const isPlace = "category" in item;
                    const isHotel = "amenities" in item;
                    const isRestaurant = "cuisine" in item;

                    const rating = getCompoundRating(item.id, item.rating);
                    
                    const getProvinceFromLocation = (loc: string, nameName: string): string => {
                      const l = (loc + " " + nameName).toLowerCase();
                      if (l.includes("central") || l.includes("nuwara eliya") || l.includes("kandy") || l.includes("matale") || l.includes("pussellawa") || l.includes("ramboda") || l.includes("kothmale") || l.includes("hatton") || l.includes("sigiriya") || l.includes("dambulla") || l.includes("knuckles")) return "Central";
                      if (l.includes("southern") || l.includes("galle") || l.includes("matara") || l.includes("hambantota") || l.includes("mirissa") || l.includes("unawatuna") || l.includes("hikkaduwa") || l.includes("weligama") || l.includes("koggala") || l.includes("yala") || l.includes("bentota") || l.includes("ahungalla") || l.includes("tangalle")) return "Southern";
                      if (l.includes("western") || l.includes("colombo") || l.includes("negombo") || l.includes("kalutara")) return "Western";
                      if (l.includes("uva") || l.includes("ella") || l.includes("badulla") || l.includes("monaragala") || l.includes("diyaluma") || l.includes("bambarakanda")) return "Uva";
                      if (l.includes("sabaragamuwa") || l.includes("ratnapura") || l.includes("kegalle") || l.includes("udawalawe") || l.includes("adam's peak") || l.includes("sri pada")) return "Sabaragamuwa";
                      if (l.includes("eastern") || l.includes("trincomalee") || l.includes("arugam") || l.includes("ampara") || l.includes("batticaloa") || l.includes("pasikudah") || l.includes("nilaveli")) return "Eastern";
                      if (l.includes("northern") || l.includes("jaffna") || l.includes("kilinochchi") || l.includes("mannar")) return "Northern";
                      if (l.includes("north central") || l.includes("anuradhapura") || l.includes("polonnaruwa") || l.includes("minneriya")) return "North Central";
                      if (l.includes("north western") || l.includes("kalpitiya") || l.includes("puttalam") || l.includes("kurunegala") || l.includes("wilpattu")) return "North Western";
                      return "Central"; // default fallback
                    };
                    const province = getProvinceFromLocation(item.location, item.name);
                    
                    // Specific color schema for each province tag to boost sensory design quality
                    const getProvinceStyles = (prov: string) => {
                      const p = prov?.trim()?.toLowerCase() || "";
                      if (p.includes("central")) return "bg-pink-500/15 text-pink-300 border border-pink-500/30";
                      if (p.includes("southern")) return "bg-amber-500/15 text-amber-300 border border-amber-500/30";
                      if (p.includes("western")) return "bg-blue-500/15 text-blue-300 border border-blue-500/30";
                      if (p.includes("uva")) return "bg-emerald-500/15 text-emerald-450 border border-emerald-500/30";
                      if (p.includes("sabaragamuwa")) return "bg-purple-500/15 text-purple-300 border border-purple-500/30";
                      if (p.includes("eastern")) return "bg-sky-500/15 text-sky-300 border border-sky-500/30";
                      if (p.includes("northern")) return "bg-teal-500/15 text-teal-300 border border-teal-500/30";
                      if (p.includes("north central")) return "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30";
                      if (p.includes("north western")) return "bg-rose-500/15 text-rose-350 border border-rose-500/30";
                      return "bg-slate-500/15 text-slate-300 border border-slate-500/30";
                    };
                    const provBadge = getProvinceStyles(province);
                    const photoCredit = (item as any).imageLicense || (item as any).attribution || "Wikimedia CC BY-SA 4.0";

                    return (
                      <motion.div
                        key={item.id}
                        id={`dest-card-${item.id}`}
                        onClick={() => {
                          if (isPlace) setSelectedPlace(item as any);
                          else if (isHotel) setSelectedHotel(item as any);
                          else if (isRestaurant) setSelectedRestaurant(item as any);
                        }}
                        className="bg-slate-950/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-gold-500/10 hover:border-gold-500/40 hover:-translate-y-2 transition-all duration-300 flex flex-col cursor-pointer h-[460px] group"
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                      >
                        {/* 16:9 Real Photo Card Display - High quality image zoom layout */}
                        <div className="relative h-[220px] w-full overflow-hidden aspect-[16/9]">
                          <ShimmerImage
                            src={item.imageUrl || (item as any).imageUrls?.[0]}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                            height="220px"
                          />
                          {/* Favorite button spacer */}
                          <button
                            id={`btn-fav-card-${item.id}`}
                            onClick={(e) => toggleFavorite(item.id, e)}
                            className="absolute top-3 right-3 p-2 rounded-full backdrop-blur-md bg-slate-900/40 hover:bg-slate-900/80 border border-white/20 transition-all cursor-pointer z-20"
                          >
                            <Heart className={`w-4 h-4 ${isFavorite ? "fill-rose-500 text-rose-500" : "text-white"}`} />
                          </button>
                          
                          {/* Upper category identifier badge */}
                          <div className="absolute bottom-3 left-3 bg-[#0A1F44]/80 text-white backdrop-blur-md text-[9px] font-bold font-sans uppercase px-2.5 py-1 rounded-md tracking-wider border border-white/10">
                            {isPlace ? (item as Place).category : isHotel ? "Luxury Hotel" : "Specialty Restaurant"}
                          </div>
                        </div>

                        {/* Card Body - Luxury Styling */}
                        <div className="p-4.5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[10px] text-slate-350 font-bold uppercase tracking-wider font-sans flex items-center gap-1 line-clamp-1 truncate max-w-[70%]">
                                <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" /> {item.location}
                              </span>
                              <div className="flex items-center gap-1 font-mono text-[11px] text-[#FFB703]">
                                <Star className="w-3.5 h-3.5 fill-[#FFB703] text-[#FFB703]" />
                                <strong>{rating.toFixed(1)}</strong>
                              </div>
                            </div>

                            <h4 className="text-[17px] font-bold font-display tracking-tight text-white mt-2 line-clamp-1 group-hover:text-[#FFB703] transition-colors duration-200">
                              {item.name}
                            </h4>
                            {/* Province Pill tag overlay */}
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              <span className={`text-[9px] font-mono uppercase tracking-wide px-2.5 py-0.5 rounded-full ${provBadge}`}>
                                {province}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 font-sans font-normal mt-2 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          {/* Dynamic licensing attribution citation & CTA link */}
                          <div className="pt-3 border-t border-white/10 flex flex-col gap-1.5 mt-auto">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                              <span className="truncate max-w-[70%] text-slate-450 block italic">
                                📸 {photoCredit}
                              </span>
                              <span className="text-[#FFB703] font-sans font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                                Detail Guide <ArrowRight className="w-2.5 h-2.5" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-250 dark:border-slate-800 justify-center h-64 flex flex-col items-center text-center p-8 rounded-2xl">
                  <Compass className="w-10 h-10 text-slate-400 animate-pulse" />
                  <p className="text-slate-800 dark:text-slate-200 font-sans font-bold mt-2">No boutique spaces matched your parameters.</p>
                  <p className="text-slate-400 text-xs mt-1">Clear the active query or toggle categories to browse waterfalls, beaches, and safari spots.</p>
                  <button 
                    id="btn-null-search-clear"
                    onClick={() => { setSearchQuery(""); setSelectedCategory("ALL"); }}
                    className="bg-emerald-600 text-white font-semibold font-sans text-xs px-4 py-2.5 rounded-xl mt-4"
                  >
                    Reset Filter
                  </button>
                </div>
              )}
            </div>

            {/* -------------------- INTEGRATED ASSORTED HELPER PANEL (BENTO RETREAT) -------------------- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-slate-200 dark:border-slate-800">
              {/* Column 1: Live exchange & Trip microclimates */}
              <div className="lg:col-span-4 space-y-6">
                <CurrencyConverter />
                <WeatherWidget />
              </div>
              
              {/* Column 2: Holiday cost calculator */}
              <div className="lg:col-span-4 max-w-full">
                <CostCalculator />
              </div>

              {/* Column 3: Emergency assistance & WhatsApp direct links */}
              <div className="lg:col-span-4 bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="bg-red-500/20 text-red-300 font-mono text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-red-500/35">
                    Essential Travel Contacts
                  </span>
                  <h4 className="text-lg font-sans font-bold mt-3 text-white">Emergency Assistance Directory</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-normal">
                    Save these vital safety coordinates to your mobile ledger before traversing regional roads or hiking high-altitude peaks.
                  </p>

                  <div className="mt-5 space-y-3.5 text-xs">
                    <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl">
                      <span className="text-slate-350">Tourist Police Hotline:</span>
                      <a href="tel:1912" className="font-mono text-emerald-400 font-bold hover:underline flex items-center gap-1">
                        <PhoneCall className="w-3 h-3" /> 1912
                      </a>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl">
                      <span className="text-slate-350">National Emergency Services:</span>
                      <a href="tel:119" className="font-mono text-emerald-400 font-bold hover:underline flex items-center gap-1">
                        <PhoneCall className="w-3 h-3" /> 119
                      </a>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl">
                      <span className="text-slate-350">Ambulance Emergency:</span>
                      <a href="tel:1990" className="font-mono text-emerald-400 font-bold hover:underline flex items-center gap-1">
                        <PhoneCall className="w-3 h-3" /> 1990 Suwa Seriya
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
                  {/* WhatsApp hotline simulation */}
                  <div className="bg-emerald-900/40 border border-emerald-500/30 p-4 rounded-xl">
                    <h5 className="font-sans font-bold text-xs text-emerald-300">WhatsApp On-Call Concierge</h5>
                    <p className="text-[10px] text-slate-300 leading-normal mt-1">Need help mapping a local rail connection? Speak to our tourism officers on the phone immediately.</p>
                    <a
                      id="link-whatsapp-sim"
                      href="https://wa.me/94770000000?text=Hello%20Visit%20Sri%20Lanka%21%20I%20need%20assistance%20planning%20my%20itinerary."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 inline-flex items-center gap-1.5 bg-[#25D366] hover:brightness-105 px-3 py-1.5 rounded-lg text-slate-900 font-sans text-[11px] font-bold"
                    >
                      <span>Join WhatsApp Chat</span> <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* -------------------- TAB 2: TRIP PLANNER ENGINE -------------------- */}
        {activeTab === "planner" && (
          <TripPlanner />
        )}

        {/* -------------------- TAB 3: ISLAND TIPS & TRAVEL SECRETS -------------------- */}
        {activeTab === "tips" && (
          <div className="space-y-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-sans font-bold text-slate-900 dark:text-white">Sri Lanka Crucial Travel Advice</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">
                Read our resident guidelines regarding visa paperwork, airport customs protocols, train seat bookings, local packing essentials, clothing guidelines, and temple etiquette.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {TRAVEL_TIPS.map((tip, idx) => (
                <div key={idx} id={`tip-card-${idx}`} className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-3 mb-2.5">
                    <span className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl font-bold font-sans text-xs">
                      0{idx + 1}
                    </span>
                    <h4 className="font-sans font-bold text-sm text-slate-800 dark:text-slate-200">
                      {tip.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-11">
                    {tip.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Airport & Transit guide block */}
            <div className="bg-amber-50/50 dark:bg-amber-950/10 rounded-3xl p-6 border border-amber-200/40 dark:border-amber-950/20 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8">
                <h4 className="text-base font-sans font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  ✈️ Airport & Transit Advice (Bandaranaike BIA)
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-350 mt-1.5 leading-relaxed">
                  Most international flights touch down at <strong>Bandaranaike International Airport (CMB / BIA)</strong> in Katunayake (30km north of Colombo). Upon arrival, we suggest buying a local Dialog or Mobitel eSIM directly from the arrivals terminal for instant 4G coverage. Download the local taxi app <strong>PickMe</strong> (Sri Lanka's Uber alternative) for honest prices on transit into Colombo or Galle. You can easily pre-book airport taxis using the link below.
                </p>
              </div>
              <div className="lg:col-span-4 flex justify-end">
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Bandaranaike+International+Airport+Katunayake"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900 text-white font-sans text-xs font-bold px-4 py-3 rounded-xl hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer shadow-sm w-full lg:w-auto text-center justify-center"
                >
                  Airport Directions on Maps <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- TAB 4: BLOG / TRAVEL JOURNAL -------------------- */}
        {activeTab === "blog" && (
          <div className="space-y-8">
            <div className="max-w-2xl">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono tracking-widest uppercase text-xs">Resident Chronicles</span>
              <h2 className="text-3xl font-sans font-bold text-slate-900 dark:text-white mt-1">Sri Lanka Travel Journal</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">
                SEO optimized guides composed by regional travel bloggers regarding hiking off-the-beaten trails, spotting leopards, and photographing historic heritage architecture.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BLOG_ARTICLES.map((art) => (
                <article key={art.id} id={`blog-card-${art.id}`} className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                  <div>
                    <ShimmerImage
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-44 object-cover animate-pulse-none"
                      height="176px"
                    />
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-[10px] text-slate-450 uppercase font-mono mb-2">
                        <span>{art.date}</span>
                        <span>•</span>
                        <span>{art.author}</span>
                      </div>
                      <h4 className="text-sm font-bold font-sans tracking-tight text-slate-800 dark:text-slate-200 hover:text-emerald-500 cursor-pointer">
                        {art.title}
                      </h4>
                      <p className="text-xs text-slate-550 dark:text-slate-400 mt-2 leading-relaxed line-clamp-4">
                        {art.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-right">
                    <button 
                      id={`btn-blog-read-${art.id}`}
                      onClick={() => alert(`Full travel article "${art.title}" is in static print mode.\nAuthor: ${art.author}\nDate published: ${art.date}`)}
                      className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold font-sans hover:underline flex items-center gap-0.5 justify-end"
                    >
                      Read full chronicle <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* -------------------- TAB 5: EMERGENCY CONTACTS & DIRECTORY -------------------- */}
        {activeTab === "emergency" && (
          <div className="space-y-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-sans font-bold text-slate-900 dark:text-white">Emergency Services & General Assistance</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">
                Sri Lanka offers robust networks of tourist safety offices, public hospitals, and transit administrators to support international guests. Keep these coordinates saved on your dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Directory table */}
              <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 md:p-8 rounded-3xl shadow-sm space-y-6">
                <div>
                  <h3 className="font-sans font-bold text-base text-slate-800 dark:text-slate-200 mb-4">Official Tourism Administration</h3>
                  <div className="space-y-4 text-xs font-sans">
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-850">
                      <div>
                        <span className="font-bold block">Sri Lanka Tourism Development Authority (SLTDA)</span>
                        <span className="text-slate-400 text-[10px]">Headquarters: Colombo 03, Sri Lanka</span>
                      </div>
                      <a href="tel:+94112426900" className="text-emerald-600 font-mono font-bold hover:underline">+94 11 242 6900</a>
                    </div>

                    <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-850">
                      <div>
                        <span className="font-bold block">Tourist Police Division</span>
                        <span className="text-slate-400 text-[10px]">Dedicated security assistance for travelers</span>
                      </div>
                      <a href="tel:0112421052" className="text-emerald-600 font-mono font-bold hover:underline">011-2421052</a>
                    </div>

                    <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-850">
                      <div>
                        <span className="font-bold block">Sri Lanka Railways Helpline</span>
                        <span className="text-slate-400 text-[10px]">Seat reservation inquiry & dispatch logs</span>
                      </div>
                      <a href="tel:1919" className="text-emerald-600 font-mono font-bold hover:underline">1919</a>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-sans font-bold text-base text-slate-800 dark:text-slate-200 mb-4">Visa Guidance & Embassy Services</h3>
                  <p className="text-xs text-slate-450 leading-relaxed mb-4">
                    Tourists must apply for an Electronic Travel Authorization (ETA / eVisa) prior to arriving. Your standard eVisa covers 30 days of entry and can be easily extended at the Department of Immigration & Emigration in Battaramulla, Colombo.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="https://www.eta.gov.lk/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 text-white font-sans text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-500 inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      Official eVisa ETA Portal <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Mobile Button to slide up Inquiry Sheet */}
              <div className="lg:hidden pt-4">
                <button
                  onClick={() => setIsFeedbackSheetOpen(true)}
                  className="w-full bg-[#FFB703] text-slate-950 font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 hover:brightness-105 transition-all text-xs cursor-pointer"
                >
                  <Mail className="w-4 h-4" /> Open Inquiry Form Bottom Sheet
                </button>
              </div>

              {/* Sidebar / Mobile Bottom Sheet for Inquiry Form */}
              <div className={`${isFeedbackSheetOpen ? "fixed inset-0 z-50 flex items-end justify-center bg-slate-950/75 backdrop-blur-sm p-0 m-0" : "hidden lg:block lg:col-span-4"}`}>
                <div 
                  className={`${
                    isFeedbackSheetOpen 
                      ? "bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-6 rounded-t-3xl shadow-2xl w-full max-h-[85vh] overflow-y-auto animate-fadeIn" 
                      : "bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-3xl shadow-sm"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {isFeedbackSheetOpen && (
                    <div className="flex justify-between items-center pb-3 mb-4 border-b border-slate-100 dark:border-slate-800 animate-fadeIn">
                      <span className="font-sans font-bold text-xs uppercase tracking-widest text-slate-400">Emergency Inquiry</span>
                      <button onClick={() => setIsFeedbackSheetOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer">
                        <X className="w-5 h-5 font-bold" />
                      </button>
                    </div>
                  )}

                  <h4 className="font-sans font-bold text-sm text-slate-800 dark:text-slate-100">Send Inquiry to Tourist Board</h4>
                  <p className="text-slate-400 text-[10px] mt-1 mb-4 leading-normal">
                    Ask our tourist support specialists a query regarding hotel licensing, safari driver coordinates, or hiking permits.
                  </p>

                  {contactSent ? (
                    <div className="text-center p-6 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 rounded-2xl">
                      <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">Message Transmitted</span>
                      <p className="text-[10px] text-slate-500 mt-1 leading-normal">We will respond to your international inbox within 12 standard business hours.</p>
                      <button id="btn-reset-contact" onClick={() => { setContactSent(false); setContactName(""); setContactEmail(""); setContactMessage(""); }} className="mt-3 text-[10px] text-emerald-600 underline font-semibold cursor-pointer">
                        Create new ticket
                      </button>
                    </div>
                  ) : (
                    <form
                      id="tourist-inquiry-form"
                      onSubmit={(e) => { e.preventDefault(); setContactSent(true); }}
                      className="space-y-3 font-sans text-xs"
                    >
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Your Full Name</label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl text-slate-800 dark:text-slate-100 focus:border-emerald-500 outline-none"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider mb-1">International E-Mail</label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl text-slate-800 dark:text-slate-100 focus:border-emerald-500 outline-none"
                          placeholder="explorer@email.com"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Inquiry details</label>
                        <textarea
                          id="contact-msg"
                          rows={4}
                          required
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl text-slate-800 dark:text-slate-100 focus:border-emerald-500 outline-none"
                          placeholder="How can our guides help you?"
                        />
                      </div>
                      <button
                        id="btn-inquiry-submit"
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold py-2.5 rounded-xl cursor-pointer"
                      >
                        Submit Ticket
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- TAB 6: ISLAND REVIEWS & GALLERY -------------------- */}
        {activeTab === "reviews" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="max-w-3xl space-y-2">
              <span className="text-[#d97706] dark:text-amber-400 font-semibold font-mono tracking-widest uppercase text-[10.5px]">
                Shared Nomad Experiences
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-medium text-slate-900 dark:text-white">
                Explorer Reviews, Travel Logs & Photos Gallery
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Browse direct reviews from international and domestic nomads, inspect high-resolution drone and coastal photography, or submit your own memories of the paradise island.
              </p>
            </div>

            {/* Photo Showcase Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-3xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-sans font-bold text-slate-800 dark:text-slate-200">
                    📸 Community Photo Showcase
                  </h3>
                  <p className="text-xs text-slate-400">Captured and submitted by verified guests across waterfalls, peaks, and surf towns</p>
                </div>
                <button
                  id="btn-reviews-gallery-top"
                  onClick={() => {
                    alert("To upload a custom camera capture, click 'Explore Paradises' at the top, open any destination, hotel, or diner modal card, and submit your review with an image attached!");
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold font-sans text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-sm self-start sm:self-auto"
                >
                  + Add Your Capture
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {ALL_TOURIST_PHOTOS.map((photo) => (
                  <div key={photo.id} className="group relative rounded-2xl overflow-hidden aspect-square border border-slate-200/40 dark:border-slate-800 bg-slate-50">
                    <ShimmerImage
                      src={photo.url}
                      alt={photo.placeName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      height="100%"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-amber-300 block">{photo.placeName}</span>
                      <p className="text-[11px] leading-tight text-slate-200 line-clamp-2 mt-0.5">{photo.caption}</p>
                      <span className="text-[9px] text-slate-400 mt-1 block font-mono">By {photo.uploadedBy}</span>
                    </div>
                    {/* Landmark quick look */}
                    <div className="absolute top-2.5 right-2.5 bg-slate-950/60 backdrop-blur-md p-1.5 rounded-full text-white hover:bg-emerald-600 transition-colors cursor-pointer"
                         onClick={() => {
                           const matched = PLACES_DATA.find(p => p.name.toLowerCase().includes(photo.placeName.toLowerCase()) || photo.placeName.toLowerCase().includes(p.name.toLowerCase()));
                           if (matched) {
                             setSelectedPlace(matched);
                           } else {
                             alert(`Viewing high-quality photography of ${photo.placeName}.\nOpen 'Explore Paradises' to see all detailed reviews.`);
                           }
                         }}
                         title={`Read ${photo.placeName} details`}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews list grid and custom submit */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Feed of all reviews */}
              <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 md:p-8 rounded-3xl space-y-6">
                <div>
                  <h3 className="text-base font-sans font-bold text-slate-800 dark:text-slate-200">
                    💬 Global Nomad Stream
                  </h3>
                  <p className="text-xs text-slate-400">Aggregated feedback, hotel details, and safety logs from visitors</p>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {[
                    ...userReviews,
                    ...PLACES_DATA.slice(0, 8).flatMap(p => getStaticReviewsFor(p.id, p.name, p.category)),
                    ...RESTAURANTS_DATA.slice(0, 2).flatMap(r => getStaticReviewsFor(r.id, r.name, "restaurants")),
                    ...HOTELS_DATA.slice(0, 1).flatMap(h => getStaticReviewsFor(h.id, h.name, "hotels"))
                  ].map((rev, index) => {
                    const allItems = [...PLACES_DATA, ...HOTELS_DATA, ...RESTAURANTS_DATA];
                    const item = allItems.find(i => i.id === rev.entityId);
                    const entityName = item ? item.name : "Exclusive Sanctuary";
                    const entityCategory = item ? ("category" in item ? (item as any).category : "Luxury Hotel") : "Landmark";

                    return (
                      <div key={rev.id || index} className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/40 dark:border-slate-800 p-5 rounded-2xl space-y-3 hover:border-emerald-500/30 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <ShimmerImage
                              src={rev.userPhoto}
                              alt={rev.userName}
                              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800"
                              height="32px"
                            />
                            <div>
                              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">{rev.userName}</span>
                              <span className="text-[10px] text-slate-400 block font-mono">
                                Landmark: <span className="underline cursor-pointer font-bold text-emerald-600 dark:text-emerald-400" onClick={() => {
                                  const matchedPlace = PLACES_DATA.find(p => p.id === rev.entityId);
                                  const matchedHotel = HOTELS_DATA.find(h => h.id === rev.entityId);
                                  const matchedRest = RESTAURANTS_DATA.find(r => r.id === rev.entityId);
                                  if (matchedPlace) setSelectedPlace(matchedPlace);
                                  else if (matchedHotel) setSelectedHotel(matchedHotel);
                                  else if (matchedRest) setSelectedRestaurant(matchedRest);
                                }}>{entityName}</span> ({entityCategory})
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-mono text-amber-500 text-xs">{"★".repeat(rev.rating)}</span>
                            <span className="text-[9px] text-slate-400 font-mono mt-1">{new Date(rev.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-sans">{rev.comment}</p>

                        {rev.photoUrl && (
                          <ShimmerImage
                            src={rev.photoUrl}
                            alt="Nomad travel capture"
                            className="w-44 h-24 object-cover rounded-xl border border-slate-200 dark:border-slate-850 mt-2"
                            height="96px"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* Mobile Button to slide up Review Sheet */}
                <div className="lg:hidden pt-4">
                  <button
                    onClick={() => setIsReviewSheetOpen(true)}
                    className="w-full bg-[#FFB703] text-slate-950 font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 hover:brightness-105 transition-all text-xs cursor-pointer animate-pulse"
                  >
                    ✍️ Post Traveler Log Bottom Sheet
                  </button>
                </div>
              </div>

              {/* Sidebar: Add Custom Review Log */}
              <div className={`${isReviewSheetOpen ? "fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 backdrop-blur-sm p-0 m-0" : "hidden lg:block lg:col-span-4"}`}>
                <div 
                  className={`${
                    isReviewSheetOpen 
                      ? "bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 p-6 rounded-t-3xl shadow-2xl w-full max-h-[85vh] overflow-y-auto animate-fadeIn flex flex-col justify-between space-y-4" 
                      : "bg-slate-50 dark:bg-slate-950/20 p-6 rounded-3xl border border-slate-200/55 dark:border-slate-800 flex flex-col justify-between space-y-6"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="space-y-4">
                    {isReviewSheetOpen && (
                      <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-200 dark:border-slate-850">
                        <span className="font-sans font-bold text-xs uppercase tracking-widest text-[#FFB703]">Post Traveler Log</span>
                        <button onClick={() => setIsReviewSheetOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer">
                          <X className="w-5 h-5 font-bold" />
                        </button>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                        ✍️ Post Traveler Log
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal mt-1">
                        Share your experience tracking leopards, climbing mountains, or staying in fine Kandy/Galle spots.
                      </p>
                    </div>

                    <div className="space-y-3 font-sans text-xs">
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Target Paradise</label>
                        <select
                          id="feed-select-landmark"
                          className="w-full bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-805 p-2 rounded-xl text-slate-850 dark:text-slate-100 outline-none font-medium"
                          onChange={(e) => {
                            (window as any).selectedFeedTargetId = e.target.value;
                          }}
                        >
                          <option value="">-- Select Destination --</option>
                          {PLACES_DATA.map(p => <option key={p.id} value={p.id}>⛰️ {p.name}</option>)}
                          {HOTELS_DATA.map(h => <option key={h.id} value={h.id}>🏨 {h.name}</option>)}
                          {RESTAURANTS_DATA.map(r => <option key={r.id} value={r.id}>🍛 {r.name}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Nomad Handle Name</label>
                        <input
                          id="feed-comment-name"
                          type="text"
                          value={newCommentName}
                          onChange={(e) => setNewCommentName(e.target.value)}
                          placeholder="e.g. BackpackerNisha"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2.5 rounded-xl outline-none text-slate-800 dark:text-slate-200 focus:border-emerald-500 font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Star rating (1-5)</label>
                        <select
                          id="feed-comment-rating-el"
                          value={newCommentRating}
                          onChange={(e) => setNewCommentRating(parseInt(e.target.value))}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2.5 rounded-xl outline-none text-slate-800 dark:text-slate-200 focus:border-emerald-500 font-medium"
                        >
                          <option value={5}>⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                          <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                          <option value={3}>⭐⭐⭐ (3 - Satisfactory)</option>
                          <option value={2}>⭐⭐ (2 - Lacking Facilities)</option>
                          <option value={1}>⭐ (1 - Avoid / High Hazard)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Detailed Comment</label>
                        <textarea
                          id="feed-comment-text"
                          rows={4}
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          placeholder="Speak about road conditions, local guides, tea estate views, or cuisine tastes..."
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2.5 rounded-xl outline-none text-slate-800 dark:text-slate-200 focus:border-emerald-500 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      id="feed-btn-upload-img"
                      type="button"
                      onClick={() => {
                        setSimulatedPhoto("https://images.unsplash.com/photo-1545167622-3a6ac756afa4?auto=format&fit=crop&w=400&q=80");
                        alert("Simulated scenic drone photo attached successfully!");
                      }}
                      className="w-full bg-white dark:bg-slate-900 hover:bg-slate-105 dark:hover:bg-slate-800 text-slate-705 dark:text-slate-300 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-medium"
                    >
                      📸 Attach Coastal Capture
                    </button>
                    {simulatedPhoto && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 text-center block font-semibold">✓ Photo attached!</span>
                    )}

                    <button
                      id="feed-btn-submit"
                      onClick={() => {
                        const targetId = (window as any).selectedFeedTargetId;
                        if (!targetId) {
                          alert("Please select a target paradise landmark first!");
                          return;
                        }
                        if (!newCommentText.trim()) {
                          alert("Please enter your detailed travel comments before broadcasting!");
                          return;
                        }
                        handleAddReview(targetId);
                        setIsReviewSheetOpen(false);
                        alert("Broadcasting successful! Your review has been updated in the global nomination panel!");
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-bold py-3 rounded-xl shadow-md transition-all uppercase tracking-wider cursor-pointer font-bold"
                    >
                      Broadcast Nomad Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- TAB 7: INTERACTIVE REGIONAL MAP -------------------- */}
        {activeTab === "map" && (
          <div className="space-y-6">
            <InteractiveMap />
          </div>
        )}

      </main>

      {/* -------------------- FOOTER & NEWSLETTER BLOCK -------------------- */}
      <footer className="bg-[#0A1F44]/95 backdrop-blur-md border-t border-white/10 pt-16 pb-12 transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          
          {/* Newsletter Box */}
          <div className="bg-gradient-to-tr from-[#0b2149] via-[#04122d] to-[#0A1F44] text-white rounded-3xl p-6 md:p-10 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 mb-16 shadow-2xl">
            <div className="md:max-w-md">
              <span className="text-[9px] font-mono font-bold text-[#FFB703] uppercase tracking-widest block mb-1.5">Exclusive updates</span>
              <h4 className="text-xl md:text-2xl font-sans font-extrabold text-white leading-tight">
                {t.newsletterTitle}
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {t.newsletterSub}
              </p>
            </div>
            
            <div className="w-full md:max-w-sm">
              {newsletterSubscribed ? (
                <div className="p-4 bg-emerald-950/45 border border-emerald-500/35 rounded-2xl text-center">
                  <CheckCircle className="w-6 h-6 text-[#FFB703] mx-auto mb-1.5" />
                  <span className="font-bold text-xs text-emerald-300">Wanderlust list active!</span>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Check your email for your free Sri Lanka eBook travel guide.</p>
                </div>
              ) : (
                <form
                  id="newsletter-form"
                  onSubmit={(e) => { e.preventDefault(); setNewsletterSubscribed(true); }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-2 flex items-center shadow-lg"
                >
                  <input
                    id="newsletter-input"
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter international email..."
                    className="w-full bg-transparent border-0 outline-none text-xs text-white placeholder-slate-400 px-3 outline-none"
                  />
                  <button
                    id="btn-newsletter-submit"
                    type="submit"
                    className="bg-[#FFB703] hover:bg-[#e09b00] text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex-shrink-0 cursor-pointer transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Regular Footer Directory */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 border-b border-white/10 pb-12 text-xs">
            {/* Column 1 info with designer and licensing credits */}
            <div className="col-span-2 space-y-4">
              <span className="font-sans font-bold text-[#FFB703] text-sm tracking-wide block uppercase font-display">Visit Sri Lanka Guide</span>
              <p className="text-slate-350 leading-relaxed max-w-sm text-xs font-sans">
                Your luxury adventure companion regarding cascading waterfalls, golden sand beaches, forest wildlife reserves, historic temples, boutique resort stays, and specialty fine dining.
              </p>
              <div className="space-y-1.5 text-[10px] text-slate-400 font-mono">
                <p>Designed & Developed by <strong className="text-[#FFB703]">M.A.I Sandamal</strong></p>
                <p>All photos and location images are licensed under Unsplash & CC/Wikimedia.</p>
                <p className="opacity-60">© 2026 VISITSRILANKAGUIDE.COM. All rights reserved.</p>
              </div>
            </div>

            {/* Column 2 Category items links */}
            <div className="space-y-3">
              <span className="font-black text-[10px] text-slate-350 uppercase tracking-widest block">Main Categories</span>
              <ul className="space-y-1.5 text-slate-300 list-none pl-0">
                <li className="hover:text-[#FFB703] cursor-pointer transition-colors" onClick={() => { setActiveTab("explore"); setSelectedCategory(DestinationCategory.BEACHES); }}>Southern Beaches</li>
                <li className="hover:text-[#FFB703] cursor-pointer transition-colors" onClick={() => { setActiveTab("explore"); setSelectedCategory(DestinationCategory.WATERFALLS); }}>Highland Waterfalls</li>
                <li className="hover:text-[#FFB703] cursor-pointer transition-colors" onClick={() => { setActiveTab("explore"); setSelectedCategory(DestinationCategory.MOUNTAINS_HILL_COUNTRY); }}>Mountain Trails</li>
                <li className="hover:text-[#FFB703] cursor-pointer transition-colors" onClick={() => { setActiveTab("explore"); setSelectedCategory(DestinationCategory.SAFARI_PARKS); }}>Leopard Safaris</li>
              </ul>
            </div>

            {/* Column 3 Hospitality links */}
            <div className="space-y-3">
              <span className="font-black text-[10px] text-slate-350 uppercase tracking-widest block">Hospitality</span>
              <ul className="space-y-1.5 text-slate-300 list-none pl-0">
                <li className="hover:text-[#FFB703] cursor-pointer transition-colors" onClick={() => { setActiveTab("explore"); setSelectedCategory("HOTELS"); }}>Resort Stays</li>
                <li className="hover:text-[#FFB703] cursor-pointer transition-colors" onClick={() => { setActiveTab("explore"); setSelectedCategory("RESTAURANTS"); }}>Fine Dining</li>
                <li className="hover:text-[#FFB703] cursor-pointer transition-colors" onClick={() => { setActiveTab("planner"); }}>Route Planner</li>
                <li className="hover:text-[#FFB703] cursor-pointer transition-colors" onClick={() => { setActiveTab("tips"); }}>eVisa ETA Help</li>
              </ul>
            </div>

            {/* Column 4 Social Link block */}
            <div className="space-y-3">
              <span className="font-black text-[10px] text-slate-350 uppercase tracking-widest block">Follow Paradise</span>
              <ul className="space-y-1.5 text-slate-300 list-none pl-0">
                <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFB703] transition-colors">Instagram Feed</a></li>
                <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFB703] transition-colors">YouTube Drone Reels</a></li>
                <li><a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFB703] transition-colors">Pinterest Moodboards</a></li>
                <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFB703] transition-colors">Travel Community Group</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>


      {/* ------------------------------------------------------------- */}
      {/* -------------------- PLACE MODAL VIEWER --------------------- */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {selectedPlace && (
          <motion.div
            id="modal-place"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              id="modal-place-body"
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
            >
              {/* Image banner inside modal */}
              <div className="relative h-64 md:h-80 w-full overflow-hidden">
                <ShimmerImage
                  src={selectedPlace.imageUrl || selectedPlace.imageUrls?.[0]}
                  alt={selectedPlace.name}
                  className="w-full h-full object-cover"
                  height="320px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" />
                
                {/* Elegant image license overlay */}
                {selectedPlace.imageLicense && (
                  <div className="absolute top-4 left-4 bg-slate-950/75 backdrop-blur-md text-white font-mono text-[9px] px-2.5 py-1.5 rounded-lg border border-white/10 z-10 flex items-center gap-1 shadow-md">
                    <span className="opacity-75">📷 Licensed:</span>
                    <span className="font-semibold text-emerald-400">{selectedPlace.imageLicense}</span>
                  </div>
                )}

                <button
                  id="btn-close-place-modal"
                  onClick={() => setSelectedPlace(null)}
                  className="absolute top-4 right-4 bg-slate-950/70 hover:bg-slate-950/90 text-white rounded-full p-2 z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute bottom-5 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white">
                  <div>
                    <span className="bg-emerald-600 font-mono text-[9px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider block w-max mb-1.5">
                      {selectedPlace.category}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-sans font-extrabold tracking-tight leading-none text-white">
                      {selectedPlace.name}
                    </h2>
                    <span className="text-slate-350 text-xs mt-1 block flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" /> {selectedPlace.location}
                    </span>
                  </div>

                  {/* Core rating */}
                  <div className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-md px-3.5 py-2 rounded-xl text-xs font-mono">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <strong>{getCompoundRating(selectedPlace.id, selectedPlace.rating)} / 5</strong>
                    <span className="opacity-60 text-[10px]">({selectedPlace.reviewsCount + getReviewsForEntity(selectedPlace.id).length} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Modal Contents */}
              <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 text-slate-800 dark:text-slate-200">
                {/* Left Side: Long review and images */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Tabs Navigator */}
                  <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-semibold mb-4">
                    <button
                      id="btn-tab-overview"
                      onClick={() => setActiveModalTab("overview")}
                      className={`pb-2.5 px-2 border-b-2 transition-all cursor-pointer ${
                        activeModalTab === "overview"
                          ? "border-[#FFB703] text-slate-900 dark:text-white"
                          : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      id="btn-tab-reach"
                      onClick={() => setActiveModalTab("reach")}
                      className={`pb-2.5 px-2 border-b-2 transition-all cursor-pointer ${
                        activeModalTab === "reach"
                          ? "border-[#FFB703] text-slate-900 dark:text-white"
                          : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      }`}
                    >
                      How to Reach
                    </button>
                    <button
                      id="btn-tab-tips"
                      onClick={() => setActiveModalTab("tips")}
                      className={`pb-2.5 px-2 border-b-2 transition-all cursor-pointer ${
                        activeModalTab === "tips"
                          ? "border-[#FFB703] text-slate-900 dark:text-white"
                          : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      }`}
                    >
                      Best Time & Tips
                    </button>
                  </div>

                  {/* Tab Body Contents */}
                  <div className="space-y-4">
                    {activeModalTab === "overview" && (
                      <div className="space-y-4">
                        <div className="bg-[#0A1F44]/5 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 p-4 rounded-2xl flex items-center justify-between text-xs transition-colors">
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg">🇱🇰</span>
                            <div>
                              <span className="text-slate-400 block text-[10px] uppercase font-mono font-bold">Standard Admittance Entry Ticket</span>
                              <span className="font-semibold text-slate-800 dark:text-[#FFB703]">
                                {selectedPlace.entranceFee || (
                                  selectedPlace.category === DestinationCategory.BEACHES 
                                    ? "Free Public Access" 
                                    : selectedPlace.category === DestinationCategory.WATERFALLS
                                    ? "Free Local / LKR 150-250 Conservation Fee"
                                    : selectedPlace.category === DestinationCategory.HERITAGE_SITES
                                    ? "LKR 4,500 / USD 15 - 30 Standard Entry ticket"
                                    : "LKR 1,500 / USD 10 entry price"
                                )}
                              </span>
                            </div>
                          </div>
                          <span className="font-mono text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-md font-bold tracking-wider uppercase">Verified</span>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Resident Explorer Review</h4>
                          <p className="text-xs md:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            {selectedPlace.fullReview || selectedPlace.description}
                          </p>
                        </div>
                      </div>
                    )}

                    {activeModalTab === "reach" && (
                      <div className="space-y-4 text-xs font-sans leading-relaxed">
                        <div className="bg-[#0A1F44]/5 dark:bg-slate-950/25 border border-slate-200 dark:border-white/5 rounded-2xl p-4 md:p-5">
                          <h4 className="font-bold text-slate-850 dark:text-[#FFB703] flex items-center gap-1.5 mb-2 font-display uppercase tracking-wider text-[11px]">
                            📍 Recommended Route Directions & Transport
                          </h4>
                          <ul className="space-y-2.5 list-disc pl-4 text-slate-600 dark:text-slate-300">
                            {selectedPlace.location.toLowerCase().includes("ella") ? (
                              <>
                                <li><strong>By Scenic Train:</strong> Book a first or second-class observational seat on the world-renowned Kandy-to-Ella railway line. An absolutely sensational ride.</li>
                                <li><strong>By Express Bus:</strong> Daily air-conditioned long-distance commuter buses route through Kumbalwela Junction.</li>
                                <li><strong>By TukTuk:</strong> Easily hail local micro-transit cabs from Ella center town. Normal charges LKR 500-1000.</li>
                              </>
                            ) : selectedPlace.location.toLowerCase().includes("galle") || selectedPlace.category === DestinationCategory.BEACHES ? (
                              <>
                                <li><strong>By Southern Expressway Bus:</strong> Take the luxury Colombo-Galle highway AC motor-coaches starting from Maharagama terminal. (takes approx 1.5 - 2 hours)</li>
                                <li><strong>By Coastal Mainline Train:</strong> Board scenic seaside commuter rail services from Colombo Fort moving south hugging the beaches.</li>
                              </>
                            ) : (
                              <>
                                <li><strong>By Private Chauffeur:</strong> Direct transfers starting from Bandaranaike International Airport (BIA) can be pre-booked in our planner.</li>
                                <li><strong>By Commuter Tuk-Tuk:</strong> Highly efficient option for close 5-15km regional moves. Pre-negotiate pricing or activate standard taximeters.</li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>
                    )}

                    {activeModalTab === "tips" && (
                      <div className="space-y-4">
                        <div className="bg-[#0A1F44]/5 dark:bg-slate-950/25 border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-xs">
                          <h4 className="font-bold text-[#FFB703] flex items-center gap-1.5 mb-1 font-display uppercase tracking-widest text-[10px]">
                            📅 Best Season & Weather Months
                          </h4>
                          <p className="text-slate-650 dark:text-slate-300 leading-normal">
                            {selectedPlace.bestTime || (
                              selectedPlace.category === DestinationCategory.BEACHES
                                ? "December to April (ideal for Southern & Western surf breaks with calm blue skies and minimum monsoons)."
                                : "January to April offers dry cool weather suited for climbing high summits. Watch for rain from May through September."
                            )}
                          </p>
                        </div>

                        {/* High Quality Travel Visitor tips block */}
                        <div className="bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-4 md:p-5">
                          <h4 className="text-xs font-sans font-bold text-emerald-800 dark:text-[#FFB703] uppercase tracking-wider mb-2">
                            💡 Pro Visitor Travel Etiquette
                          </h4>
                          <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-300 pl-4 list-disc">
                            {selectedPlace.visitorTips?.map((tip, idx) => (
                              <li key={idx}>{tip}</li>
                            )) || (
                              <li>Respect sacred sites! Dress modestly to cover shoulders and knees, and remove shoes/hats before crossing temple thresholds.</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* IMAGE GALLERY requested */}
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                      Highland Drone & Coast Gallery
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {[0, 1, 2].map((idx) => {
                        const fallbacks = [
                          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
                          "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=300&q=80",
                          "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=300&q=80"
                        ];
                        const customImages = selectedPlace.imageUrls || [];
                        const imgUrl = customImages[idx] || customImages[idx % customImages.length] || fallbacks[idx];
                        return (
                          <ShimmerImage
                            key={idx}
                            src={imgUrl}
                            alt={`${selectedPlace.name} view ${idx + 1}`}
                            className="rounded-lg object-cover h-24 w-full hover:scale-105 transition-transform duration-300 cursor-zoom-in"
                            height="96px"
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* -------------------- COMMENTS & AD-HOC REVIEWS BLOCK -------------------- */}
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
                    <h3 className="font-sans font-bold text-sm text-slate-800 dark:text-slate-100">
                      Traveler Reviews & Feedback ({selectedPlace.reviewsCount + getReviewsForEntity(selectedPlace.id).length})
                    </h3>

                    {/* Submit Review box */}
                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-850 space-y-4">
                      <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block font-sans">
                        Submit Traveler Log review
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Your Travel Handle</label>
                          <input
                            id="comment-name"
                            type="text"
                            value={newCommentName}
                            onChange={(e) => setNewCommentName(e.target.value)}
                            placeholder="e.g. EllaBackpacker"
                            className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 px-3 py-2 rounded-lg text-xs outline-none text-slate-800 dark:text-slate-200 focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1">Star rating (1-5)</label>
                          <select
                            id="comment-rating-select"
                            value={newCommentRating}
                            onChange={(e) => setNewCommentRating(parseInt(e.target.value))}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 px-3 py-2 rounded-lg text-xs outline-none text-slate-800 dark:text-slate-200 focus:border-emerald-500"
                          >
                            <option value={5}>⭐⭐⭐⭐⭐ (5 - Elite Paradises)</option>
                            <option value={4}>⭐⭐⭐⭐ (4 - Worth an Afternoon)</option>
                            <option value={3}>⭐⭐⭐ (3 - Medium Experience)</option>
                            <option value={2}>⭐⭐ (2 - Lacks Infrastructure)</option>
                            <option value={1}>⭐ (1 - Avoid completely)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] font-bold text-slate-400 block uppercase mb-1 font-sans">Review Comment details</label>
                        <textarea
                          id="comment-body"
                          rows={3}
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          placeholder="Describe accessibility, wild currents, hike levels or pricing..."
                          className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 px-3.5 py-2.5 rounded-lg text-xs outline-none text-slate-800 dark:text-slate-200 focus:border-emerald-500"
                        />
                      </div>

                      {/* Photo upload mock block */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <div className="flex items-center gap-2">
                          <button
                            id="btn-upload-mock-img"
                            type="button"
                            onClick={() => {
                              setSimulatedPhoto("https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80");
                              alert("Boutique drone photo simulating upload completed!");
                            }}
                            className="bg-slate-200 hover:bg-slate-250 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-705 dark:text-slate-300 font-sans px-3 py-1.5 rounded-lg text-[10px]"
                          >
                            📸 Upload Travel Photo
                          </button>
                          {simulatedPhoto && <span className="text-[10px] text-emerald-600">✓ Uploaded</span>}
                        </div>

                        <button
                          id="btn-comment-submit"
                          onClick={() => handleAddReview(selectedPlace.id)}
                          disabled={!newCommentText.trim()}
                          className="bg-emerald-600 hover:bg-emerald-505 text-white px-4 py-2 rounded-lg font-bold font-sans text-[11px] cursor-pointer disabled:opacity-40"
                        >
                          Publish Review Log
                        </button>
                      </div>
                    </div>

                    {/* Render Reviews List */}
                    <div className="space-y-4">
                      {/* Live static mock reviews combined with dynamic user writes */}
                      {getReviewsForEntity(selectedPlace.id).map((rev) => (
                        <div key={rev.id} className="bg-slate-50 dark:bg-slate-950/40 border border-slate-150 p-4 rounded-xl text-xs space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <ShimmerImage src={rev.userPhoto} alt={rev.userName} className="w-6 h-6 rounded-full" height="24px" />
                              <span className="font-bold">{rev.userName}</span>
                            </div>
                            <span className="font-mono text-amber-500">{"★".repeat(rev.rating)}</span>
                          </div>
                          <p className="text-slate-650 dark:text-slate-300">{rev.comment}</p>
                          {rev.photoUrl && (
                            <ShimmerImage src={rev.photoUrl} alt="Review attachment" className="w-32 h-20 object-cover rounded-lg border border-slate-200 mt-1" height="80px" />
                          )}
                          <span className="text-[9px] text-slate-400 font-mono block">Published: {new Date(rev.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))}

                      {/* Predefined verified community reviews */}
                      {getStaticReviewsFor(selectedPlace.id, selectedPlace.name, selectedPlace.category).map((rev) => (
                        <div key={rev.id} className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl text-xs space-y-2 border border-slate-150 dark:border-slate-800">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <ShimmerImage src={rev.userPhoto} alt={rev.userName} className="w-5.5 h-5.5 rounded-full" height="22px" />
                              <span className="font-bold">{rev.userName}</span>
                            </div>
                            <span className="font-mono text-amber-500">{"★".repeat(rev.rating)}</span>
                          </div>
                          <p className="text-slate-650 dark:text-slate-300 leading-relaxed">{rev.comment}</p>
                          <span className="text-[10px] text-slate-450 font-mono block">Published: {new Date(rev.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Side: Maps link, metrics, nearby hotels/eateries */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Google Maps detailed navigation links requested */}
                  <div className="bg-slate-50 dark:bg-slate-950/30 p-5 rounded-2xl border border-slate-150 text-xs">
                    <Map className="w-5 h-5 text-emerald-600 mb-2" />
                    <h4 className="font-sans font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider text-[11px] mb-2">Interactive Location Setup</h4>
                    
                    {/* Live Iframe Google Map Embed */}
                    <div className="w-full h-44 rounded-xl overflow-hidden mb-3.5 border border-slate-200 dark:border-slate-800 relative shadow-inner">
                      <iframe
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedPlace.name + ", Sri Lanka")}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <p className="text-slate-500 dark:text-slate-400 mb-4 text-[10.5px]">
                      Latitude: <strong>{selectedPlace.latitude} N</strong><br />
                      Longitude: <strong>{selectedPlace.longitude} E</strong>
                    </p>

                    <div className="space-y-2">
                      <a
                        id="btn-get-directions-gmaps"
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedPlace.name + ", " + selectedPlace.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 text-white font-sans text-[11px] font-bold px-4 py-3 rounded-xl hover:bg-emerald-555 inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-sm w-full text-center hover:shadow-md transition-shadow"
                      >
                        Get Directions <ArrowRight className="w-3 h-3" />
                      </a>

                      <a
                        id="link-place-gmaps"
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPlace.name + ", " + selectedPlace.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white hover:bg-slate-50 text-slate-800 dark:bg-slate-850 dark:hover:bg-slate-800 dark:text-white font-sans text-[11px] font-semibold px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 inline-flex items-center justify-center gap-1.5 cursor-pointer w-full text-center"
                      >
                        View Full Google Maps <ExternalLink className="w-3 h-3" />
                      </a>

                      <button
                        id="btn-modal-share"
                        onClick={() => handleShareSystem(selectedPlace.name)}
                        className="bg-white hover:bg-slate-50 text-slate-800 dark:bg-slate-850 dark:hover:bg-slate-800 dark:text-white font-sans text-[11px] font-semibold px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 items-center justify-center gap-1.5 cursor-pointer w-full text-center flex"
                      >
                        <Share2 className="w-3.5 h-3.5" /> Copy Shareable Link
                      </button>
                    </div>
                  </div>

                  {/* NEARBY HOTELS Lookup based on matched proximity text */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-20s rounded-2xl p-5 space-y-3.5">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-sans">
                      Nearby Luxury Accommodations
                    </h4>
                    <div className="space-y-3">
                      {HOTELS_DATA.filter(h => h.location.toLowerCase().includes(selectedPlace.location.toLowerCase()) || selectedPlace.location.toLowerCase().includes(h.location.toLowerCase())).slice(0, 2).map(hotel => (
                        <div key={hotel.id} className="flex gap-2 p-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-150">
                          <ShimmerImage src={hotel.imageUrl} alt={hotel.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0 animate-pulse-none" height="48px" />
                          <div className="min-w-0">
                            <span className="font-bold text-[11px] block text-slate-850 truncate leading-tight dark:text-zinc-200">{hotel.name}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{hotel.priceRange} • ★ {hotel.rating}</span>
                          </div>
                        </div>
                      ))}
                      {HOTELS_DATA.filter(h => h.location.toLowerCase().includes(selectedPlace.location.toLowerCase()) || selectedPlace.location.toLowerCase().includes(h.location.toLowerCase())).length === 0 && (
                        <span className="text-slate-400 text-[10px] block">Unwind with scenic homestays near Ella or southern towns.</span>
                      )}
                    </div>
                  </div>

                  {/* NEARBY RESTAURANTS Lookup based on proximity text */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-20s rounded-2xl p-5 space-y-3.5">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-sans">
                      Nearby Dining & Food hubs
                    </h4>
                    <div className="space-y-3">
                      {RESTAURANTS_DATA.filter(r => r.location.toLowerCase().includes(selectedPlace.location.toLowerCase()) || selectedPlace.location.toLowerCase().includes(r.location.toLowerCase())).slice(0, 2).map((res) => (
                        <div key={res.id} className="flex gap-2 p-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-150">
                          <ShimmerImage src={res.imageUrl} alt={res.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0 animate-pulse-none" height="48px" />
                          <div className="min-w-0">
                            <span className="font-bold text-[11px] block text-slate-850 truncate leading-tight dark:text-zinc-200">{res.name}</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{res.cuisine.split(",")[0]} • Cost: {res.priceRange}</span>
                          </div>
                        </div>
                      ))}
                      {RESTAURANTS_DATA.filter(r => r.location.toLowerCase().includes(selectedPlace.location.toLowerCase()) || selectedPlace.location.toLowerCase().includes(r.location.toLowerCase())).length === 0 && (
                        <span className="text-slate-400 text-[10px] block">Specialty roti & local curry setups located within walking boundaries.</span>
                      )}
                    </div>
                  </div>

                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ------------------------------------------------------------- */}
      {/* -------------------- HOTEL MODAL EDITOR --------------------- */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {selectedHotel && (
          <motion.div
            id="modal-hotel"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              id="modal-hotel-body"
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 md:p-8 text-slate-800 dark:text-slate-200"
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
            >
              <button
                id="btn-close-hotel-modal"
                onClick={() => setSelectedHotel(null)}
                className="absolute top-4 right-4 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 text-slate-705 p-1.5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <ShimmerImage src={selectedHotel.imageUrl} alt={selectedHotel.name} className="w-full h-56 object-cover rounded-2xl animate-pulse-none" height="224px" />
                
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-emerald-600 block uppercase font-bold tracking-widest">{selectedHotel.location}</span>
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <strong>{selectedHotel.rating}</strong>
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-sans font-bold text-slate-900 dark:text-white">
                  {selectedHotel.name}
                </h3>

                <p className="text-xs md:text-sm text-slate-550 dark:text-slate-380 leading-relaxed">
                  {selectedHotel.description}
                </p>

                {/* Amenities */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 font-sans">Amenities & Highlights</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedHotel.amenities.map(am => (
                      <span key={am} className="bg-slate-50 dark:bg-slate-850 px-2.5 py-1 rounded-md text-[10px] border border-slate-150 text-slate-650 dark:text-zinc-300">
                        {am}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cost estimate */}
                <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-150">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase font-sans">Estimated Cost</span>
                    <span className="text-sm font-sans font-extrabold text-emerald-800 dark:text-emerald-400">{selectedHotel.priceRange}</span>
                  </div>
                  <a
                    id="link-hotel-book-gmaps"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedHotel.name + " " + selectedHotel.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-505 text-white font-sans text-xs font-bold px-4 py-2.5 rounded-xl block flex items-center gap-1"
                  >
                    Locate on Maps <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ------------------------------------------------------------- */}
      {/* ----------------- RESTAURANT MODAL EDITOR ------------------- */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {selectedRestaurant && (
          <motion.div
            id="modal-restaurant"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              id="modal-res-body"
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 md:p-8 text-slate-800 dark:text-slate-200"
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
            >
              <button
                id="btn-close-res-modal"
                onClick={() => setSelectedRestaurant(null)}
                className="absolute top-4 right-4 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 text-slate-705 p-1.5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <ShimmerImage src={selectedRestaurant.imageUrl} alt={selectedRestaurant.name} className="w-full h-56 object-cover rounded-2xl animate-pulse-none" height="224px" />

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-emerald-600 block uppercase font-bold tracking-widest">{selectedRestaurant.location}</span>
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <strong>{selectedRestaurant.rating}</strong>
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-sans font-bold text-slate-900 dark:text-white">
                  {selectedRestaurant.name}
                </h3>

                <p className="text-xs md:text-sm text-slate-550 dark:text-slate-380 leading-relaxed">
                  {selectedRestaurant.description}
                </p>

                {/* Specialties */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 id-headings-specs uppercase tracking-widest block font-sans">Cuisine Type</h4>
                    <span className="text-xs font-semibold">{selectedRestaurant.cuisine}</span>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 id-headings-specs uppercase tracking-widest block font-sans">Must-Try Specialties</h4>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{selectedRestaurant.specialties.join(", ")}</span>
                  </div>
                </div>

                {/* Cost estimate */}
                <div className="flex items-center justify-between p-4 bg-sky-50 dark:bg-sky-950/20 rounded-xl border border-sky-150">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase font-sans">Average investment</span>
                    <span className="text-xs font-sans font-bold text-slate-700 dark:text-zinc-300">{selectedRestaurant.priceRange}</span>
                  </div>
                  <a
                    id="link-res-directions-gmaps"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedRestaurant.name + " " + selectedRestaurant.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-505 text-white font-sans text-xs font-bold px-4 py-2.5 rounded-xl block flex items-center gap-1"
                  >
                    Get directions <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Floating AI chat drawer trigger */}
      <AiAssistant />

      {/* Floating WhatsApp contact button bottom-right */}
      <a
        id="whatsapp-floating-button"
        href="https://wa.me/94771234567?text=Hi!%20I'm%20using%20the%20Visit%20Sri%20Lanka%20Guide%20and%20would%20like%20some%20travel%20assistance."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 z-40 bg-[#25D366] hover:bg-[#128C7E] text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-115 flex items-center justify-center cursor-pointer group hover:shadow-emerald-500/20"
        aria-label="Chat on WhatsApp"
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.1 1.448 4.7 1.449 5.483 0 9.944-4.461 9.947-9.948.002-2.657-1.03-5.155-2.903-7.03C16.516 1.74 14.02 1.7 11.1 12.003c-2.659-.001-5.155 1.03-7.025 2.905-1.874 1.875-2.904 4.373-2.906 7.03-.004 5.486 4.456 9.95 9.942 9.95zm-2.016-11.13c-.11-.2-.42-.31-.88-.54-.46-.23-2.72-1.34-3.14-1.49-.42-.15-.73-.23-.98.15-.26.38-1 .99-1.22 1.22-.23.23-.46.26-.92.03-.46-.23-1.95-.72-3.71-2.29-1.37-1.22-2.29-2.73-2.56-3.19-.27-.46-.03-.71.2-.94.21-.21.46-.54.69-.81.23-.27.31-.46.46-.77.15-.31.08-.57-.04-.8-.11-.23-.98-2.36-1.34-3.23-.35-.85-.71-.74-.98-.75-.25-.01-.54-.01-.84-.01-.3 0-.79.11-1.2.56-.41.45-1.58 1.54-1.58 3.76s1.62 4.36 1.85 4.67c.23.31 3.2 4.88 7.74 6.84 1.08.47 1.92.75 2.58.96.99.31 1.9.27 2.62.16.8-.12 2.72-1.11 3.1-2.19.38-1.07.38-2 .27-2.19-.11-.2-.42-.3-.88-.53z" />
        </svg>
        <span className="absolute right-14 bg-slate-900 dark:bg-slate-950 text-white text-[10.5px] font-sans font-medium px-2.5 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-slate-700/50">
          Chat with our Sri Lanka Expert 💬
        </span>
      </a>

    </div>
  );
}
