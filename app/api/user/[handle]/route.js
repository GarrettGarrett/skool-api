import { extractJsonFromHtml, parseUserData } from '@/app/utils/userDataParser';

export async function GET(request, { params }) {
  const handle = params.handle;
  const handleWithoutAt = handle.replace('@', '');

  console.log({ handleWithoutAt });

  try {
    // Fetch user data from your data source (e.g., database or external API)
    const userHtml = await fetchUserData(handleWithoutAt);

    // Html to json
    const jsonData = extractJsonFromHtml(userHtml);

    // Parse the raw data
    const parsedUserData = parseUserData(jsonData);


    return Response.json(parsedUserData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return Response.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}

// Implement these functions to fetch data from your data source
async function fetchUserData(handle) {
  // Add a timestamp to prevent caching
  const timestamp = new Date().getTime();
  const url = `https://www.skool.com/@${handle}?_=${timestamp}`;

  const response = await fetch(url, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.text();
}

