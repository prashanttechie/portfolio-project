import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, technologies, githubUrl, liveUrl, imageUrl, featured } = await request.json();

    if (!title || !description || !technologies || !Array.isArray(technologies)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        technologies,
        githubUrl: githubUrl || null,
        liveUrl: liveUrl || null,
        imageUrl: imageUrl || null,
        featured: featured || false,
      },
    });

    return NextResponse.json({ project: newProject, message: 'Project created successfully!' }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

