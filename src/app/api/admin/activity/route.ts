import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { adminActivity } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    const results = await db.select()
      .from(adminActivity)
      .orderBy(desc(adminActivity.timestamp))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, details } = body;

    // Validation: action is required
    if (!action) {
      return NextResponse.json({ 
        error: "Action is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    // Trim action
    const trimmedAction = action.trim();
    
    if (!trimmedAction) {
      return NextResponse.json({ 
        error: "Action cannot be empty",
        code: "EMPTY_ACTION" 
      }, { status: 400 });
    }

    // Create new activity log entry
    const newActivity = await db.insert(adminActivity)
      .values({
        action: trimmedAction,
        details: details || null,
        timestamp: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newActivity[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}