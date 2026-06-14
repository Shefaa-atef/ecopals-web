// Shared refs so RecyclePortalSection's GSAP animations can target DOM
// elements that are rendered inside PhoneScrollStage's overlay system.
export const recyclePhoneRefs = {
  flyItems: [],
  portal: { current: null },
  sparkles: { current: null },
}
