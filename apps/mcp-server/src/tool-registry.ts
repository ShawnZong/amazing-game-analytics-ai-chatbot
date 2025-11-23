import {
  FetchGameDataArgsSchema
} from "./schemas";
import {
  fetchGameData
} from "./tools/rawg";

export const TOOLS = [
  {
    name: "fetch_game_data",
    title: "Fetch Game Data",
    description:
      "Fetch game data from the RAWG API. Use this to find games based on filters like date, platform, and genre.",
    schema: FetchGameDataArgsSchema,
    execute: fetchGameData,
  },
];
