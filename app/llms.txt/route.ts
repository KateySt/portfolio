import { llmsTxt, markdownResponse } from "@/lib/agent-docs";

export function GET() {
  const res = markdownResponse(llmsTxt());
  res.headers.set("Content-Type", "text/plain; charset=utf-8");
  return res;
}
