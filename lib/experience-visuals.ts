type RouteVisual = Readonly<{
  imageSrc: string;
  toneClass: string;
}>;

type HospitalVisual = Readonly<{
  imageSrc: string;
  caption: string;
  tags: readonly [string, string];
  toneClass: string;
}>;

const hospitalVisuals: Record<string, HospitalVisual> = {
  "apollo-spectra": {
    imageSrc: "/media/home-hero.jpg",
    caption: "Arrival-first experience with a coordinator-led international desk.",
    tags: ["Arrival Lounge", "Coordinator Desk"],
    toneClass:
      "bg-[linear-gradient(140deg,rgba(10,41,40,0.76),rgba(10,41,40,0.18)_46%,rgba(162,103,34,0.24))]",
  },
  "max-saket": {
    imageSrc: "/media/hospitals/max-saket.jpg",
    caption: "High-capacity pathway for treatment, stay planning, and caregiver coordination.",
    tags: ["Stay Support", "24h Review"],
    toneClass:
      "bg-[linear-gradient(140deg,rgba(118,74,25,0.72),rgba(118,74,25,0.16)_44%,rgba(10,90,84,0.2))]",
  },
  "fortis-gurgaon": {
    imageSrc: "/media/hospitals/fortis-gurgaon.jpg",
    caption: "Nearby NCR option for patients comparing partner centers with senior review access.",
    tags: ["NCR Access", "Senior Review"],
    toneClass:
      "bg-[linear-gradient(140deg,rgba(12,41,52,0.76),rgba(12,41,52,0.16)_44%,rgba(162,103,34,0.18))]",
  },
};

export const experienceVisuals = {
  homeHero: {
    imageSrc: "/media/home-hero.jpg",
    toneClass:
      "bg-[linear-gradient(108deg,rgba(10,33,31,0.9)_8%,rgba(10,33,31,0.58)_34%,rgba(10,33,31,0.18)_68%)]",
  },
  bookingReview: {
    imageSrc: "/media/booking-review.jpg",
    toneClass: "bg-[linear-gradient(180deg,rgba(11,29,29,0.14),rgba(11,29,29,0.74))]",
  },
  vendorLogin: {
    imageSrc: "/media/vendor-login.jpg",
    toneClass: "bg-[linear-gradient(180deg,rgba(12,31,30,0.18),rgba(12,31,30,0.78))]",
  },
  hospitals: hospitalVisuals,
} as const satisfies Readonly<{
  homeHero: RouteVisual;
  bookingReview: RouteVisual;
  vendorLogin: RouteVisual;
  hospitals: Record<string, HospitalVisual>;
}>;

export function getHospitalVisual(imageToken: string): HospitalVisual {
  return experienceVisuals.hospitals[imageToken] ?? experienceVisuals.hospitals["apollo-spectra"];
}
