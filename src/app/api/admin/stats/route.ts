import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, adminActivity } from '@/db/schema';
import { sum, desc, count, gte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Calculate 24 hours ago timestamp
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Get total votes (sum of all project vote counts)
    const totalVotesResult = await db
      .select({ total: sum(projects.voteCount) })
      .from(projects);
    
    const totalVotes = totalVotesResult[0]?.total || 0;

    // Get top project (highest vote count)
    const topProjectResult = await db
      .select({
        teamName: projects.teamName,
        voteCount: projects.voteCount
      })
      .from(projects)
      .orderBy(desc(projects.voteCount))
      .limit(1);
    
    const topProject = topProjectResult.length > 0 
      ? {
          team_name: topProjectResult[0].teamName,
          vote_count: topProjectResult[0].voteCount || 0
        }
      : null;

    // Get recent activity count (last 24 hours)
    const recentActivityResult = await db
      .select({ count: count() })
      .from(adminActivity)
      .where(gte(adminActivity.timestamp, twentyFourHoursAgo));
    
    const recentActivityCount = recentActivityResult[0]?.count || 0;

    // Build stats object
    const stats = {
      total_votes: Number(totalVotes),
      top_project: topProject,
      recent_activity_count: Number(recentActivityCount)
    };

    return NextResponse.json(stats, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error,
      code: 'STATS_ERROR'
    }, { status: 500 });
  }
}