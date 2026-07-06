import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "about_pagu",
  title: "About Pagu",
  description:
    "Return a short description of Pagu: a FLINTA*-led collective in Cologne creating intentional spaces for connection through curated events.",
  inputSchema: {},
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: () => ({
    content: [
      {
        type: "text",
        text: "Pagu is a FLINTA*-led collective based in Cologne that creates intentional spaces for connection through curated community events, a community map of safe spaces, and member-only gatherings.",
      },
    ],
  }),
});
