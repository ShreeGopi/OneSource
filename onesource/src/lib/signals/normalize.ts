export const VALID_EMOTIONS = [
  "curiosity",
  "urgency",
  "fear",
  "aspiration",
  "status",
  "trust",
  "scarcity",
  "hope",
  "satisfaction",
];

export const normalizeSignal = (
  value?: string
) => {
  if (!value) return "";

  return value.toLowerCase().trim();
};

export const normalizeEmotion = (
  emotion?: string
) => {
  const normalized =
    normalizeSignal(emotion);

  if (!VALID_EMOTIONS.includes(normalized)) {
    return null;
  }

  return normalized;
};