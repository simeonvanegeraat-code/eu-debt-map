function nextScrollNavigation(state, scrollY, { enabled, locked, headerHeight }) {
  const y = Math.max(0, scrollY);
  if (!enabled || locked || y <= headerHeight + 24) {
    return { y, direction: 0, distance: 0, hidden: false };
  }
  const delta = y - state.y;
  const direction = Math.sign(delta);
  if (!direction) return { ...state, y };
  const distance = direction === state.direction ? state.distance + Math.abs(delta) : Math.abs(delta);
  return { y, direction, distance, hidden: distance >= 12 ? direction > 0 : state.hidden };
}

module.exports = { nextScrollNavigation };
