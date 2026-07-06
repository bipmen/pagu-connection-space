import { defineMcp } from "@lovable.dev/mcp-js";
import aboutPagu from "./tools/about-pagu";
import getEvents from "./tools/get-events";
import getCommunityMap from "./tools/get-community-map";

export default defineMcp({
  name: "pagu-mcp",
  title: "Pagu",
  version: "0.1.0",
  instructions:
    "Tools for the Pagu FLINTA* collective site. Use `about_pagu` for a summary, `get_events` to list community events, and `get_community_map` to browse mapped safe spaces.",
  tools: [aboutPagu, getEvents, getCommunityMap],
});
