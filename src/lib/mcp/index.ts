import { defineMcp } from "@lovable.dev/mcp-js";
import aboutPagu from "./tools/about-pagu";
import echo from "./tools/echo";

export default defineMcp({
  name: "pagu-mcp",
  title: "Pagu",
  version: "0.1.0",
  instructions:
    "Tools for the Pagu FLINTA* collective site. Use `about_pagu` for a summary of the collective, or `echo` to verify connectivity.",
  tools: [aboutPagu, echo],
});
