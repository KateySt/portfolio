import { markdownResponse, profileMarkdown } from "@/lib/agent-docs";

export async function GET() {
  return markdownResponse(await profileMarkdown());
}
