import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { systemState } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Get current system state
    const currentState = await db.select()
      .from(systemState)
      .limit(1);

    // If no system state exists, create default record
    if (currentState.length === 0) {
      const defaultState = await db.insert(systemState)
        .values({
          votingEnabled: false,
          emergencyLockdown: false,
          updatedAt: new Date().toISOString()
        })
        .returning();

      return NextResponse.json(defaultState[0], { status: 200 });
    }

    return NextResponse.json(currentState[0], { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { voting_enabled, emergency_lockdown } = body;

    // Build update object with only provided fields
    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    if (voting_enabled !== undefined) {
      if (typeof voting_enabled !== 'boolean') {
        return NextResponse.json({ 
          error: "voting_enabled must be a boolean",
          code: "INVALID_TYPE" 
        }, { status: 400 });
      }
      updates.votingEnabled = voting_enabled;
    }

    if (emergency_lockdown !== undefined) {
      if (typeof emergency_lockdown !== 'boolean') {
        return NextResponse.json({ 
          error: "emergency_lockdown must be a boolean",
          code: "INVALID_TYPE" 
        }, { status: 400 });
      }
      updates.emergencyLockdown = emergency_lockdown;
    }

    // Get current system state to ensure it exists
    const currentState = await db.select()
      .from(systemState)
      .limit(1);

    let updatedState;

    if (currentState.length === 0) {
      // Create new system state with updates
      updatedState = await db.insert(systemState)
        .values({
          votingEnabled: updates.votingEnabled ?? false,
          emergencyLockdown: updates.emergencyLockdown ?? false,
          updatedAt: updates.updatedAt
        })
        .returning();
    } else {
      // Update existing system state
      updatedState = await db.update(systemState)
        .set(updates)
        .where(eq(systemState.id, currentState[0].id))
        .returning();
    }

    if (updatedState.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to update system state',
        code: "UPDATE_FAILED" 
      }, { status: 500 });
    }

    return NextResponse.json(updatedState[0], { status: 200 });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}