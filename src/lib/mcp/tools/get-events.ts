import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "get_events",
  title: "Get Pagu events",
  description:
    "List Pagu's upcoming and past community events (title, date, location, description).",
  inputSchema: {
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .describe("Maximum number of events to return. Defaults to all."),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async ({ limit }) => {
    const { events } = await import("@/lib/events-mock");
    const list = typeof limit === "number" ? events.slice(0, limit) : events;
    return {
      content: [{ type: "text", text: JSON.stringify(list, null, 2) }],
      structuredContent: { events: list },
    };
  },
});
