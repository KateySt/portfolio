import { llmsTxt, markdownResponse } from "@/lib/agent-docs";

export async function GET() {
  const res = markdownResponse(await llmsTxt());
  res.headers.set("Content-Type", "text/plain; charset=utf-8");
  return res;
}
