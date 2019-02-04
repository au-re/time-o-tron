import * as data from "./data/cities_timezones.json";

function capitalize(string) {
  return string.split(" ").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join(" ");
}

export function getCityInfo(cityName) {
  const cities = (data as any).filter((entry) => entry.names.split(",").includes(cityName.toLowerCase()));
  const cityInfo = cities[0] || {};

  return {
    city: cityName,
    country: capitalize(cityInfo.country),
    timezone: cityInfo.timezone,
  };
}
