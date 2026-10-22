/* All editable content lives here. Edit, save, refresh. */
window.SITE_CONFIG = {
  brand: "Math Over Myth",
  logo: "assets/icons/logo.svg",

  // <head> / SEO
  meta: {
    title: "Math Over Myth — Facts first. Always.",
    description: "Math Over Myth breaks down claims with real numbers, so you can decide with data instead of hype.",
    url: "https://example.com/",
    image: "https://example.com/og-image.png",
    themeColor: "#12171f",
    twitterHandle: "@mathovermyth"
  },

  eyebrow: "Introducing",
  eyebrowAccent: "Season 1",
  headline: "Numbers Don’t Lie. Narratives Do",
  headlineAccentWords: 1,           // how many leading words get the coral gradient
  tagline: "Learn how to trade what the data actually says—not what you hope it means",

  cta:          { label: "Join the Discord", href: "https://discord.gg/example" },
  secondaryCta: { label: "Subscribe on YouTube",   href: "https://youtube.com/@mathovermyth" },  // set to null to hide

  socials: [
    { name: "X",         icon: "assets/icons/x.svg",         url: "https://x.com/mathovermyth" },
    { name: "YouTube",   icon: "assets/icons/youtube.svg",   url: "https://youtube.com/@mathovermyth" },
    { name: "Discord",   icon: "assets/icons/discord.svg",   url: "https://discord.gg/example" },
    { name: "Instagram", icon: "assets/icons/instagram.svg", url: "https://instagram.com/mathovermyth" }
  ],

  // Hero terminal card. Candles are [open, high, low, close, volume].
  heroCard: {
    ticker: "SPY",
    timeframe: "1D",
    status: "ACTIVE BREAKOUT",
    price: "$5,864.20",
    change: "+1.84% (+$105.80)",
    direction: "up",                               // "up" = emerald pill, "down" = coral pill
    target: { label: "TARGET",     value: 5940 },
    floor:  { label: "RISK FLOOR", value: 5740 },
    candles: [
      [5758, 5775, 5742, 5768, 40],
      [5768, 5790, 5760, 5785, 48],
      [5785, 5792, 5770, 5774, 35],
      [5774, 5800, 5770, 5796, 55],
      [5796, 5812, 5788, 5805, 52],
      [5805, 5815, 5790, 5794, 38],
      [5794, 5828, 5790, 5822, 66],
      [5822, 5848, 5818, 5842, 72],
      [5842, 5858, 5835, 5850, 60],
      [5850, 5872, 5846, 5864, 85]
    ],
    stats: [
      { label: "Probability", value: "78.4%" },
      { label: "R:R Ratio",   value: "1 : 3.8" },
      { label: "Discipline",  value: "100% Math" }
    ]
  },

  footer: "© {year} Math Over Myth"
};
