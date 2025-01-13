import { extractJsonFromHtml } from "@/app/utils/userDataParser";

export async function GET() {
  const response = await fetch("https://skool.com", {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });
  const html = await response.text();
  const jsonData = extractJsonFromHtml(html);

  console.log({ jsonData });

  const buildId = jsonData.buildId;
  return Response.json({ buildId });
}
