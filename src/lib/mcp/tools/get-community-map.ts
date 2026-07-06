import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_community_map",
  title: "Get community map entries",
  description:
    "Return Pagu's community map: FLINTA*-friendly spaces, categories, and city summaries.",
  inputSchema: {},
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async () => {
    const mod = await import("@/lib/community-map-mock");
    const payload = {
      markers: (mod as any).markers ?? (mod as any).communityMarkers ?? [],
      categories: (mod as any).categories ?? [],
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
