export interface AuthSlide {
  image: string;
  quote: string;
  alt: string;
}

export const AUTH_SLIDES: Record<string, AuthSlide> = {
  signup: {
    image: "/sign-up.png",
    quote: "Loving Care When You're\nNo Longer There",
    //
    alt: "Woman walking her golden retriever in a sunny park",
  },
  login: {
    image: "/sign-up.png",
    quote: "Every Pet Deserves a\nSecure Future",
    //Every Pet Deserves a\nSecure Future
    alt: "Golden retriever sitting happily in autumn light",
  },
  verify: {
    image: "/sign-up.png",
    quote: "Approximately 10% of dogs\nare in shelters because their\nowner passed away without\na plan",
    alt: "Golden retriever puppy looking through a window",
  },
  "forgot-password": {
    image: "/sign-up.png",
    quote: "",
    //Giving Them a New\nChance
    alt: "Brown dog running in a golden field at sunset",
  },
  "new-password": {
    image: "/sign-up.png",
    quote: "A second chance,\nA lasting legacy",
    //
    alt: "Woman sitting with her golden retriever in a park",
  },
};