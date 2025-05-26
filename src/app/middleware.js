import { NextResponse } from 'next/server';

const corsOptions = {
  allowedMethods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedOrigins: ['*'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type'],
  maxAge: '86400',
  credentials: 'true',
};

export const middleware = async (request) => {
  const response = NextResponse.next();
  
  const origin = request.headers.get('origin') ?? '';
  
if (corsOptions.allowedOrigins.includes('*') || !origin || corsOptions.allowedOrigins.includes(origin)) {
  response.headers.set('Access-Control-Allow-Origin', origin || '*');
}


  response.headers.set('Access-Control-Allow-Credentials', corsOptions.credentials);
  response.headers.set('Access-Control-Allow-Methods', corsOptions.allowedMethods.join(','));
  response.headers.set('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','));
  response.headers.set('Access-Control-Expose-Headers', corsOptions.exposedHeaders.join(','));
  response.headers.set('Access-Control-Max-Age', corsOptions.maxAge);
  response.headers.set('Content-Type', 'application/json'); 


  return response;
};

export const config = {
  matcher: '/:path*',
};