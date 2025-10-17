import { NextRequest, NextResponse } from 'next/server';
import { getRazorpay, formatAmountForRazorpay } from '@/lib/razorpay';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { courseId, name, email, phone } = await request.json();

    // Validate input
    if (!courseId || !name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get course details
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Create enrollment record
    const enrollment = await prisma.courseEnrollment.create({
      data: {
        courseId: course.id,
        name,
        email,
        phone,
        paymentStatus: 'PENDING',
      },
    });

    // Create Razorpay order
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: formatAmountForRazorpay(course.price),
      currency: 'INR',
      receipt: `enrollment_${enrollment.id}`,
      notes: {
        enrollmentId: enrollment.id.toString(),
        courseId: course.id.toString(),
        courseName: course.title,
        studentName: name,
        studentEmail: email,
      },
    });

    // Update enrollment with Razorpay order ID
    await prisma.courseEnrollment.update({
      where: { id: enrollment.id },
      data: { paymentIntentId: order.id },
    });

    return NextResponse.json({
      orderId: order.id,
      enrollmentId: enrollment.id,
      amount: course.price,
      currency: 'INR',
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
