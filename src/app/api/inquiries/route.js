import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Inquiry from '@/models/Inquiry';
import { validateEmailDomain } from '@/lib/emailValidator';
import { z } from 'zod';

const inquirySchema = z.object({
    customerName: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid email format"),
    companyName: z.string().optional(),
    marbleId: z.string().optional(),
    message: z.string().min(10, "Message is too short")
});

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();

        // 1. Format validation
        const parsedData = inquirySchema.parse(body);

        // 2. DNS MX Record validation
        const isDomainValid = await validateEmailDomain(parsedData.email);
        if (!isDomainValid) {
            return NextResponse.json(
                { error: 'Email domain is invalid or inactive. Please use a valid deliverable email.' },
                { status: 400 }
            );
        }

        // 3. Save Inquiry
        const newInquiry = new Inquiry(parsedData);
        await newInquiry.save();

        return NextResponse.json({ success: true, inquiry: newInquiry }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
        }
        console.error('API Error /inquiries:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
