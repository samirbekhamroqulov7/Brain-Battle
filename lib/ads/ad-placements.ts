// Strategic ad placements configuration for different pages and contexts

export const AD_PLACEMENTS = {
  // Home page
  home: {
    banner_top: "ca-pub-xxxxxxxxxxxxxxxx",
    banner_bottom: "ca-pub-xxxxxxxxxxxxxxxx",
  },

  // PvP game selection
  pvp_list: {
    banner_top: "ca-pub-xxxxxxxxxxxxxxxx",
    banner_between_games: "ca-pub-xxxxxxxxxxxxxxxx",
    banner_bottom: "ca-pub-xxxxxxxxxxxxxxxx",
  },

  // During gameplay
  game: {
    banner_bottom: "ca-pub-xxxxxxxxxxxxxxxx",
    rewarded_video: "ca-pub-xxxxxxxxxxxxxxxx",
  },

  // Game results/match end
  results: {
    banner_top: "ca-pub-xxxxxxxxxxxxxxxx",
    rewarded_ad: "ca-pub-xxxxxxxxxxxxxxxx",
    interstitial: "ca-pub-xxxxxxxxxxxxxxxx",
  },

  // Profile page
  profile: {
    banner_bottom: "ca-pub-xxxxxxxxxxxxxxxx",
    rewarded_ad: "ca-pub-xxxxxxxxxxxxxxxx",
  },

  // Settings page
  settings: {
    banner_bottom: "ca-pub-xxxxxxxxxxxxxxxx",
  },
}

export const MOBILE_AD_UNITS = {
  // AdMob unit IDs for mobile apps (APK/AAB)
  banner_medium: "ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxx",
  banner_smart: "ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxx",
  interstitial: "ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxx",
  rewarded: "ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxx",
  rewarded_interstitial: "ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxx",
}
