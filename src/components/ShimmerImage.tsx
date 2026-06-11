import React, { useState } from "react";

interface ShimmerImageProps {
  src: string;
  alt: string;
  className?: string;
  height?: string; // custom height support for modal vs grid cards
}

export const ShimmerImage: React.FC<ShimmerImageProps> = ({
  src,
  alt,
  className = "",
  height = "200px"
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Fallback high-quality background pattern in case of broken URLs
  const fallbackUrl = "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=400&h=225&q=80&fm=webp";

  // Dynamic Unsplash optimizer for super fast loading (WebP, crop, custom sizes)
  const getOptimizedUrl = (originalUrl: string): string => {
    if (!originalUrl) return fallbackUrl;
    if (originalUrl.includes("images.unsplash.com")) {
      const baseUrl = originalUrl.split("?")[0];
      // If height indicates a large modal image, serve higher width, otherwise serve card size
      const isLarge = height && parseInt(height) > 300;
      const w = isLarge ? 800 : 400;
      const h = isLarge ? 450 : 225;
      return `${baseUrl}?w=${w}&h=${h}&fit=crop&auto=format&fm=webp&q=80&compress=true`;
    }
    return originalUrl;
  };

  const finalSrc = getOptimizedUrl(hasError ? fallbackUrl : src);

  return (
    <div id={`shimmer-img-container-${alt.replace(/\s+/g, "-").toLowerCase()}`} className="relative w-full overflow-hidden" style={{ borderRadius: "12px", height }}>
      {/* Skeleton Loading Effect */}
      {!isLoaded && !hasError && (
        <div id={`skeleton-${alt.replace(/\s+/g, "-").toLowerCase()}`} className="absolute inset-0 w-full h-full bg-slate-100 dark:bg-slate-800 animate-pulse flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200/40 dark:via-slate-700/45 to-transparent animate-[shimmer_1.5s_infinite] bg-[length:200%_100%]" />
          {/* Subtle tropical indicator icon inside skeleton */}
          <span className="text-sm text-slate-400 dark:text-slate-500 font-sans tracking-wide">🇱🇰 Loading Map...</span>
        </div>
      )}

      {/* Actual Destination Image */}
      <img
        src={finalSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setIsLoaded(true);
          setHasError(true);
        }}
        className={`${className} transition-all duration-500 ease-out ${
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.03]"
        }`}
        referrerPolicy="no-referrer"
        style={{
          objectFit: "cover",
          height: height,
          width: "100%",
          borderRadius: "12px"
        }}
      />
    </div>
  );
};
