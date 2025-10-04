import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/courses - Get all courses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const where = category && category !== 'all' 
      ? { category, published: true }
      : { published: true };
    
    const courses = await prisma.course.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        curriculum: {
          orderBy: { order: 'asc' },
        },
      },
    });
    
    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create a new course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, 
      description, 
      price, 
      duration, 
      level, 
      category,
      image,
      featured,
      curriculum,
    } = body;
    
    if (!title || !description || !price || !duration || !level || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const course = await prisma.course.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        duration,
        level,
        category,
        image: image || null,
        featured: featured || false,
        curriculum: {
          create: curriculum?.map((item: { title: string; duration: string }, index: number) => ({
            title: item.title,
            duration: item.duration,
            order: index + 1,
          })) || [],
        },
      },
      include: {
        curriculum: true,
      },
    });
    
    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}

