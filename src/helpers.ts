import _ from "lodash";
import request from "superagent";

import * as data from "./data/cities_timezones.json";

const appId = process.env.LUIS_APP_ID;
const endpointKey = process.env.LUIS_ENDPOINT_KEY;
const endpoint = `https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/${appId}`;

interface ICity {
  country: string;
  timezone: string;
  names: string;
}

export function capitalize(string) {
  return string.split(" ").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join(" ");
}

export function getCityInfo(cityName) {
  const cities = Object.values(data)
    .filter((city: ICity) => {
      return _.get(city, "names", "").split(",").includes(cityName.toLowerCase());
    });
  const cityInfo = cities[0] || {} as ICity;

  return {
    city: cityName,
    country: capitalize(cityInfo.country),
    timezone: cityInfo.timezone,
  };
}

export async function getLuisIntent(utterance) {
  try {
    const data = await request
      .get(endpoint)
      .query({
        "q": utterance,
        "subscription-key": endpointKey,
        "verbose": true,
      });

    return data.body;

  } catch (error) {
    console.log(error);
  }
}
