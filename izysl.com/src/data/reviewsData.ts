import { UserReview } from "../types";

export const STATIC_REVIEWS: Record<string, UserReview[]> = {
  "wf-ramboda": [
    {
      id: "sr-1",
      userId: "user-1",
      userName: "Alexander K. (Austria) 🇦🇹",
      userPhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      entityId: "wf-ramboda",
      rating: 5,
      comment: "Ramboda Falls is an elegant beauty! We spent an hour on the viewing bridge. The misty wind spraying from the waterfall was highly refreshing. There is a clean walkway with railings leading all the way up. Absolutely worth of a morning trip!",
      createdAt: "2026-04-12T10:15:00Z"
    },
    {
      id: "sr-2",
      userId: "user-2",
      userName: "Nisha P. (Colombo) 🇱🇰",
      userPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      entityId: "wf-ramboda",
      rating: 4,
      comment: "A wonderful place to unwind and admire the heavy volume of water. The stairs can be highly slippery in some spots, so stay on the wet-zone trails. The nearby restaurant has a great buffet view overlooking the falls.",
      createdAt: "2026-05-20T14:30:00Z"
    }
  ],
  "wf-bambarakanda": [
    {
      id: "sr-3",
      userId: "user-3",
      userName: "Markus S. (Germany) 🇩🇪",
      userPhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      entityId: "wf-bambarakanda",
      rating: 5,
      comment: "The sheer height of Bambarakanda is mind-blowing! It looks like a long white ribbon hanging against the dark rocks. The surrounding pine trees smell incredible. Strongly recommend climbing the side forest trail.",
      createdAt: "2026-03-10T09:20:00Z"
    }
  ],
  "wf-diyaluma": [
    {
      id: "sr-4",
      userId: "user-4",
      userName: "Sophie L. (France) 🇫🇷",
      userPhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      entityId: "wf-diyaluma",
      rating: 5,
      comment: "Unbelievable experience swimming in the natural infinity pools at the top! It is a steep 30-minute hike from Koslanda, but once you reach the summit, the view of the valley is unreal. Pure adventure!",
      createdAt: "2026-05-02T11:45:00Z"
    }
  ],
  "hr-sigiriya": [
    {
      id: "sr-5",
      userId: "user-5",
      userName: "David M. (Canada) 🇨🇦",
      userPhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
      entityId: "hr-sigiriya",
      rating: 5,
      comment: "A masterclass in ancient engineering. Climbing the rock is hard but the views and history are superb. The frescoes are incredibly well-preserved. Go at 7:00 AM as the heat gets intense quickly.",
      createdAt: "2026-05-29T08:15:00Z"
    },
    {
      id: "sr-5b",
      userId: "user-5b",
      userName: "Rajiv S. (Mumbai) 🇮🇳",
      userPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      entityId: "hr-sigiriya",
      rating: 5,
      comment: "The eighth wonder of the world is indeed mesmerizing. The water gardens are layout masterpieces. Be careful around the narrow metal wind spirals near the end of the climb.",
      createdAt: "2026-06-01T15:20:00Z"
    }
  ],
  "hr-gallefort": [
    {
      id: "sr-6",
      userId: "user-6",
      userName: "Claire B. (London) 🇬🇧",
      userPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      entityId: "hr-gallefort",
      rating: 5,
      comment: "Galle Fort is an absolute gem! Walking on the ramparts during sunset while watching children jump into the ocean is iconic. The narrow lanes are full of stylish boutique gelaterias, local jewelry shops, and historic Dutch architecture.",
      createdAt: "2026-05-15T18:10:00Z"
    }
  ],
  "sf-yala": [
    {
      id: "sr-7",
      userId: "user-7",
      userName: "Hervé F. (Lyon) 🇫🇷",
      userPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      entityId: "sf-yala",
      rating: 5,
      comment: "Speechless! We saw two beautiful leopards sleeping in the shade of dry trees in Block 1. We also saw elephants crossing the roads right next to our jeep, herds of deer, wild boars, and massive crocodiles. Best safari in Asia!",
      createdAt: "2026-06-02T10:40:00Z"
    }
  ]
};

