// Free geocoding via OpenStreetMap Nominatim — same OSM family as our Leaflet tiles.
// Note: Nominatim has a 1 request/second usage policy — fine for dev/low traffic,
// but a production app at scale should move to a paid geocoding provider.
export const geocodeAddress = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "MoveIt-App/1.0" },
  });
  const data = await res.json();

  if (!data.length) {
    throw new Error(`Could not locate address: "${address}". Try adding more detail (street, area, city).`);
  }

  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
};
