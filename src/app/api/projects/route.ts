import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq, like, and, or, desc, asc, count } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // Single project fetch
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }
      
      const project = await db.select()
        .from(projects)
        .where(eq(projects.id, parseInt(id)))
        .limit(1);
      
      if (project.length === 0) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      
      return NextResponse.json(project[0]);
    }
    
    // List projects with filters
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const isLocked = searchParams.get('is_locked');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    
    let query = db.select().from(projects);
    let conditions = [];
    
    // Search filter
    if (search) {
      conditions.push(like(projects.teamName, `%${search}%`));
    }
    
    // is_locked filter
    if (isLocked !== null) {
      if (isLocked === 'true') {
        conditions.push(eq(projects.isLocked, true));
      } else if (isLocked === 'false') {
        conditions.push(eq(projects.isLocked, false));
      }
    }
    
    // Apply filters
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Apply sorting
    const sortColumn = sort === 'teamName' ? projects.teamName :
                      sort === 'voteCount' ? projects.voteCount :
                      sort === 'updatedAt' ? projects.updatedAt :
                      projects.createdAt;
    
    query = query.orderBy(order === 'asc' ? asc(sortColumn) : desc(sortColumn));
    query = query.limit(limit).offset(offset);
    
    const results = await query;
    
    return NextResponse.json(results);
    
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { team_name, description, demo_url } = requestBody;
    
    // Validation
    if (!team_name) {
      return NextResponse.json({ 
        error: "team_name is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }
    
    // Sanitize inputs
    const sanitizedTeamName = team_name.toString().trim();
    const sanitizedDescription = description ? description.toString().trim() : null;
    const sanitizedDemoUrl = demo_url ? demo_url.toString().trim() : null;
    
    if (!sanitizedTeamName) {
      return NextResponse.json({ 
        error: "team_name cannot be empty",
        code: "INVALID_TEAM_NAME" 
      }, { status: 400 });
    }
    
    // Create project with defaults
    const insertData = {
      teamName: sanitizedTeamName,
      description: sanitizedDescription,
      demoUrl: sanitizedDemoUrl,
      isLocked: true,
      voteCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const newProject = await db.insert(projects)
      .values(insertData)
      .returning();
    
    return NextResponse.json(newProject[0], { status: 201 });
    
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }
    
    const requestBody = await request.json();
    const { team_name, description, demo_url, is_locked, vote_count } = requestBody;
    
    // Check if project exists
    const existingProject = await db.select()
      .from(projects)
      .where(eq(projects.id, parseInt(id)))
      .limit(1);
    
    if (existingProject.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Build update object
    const updates: any = {
      updatedAt: new Date().toISOString()
    };
    
    if (team_name !== undefined) {
      const sanitizedTeamName = team_name.toString().trim();
      if (!sanitizedTeamName) {
        return NextResponse.json({ 
          error: "team_name cannot be empty",
          code: "INVALID_TEAM_NAME" 
        }, { status: 400 });
      }
      updates.teamName = sanitizedTeamName;
    }
    
    if (description !== undefined) {
      updates.description = description ? description.toString().trim() : null;
    }
    
    if (demo_url !== undefined) {
      updates.demoUrl = demo_url ? demo_url.toString().trim() : null;
    }
    
    if (is_locked !== undefined) {
      updates.isLocked = Boolean(is_locked);
    }
    
    if (vote_count !== undefined) {
      if (isNaN(parseInt(vote_count)) || parseInt(vote_count) < 0) {
        return NextResponse.json({ 
          error: "vote_count must be a non-negative number",
          code: "INVALID_VOTE_COUNT" 
        }, { status: 400 });
      }
      updates.voteCount = parseInt(vote_count);
    }
    
    const updated = await db.update(projects)
      .set(updates)
      .where(eq(projects.id, parseInt(id)))
      .returning();
    
    return NextResponse.json(updated[0]);
    
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }
    
    // Check if project exists
    const existingProject = await db.select()
      .from(projects)
      .where(eq(projects.id, parseInt(id)))
      .limit(1);
    
    if (existingProject.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    const deleted = await db.delete(projects)
      .where(eq(projects.id, parseInt(id)))
      .returning();
    
    return NextResponse.json({
      message: 'Project deleted successfully',
      deleted: deleted[0]
    });
    
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}