import { extractJsonFromHtml, parseCommunityData } from '@/app/utils/communityDataParser';

export async function GET(request, { params }) {
  const handle = params.handle;

  console.log(`Fetching community data for: ${handle}`);

  try {
    // Step 1: Fetch HTML from the community page
    const communityHtml = await fetchCommunityData(handle);

    // Step 2: Extract the __NEXT_DATA__ JSON from the HTML
    const jsonData = extractJsonFromHtml(communityHtml);
    
    // Optional: Log the raw data structure to assist in debugging
    // console.log('Raw JSON data structure:', JSON.stringify(jsonData.props.pageProps, null, 2));

    // Step 3: Parse the community data into a clean structure
    const parsedCommunityData = parseCommunityData(jsonData);
    
    // Step 4: Return the parsed data as JSON
    return Response.json(parsedCommunityData);
  } catch (error) {
    console.error('Error fetching community data:', error);
    
    // Provide a more detailed error response
    return Response.json({ 
      error: 'Failed to fetch community data', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    }, { status: 500 });
  }
}

async function fetchCommunityData(handle) {
  // Add a timestamp to prevent caching
  const timestamp = new Date().getTime();
  const url = `https://www.skool.com/${handle}?_=${timestamp}`;

  console.log(`Fetching data from URL: ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36'
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    
    if (!html.includes('__NEXT_DATA__')) {
      throw new Error('No __NEXT_DATA__ found in the HTML response. The community may not exist or may require authentication.');
    }
    
    return html;
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    throw error;
  }
} 