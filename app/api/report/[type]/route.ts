import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

// Helper function to get backend URL
const getBackendUrl = () => {
  return process.env.BACKEND_URL || 'http://localhost:8000';
};

// This API route will proxy the report request to the backend
export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const reportType = params.type;
    
    // Validate report type
    const validReportTypes = ['inventory', 'usage', 'expiry', 'low-stock'];
    if (!validReportTypes.includes(reportType)) {
      return NextResponse.json({ error: `Invalid report type: ${reportType}` }, { status: 400 });
    }
    
    // Get token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('token');
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    // Get query parameters
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    // Build API URL
    const backendUrl = getBackendUrl();
    const endpoint = `/api/reports/${reportType}/?${searchParams.toString()}`;
    const fullUrl = `${backendUrl}${endpoint}`;
    
    console.log(`Proxying report request to: ${fullUrl}`);
    
    // Call backend API
    const response = await axios({
      method: 'GET',
      url: fullUrl,
      headers: {
        'Authorization': `Bearer ${token.value}`,
      },
      responseType: 'arraybuffer',
    });
    
    // Get content type from backend response
    const contentType = response.headers['content-type'];
    const contentDisposition = response.headers['content-disposition'];
    
    // Create response with appropriate headers
    return new NextResponse(response.data, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
      },
    });
  } catch (error: any) {
    console.error('Error generating report:', error);
    
    // If we have a response from the backend, pass it through
    if (error.response) {
      let errorMessage = 'Error generating report';
      
      // Try to parse error message if it's JSON
      if (error.response.data) {
        try {
          const errorData = JSON.parse(error.response.data.toString());
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If we can't parse JSON, use status text
          errorMessage = error.response.statusText || errorMessage;
        }
      }
      
      return NextResponse.json({ error: errorMessage }, { status: error.response.status });
    }
    
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
} 