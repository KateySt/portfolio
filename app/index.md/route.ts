import { markdownResponse, profileMarkdown } from "@/lib/agent-docs";

export function GET() {
  return markdownResponse(profileMarkdown());
}
