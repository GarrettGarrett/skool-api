import { extractJsonFromHtml } from "@/app/utils/userDataParser";

export async function GET() {
  const response = await fetch("https://skool.com");
  const html = await response.text();
  const jsonData = extractJsonFromHtml(html);

  console.log({ jsonData });

  const buildId = jsonData.buildId; // Assuming buildId is a direct property of the extracted JSON
  return Response.json({ buildId }); // Return the buildId
}
