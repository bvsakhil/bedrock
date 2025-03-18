import { NextRequest, NextResponse } from 'next/server';

// Get the CMS API URL from environment variables
const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const limit = searchParams.get('limit') || '10';
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ docs: [], error: null });
    }
    
    // Build the search URL using the exact format required by the CMS
    const cmsSearchUrl = `${CMS_API_URL}/api/posts?limit=${limit}&where[title][contains]=${encodeURIComponent(query)}`;
    
    console.log('Search proxy forwarding to:', cmsSearchUrl);
    
    // Forward the request to the CMS API
    const response = await fetch(cmsSearchUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 10 } // Short revalidation time for search results
    });
    
    if (!response.ok) {
      console.error(`CMS search failed with status: ${response.status}`);
      return NextResponse.json(
        { error: `Failed to search posts: ${response.status} ${response.statusText}`, docs: [] },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // Return the CMS API response
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in search proxy:', error);
    return NextResponse.json(
      { error: 'Failed to search posts. Please try again later.', docs: [] },
      { status: 500 }
    );
  }
} 