export function getStaticReviewsFor(entityId: string, entityName: string, category: string): UserReview[] {
  if (STATIC_REVIEWS[entityId]) {
    return STATIC_REVIEWS[entityId];
  }

  const placeName = entityName || "this destination";
  const reviews: UserReview[] = [];
  
  const names = [
    { name: "John D. (Denver) 🇺🇸", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" },
    { name: "Elena R. (Moscow) 🇷🇺", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80" },
    { name: "Yuki S. (Tokyo) 🇯🇵", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80" },
    { name: "Chloe M. (Sydney) 🇦🇺", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" }
  ];

  const commentsByCategory: Record<string, string[]> = {
    "waterfalls": [
      `Wow! ${placeName} was absolutely gorgeous. The current was very powerful, and we got caught in some refreshing cool mist. Beautiful paths and a must-visit location!`,
      `We visited ${placeName} during our tour and it was highly spectacular. The cascading flows over the dark granite cliffs are so photo-friendly.`,
      `A true hidden jungle paradise. Surrounded by emerald cardamom plantations and high tree ferns. Perfect clean breathing air.`
    ],
    "beaches": [
      `Such a serene shore! We stayed at ${placeName} for sunset and the colors were magnificent. Golden soft sands, clean palms, and safe warm swimming currents.`,
      `The surf vibes here at ${placeName} are fantastic. We rented a surf board for an hour. There are great tropical juice stalls nearby offering cold king coconut.`,
      `A pristine coastal dream! The sand is gold and the ocean is a warm turquoise. Great spot to read a book under swaying palms.`
    ],
    "safari_parks": [
      `Spotting herds of wild elephants at ${placeName} was an emotional dream come true! Our jeep driver was exceptional and tracked multiple deer under the trees.`,
      `Amazing wildlife safari. We saw peacocks, crocodiles, water buffaloes, and even caught a brief glimpse of a sloth bear! Totally worth the entry fee.`,
      `Outstanding natural reserve. The birdwatching here was elite. Highly recommend booking a morning slot around 6 AM to see the wild animals wake up.`
    ],
    "heritage_sites": [
      `A magnificent journey into the ancient historical heritage of Sri Lanka. ${placeName} has outstanding architectural details. The sheer scale is fascinating.`,
      `An legendary sacred sanctuary. We wore modest clothing covering shoulders as is local etiquette. Walking around these old stone ruins was deeply peaceful.`,
      `Unforgettable archeological ruins. Strongly suggest hiring an official guide to learn the incredible stories of the ancient kings.`
    ],
    "mountains_hill_country": [
      `Fabulous highland trekking! The path up ${placeName} offers panoramic views of active tea estates and rolling morning fog. Fresh crisp mountain air.`,
      `Challenging yet super rewarding climb. The summit provides a beautiful 360-degree view of valleys and peaks. Bring high-grip hiking shoes.`,
      `Breathtaking views! The scenic emerald tea rows wrapped around the ridges make ${placeName} a lovely, cool sanctuary from the tropical coast.`
    ],
    "hotels": [
      `Our stay at ${placeName} was pure luxury. Outstanding hospitality, spacious design layout, and incredible views of the Sri Lankan nature. 10/10 service!`,
      `Spectacular boutique hotel! Located in an elegant, quiet zone. The private pool and local spa treatments were a blissful escape after a long hiking day.`
    ],
    "restaurants": [
      `Hands down the best food we had in town! The traditional Sri Lankan rice and curry was rich with aromatic local spices. Exceptionally friendly service!`,
      `Lovely dining ambiance at ${placeName}! We sat outside under the palm trees. Highly recommend trying the seafood platters and fresh lime juice.`
    ]
  };

  const pool = commentsByCategory[category] || [
    `Unbelievable destination! We thoroughly enjoyed visiting ${placeName}. The local guides were helpful and the visual scenery was extremely relaxing.`,
    `Very clean, peaceful, and beautifully preserved site in Sri Lanka. It represents the gorgeous local nature. Highly recommend checking it out!`
  ];

  for (let j = 0; j < 2; j++) {
    const userIndex = (entityId.charCodeAt(entityId.length - 1) + j) % names.length;
    const commentIndex = (entityId.charCodeAt(0) + j) % pool.length;
    reviews.push({
      id: `seeded-rev-${entityId}-${j}`,
      userId: `seeded-user-${j}`,
      userName: names[userIndex].name,
      userPhoto: names[userIndex].img,
      entityId,
      rating: 4 + (j % 2),
      comment: pool[commentIndex],
      createdAt: new Date(Date.now() - (j * 4 + 2) * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  return reviews;
}

// Global list of photos uploaded by tourists/preselected representing all top places
export const ALL_TOURIST_PHOTOS = [
  {
    id: "photo-1",
    placeName: "Sigiriya Lion Rock",
    url: "https://images.unsplash.com/photo-1588598126707-167bb336599b?auto=format&fit=crop&w=800&q=80",
    uploadedBy: "Alexander K.",
    caption: "Drone capture of the majestic sky fortress early morning."
  },
  {
    id: "photo-2",
    placeName: "Ramboda Falls",
    url: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80",
    uploadedBy: "Sophie L.",
    caption: "Deep green forest framing the powerful water spray."
  },
  {
    id: "photo-3",
    placeName: "Mirissa Beach",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    uploadedBy: "Yuki S.",
    caption: "Stunning sunset over Coconut Tree Hill, Mirissa."
  },
  {
    id: "photo-4",
    placeName: "Nine Arch Bridge",
    url: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?auto=format&fit=crop&w=800&q=80",
    uploadedBy: "Elena R.",
    caption: "The mountain train passing over the historic arches."
  },
  {
    id: "photo-5",
    placeName: "Yala National Park",
    url: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=800&q=80",
    uploadedBy: "Hervé F.",
    caption: "A magnificent leopard resting calmly on a tree branch."
  },
  {
    id: "photo-6",
    placeName: "Udawalawe Elephants",
    url: "https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&w=800&q=80",
    uploadedBy: "David M.",
    caption: "Dozens of Asian elephants roaming in open grass plains."
  },
  {
    id: "photo-7",
    placeName: "Galle Dutch Fort",
    url: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=800&q=80",
    uploadedBy: "Claire B.",
    caption: "Strolling the colonial ramparts next to the lighthouse."
  },
  {
    id: "photo-8",
    placeName: "Dambulla Caves",
    url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80",
    uploadedBy: "Rajiv S.",
    caption: "Golden Buddha statues lying peacefully inside dark caverns."
  }
];
