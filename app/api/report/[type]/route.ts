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
    const cookieStore = await cookies();
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
  } catch (error) {
    console.error('Error generating report:', error);
    
    // Handle axios errors
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      let message = 'Error generating report';
      
      if (error.response?.data) {
        // For buffer responses
        if (error.response.data instanceof Buffer || error.response.data instanceof ArrayBuffer) {
          try {
            let text;
            if (error.response.data instanceof Buffer) {
              text = error.response.data.toString('utf-8');
            } else {
              // For ArrayBuffer
              text = Buffer.from(new Uint8Array(error.response.data)).toString('utf-8');
            }
            try {
              const json = JSON.parse(text);
              message = json.error || json.detail || message;
            } catch {
              message = text || message;
            }
          } catch {
            message = error.response.statusText || message;
          }
        } else if (typeof error.response.data === 'object') {
          // For JSON responses
          message = error.response.data.error || error.response.data.detail || message;
        }
      }
      
      return NextResponse.json({ error: message }, { status });
    }
    
    // Generic error handling
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
} 