import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const projectId = parseInt(id);
    
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

    const { is_locked } = requestBody;

    // Validate is_locked is provided and is boolean
    if (is_locked === undefined || is_locked === null) {
      return NextResponse.json({ 
        error: "is_locked field is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (typeof is_locked !== 'boolean') {
      return NextResponse.json({ 
        error: "is_locked must be a boolean value",
        code: "INVALID_FIELD_TYPE" 
      }, { status: 400 });
    }

    // Check if only is_locked field is being updated
    const allowedFields = ['is_locked'];
    const providedFields = Object.keys(requestBody);
    const invalidFields = providedFields.filter(field => !allowedFields.includes(field));
    
    if (invalidFields.length > 0) {
      return NextResponse.json({ 
        error: `Only is_locked field can be updated. Invalid fields: ${invalidFields.join(', ')}`,
        code: "INVALID_FIELDS" 
      }, { status: 400 });
    }

    // Check if project exists
    const existingProject = await db.select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (existingProject.length === 0) {
      return NextResponse.json({ 
        error: 'Project not found',
        code: "PROJECT_NOT_FOUND" 
      }, { status: 404 });
    }

    // Update project with is_locked value and updatedAt timestamp
    const updatedProject = await db.update(projects)
      .set({
        isLocked: is_locked,
        updatedAt: new Date().toISOString()
      })
      .where(eq(projects.id, projectId))
      .returning();

    if (updatedProject.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to update project',
        code: "UPDATE_FAILED" 
      }, { status: 500 });
    }

    return NextResponse.json(updatedProject[0], { status: 200 });

  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const projectId = parseInt(id);

    // Check if project exists before deleting
    const existingProject = await db.select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (existingProject.length === 0) {
      return NextResponse.json({ 
        error: 'Project not found',
        code: "PROJECT_NOT_FOUND" 
      }, { status: 404 });
    }

    // Delete the project
    const deletedProject = await db.delete(projects)
      .where(eq(projects.id, projectId))
      .returning();

    if (deletedProject.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to delete project',
        code: "DELETE_FAILED" 
      }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Project deleted successfully',
      project: deletedProject[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}