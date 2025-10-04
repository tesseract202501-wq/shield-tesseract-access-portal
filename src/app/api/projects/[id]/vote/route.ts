import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, votes, systemState } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');

    // Validate project ID
    if (!projectId || isNaN(parseInt(projectId))) {
      return NextResponse.json({
        error: "Valid project ID is required",
        code: "INVALID_PROJECT_ID"
      }, { status: 400 });
    }

    // Parse request body
    let requestBody;
    try {
      requestBody = await request.json();
    } catch {
      return NextResponse.json({
        error: "Invalid JSON in request body",
        code: "INVALID_JSON"
      }, { status: 400 });
    }

    const { voter_identifier } = requestBody;

    // Validate voter identifier
    if (!voter_identifier || typeof voter_identifier !== 'string' || voter_identifier.trim() === '') {
      return NextResponse.json({
        error: "Valid voter_identifier is required",
        code: "MISSING_VOTER_IDENTIFIER"
      }, { status: 400 });
    }

    const sanitizedVoterIdentifier = voter_identifier.trim();

    // Execute transaction for data consistency
    const result = await db.transaction(async (tx) => {
      // Check system state
      const systemStateRecord = await tx.select()
        .from(systemState)
        .limit(1);

      if (systemStateRecord.length === 0) {
        throw new Error('SYSTEM_STATE_NOT_FOUND');
      }

      const state = systemStateRecord[0];
      
      if (!state.votingEnabled) {
        throw new Error('VOTING_DISABLED');
      }

      if (state.emergencyLockdown) {
        throw new Error('EMERGENCY_LOCKDOWN');
      }

      // Check if project exists and is not locked
      const project = await tx.select()
        .from(projects)
        .where(eq(projects.id, parseInt(projectId)))
        .limit(1);

      if (project.length === 0) {
        throw new Error('PROJECT_NOT_FOUND');
      }

      if (project[0].isLocked) {
        throw new Error('PROJECT_LOCKED');
      }

      // Check for duplicate vote
      const existingVote = await tx.select()
        .from(votes)
        .where(and(
          eq(votes.projectId, parseInt(projectId)),
          eq(votes.voterIdentifier, sanitizedVoterIdentifier)
        ))
        .limit(1);

      if (existingVote.length > 0) {
        throw new Error('DUPLICATE_VOTE');
      }

      // Create vote record
      const votedAt = new Date().toISOString();
      const newVote = await tx.insert(votes)
        .values({
          projectId: parseInt(projectId),
          voterIdentifier: sanitizedVoterIdentifier,
          votedAt
        })
        .returning();

      // Increment project vote count
      const updatedProject = await tx.update(projects)
        .set({
          voteCount: project[0].voteCount + 1,
          updatedAt: new Date().toISOString()
        })
        .where(eq(projects.id, parseInt(projectId)))
        .returning();

      return {
        vote: newVote[0],
        project: updatedProject[0]
      };
    });

    return NextResponse.json({
      message: "Vote cast successfully",
      vote: {
        id: result.vote.id,
        projectId: result.vote.projectId,
        voterIdentifier: result.vote.voterIdentifier,
        votedAt: result.vote.votedAt
      },
      project: {
        id: result.project.id,
        teamName: result.project.teamName,
        voteCount: result.project.voteCount
      }
    }, { status: 201 });

  } catch (error) {
    console.error('POST vote error:', error);

    // Handle specific transaction errors
    if (error instanceof Error) {
      switch (error.message) {
        case 'PROJECT_NOT_FOUND':
          return NextResponse.json({
            error: "Project not found",
            code: "PROJECT_NOT_FOUND"
          }, { status: 404 });

        case 'PROJECT_LOCKED':
          return NextResponse.json({
            error: "Project is locked and cannot receive votes",
            code: "PROJECT_LOCKED"
          }, { status: 403 });

        case 'VOTING_DISABLED':
          return NextResponse.json({
            error: "Voting is currently disabled",
            code: "VOTING_DISABLED"
          }, { status: 403 });

        case 'EMERGENCY_LOCKDOWN':
          return NextResponse.json({
            error: "Emergency lockdown is active - voting is disabled",
            code: "EMERGENCY_LOCKDOWN"
          }, { status: 403 });

        case 'DUPLICATE_VOTE':
          return NextResponse.json({
            error: "Voter has already voted for this project",
            code: "DUPLICATE_VOTE"
          }, { status: 409 });

        case 'SYSTEM_STATE_NOT_FOUND':
          return NextResponse.json({
            error: "System state configuration not found",
            code: "SYSTEM_STATE_NOT_FOUND"
          }, { status: 500 });
      }
    }

    return NextResponse.json({
      error: 'Internal server error: ' + error
    }, { status: 500 });
  }
}