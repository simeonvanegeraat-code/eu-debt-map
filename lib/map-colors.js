export const MAP_SCALE_COLORS = {
  low: "#d7e6fa",
  medium: "#91baf1",
  high: "#4382da",
  highest: "#173f7f",
  missing: "#e2e7ee",
};

export const MAP_BALANCE_COLORS = {
  surplus: "#2f7fd3",
  balanced: "#dce8f6",
  smallDeficit: "#91b5e4",
  largeDeficit: "#173f75",
  missing: "#e2e7ee",
};

export const MAP_ACCOUNT_BALANCE_COLORS = {
  surplus: MAP_BALANCE_COLORS.surplus,
  deficit: MAP_BALANCE_COLORS.smallDeficit,
  largeDeficit: MAP_BALANCE_COLORS.largeDeficit,
  missing: MAP_BALANCE_COLORS.missing,
};

export const MAP_DEBT_TREND_COLORS = {
  rising: "#173f75",
  risingSoft: "#4382da",
  falling: "#2f7fd3",
  fallingSoft: "#91baf1",
  flat: "#e2e7ee",
};
