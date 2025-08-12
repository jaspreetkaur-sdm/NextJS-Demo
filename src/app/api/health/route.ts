import { NextRequest, NextResponse } from 'next/server';
import { checkDatabaseConnection } from '../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const dbHealthy = await checkDatabaseConnection();
    
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealthy ? 'healthy' : 'unhealthy',
        server: 'healthy',
      },
      version: process.env.npm_package_version || '1.0.0',
    };

    return NextResponse.json(health, {
      status: dbHealthy ? 200 : 503,
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      { status: 500 }
    );
  }
}
