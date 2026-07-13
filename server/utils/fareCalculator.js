// Distance + weight based fare calculation
const BASE_FARE = 500;
const RATE_PER_KM = 100;
const RATE_PER_KG = 50;

export const calculateFare = (distanceKm, weightKg) => {
  const fare = BASE_FARE + distanceKm * RATE_PER_KM + weightKg * RATE_PER_KG;
  return Math.round(fare);
};
