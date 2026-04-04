import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Inquiry from '@/models/Inquiry';
import { validateEmailDomain } from '@/lib/emailValidator';
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// --- Simple in-memory rate limiter (per IP, max 5 submissions per 60s) ---
const rateLimitMap = new Map();

function isRateLimited(ip) {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 5;

    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, { count: 1, start: now });
        return false;
    }

    const entry = rateLimitMap.get(ip);
    if (now - entry.start > windowMs) {
        rateLimitMap.set(ip, { count: 1, start: now });
        return false;
    }

    if (entry.count >= maxRequests) {
        return true; // rate limited
    }

    entry.count++;
    return false;
}
// -------------------------------------------------------------------------

const inquirySchema = z.object({
    customerName: z.string().min(2, "Name is too short").max(100),
    email: z.string().email("Invalid email format").max(254),
    companyName: z.string().max(200).optional(),
    marbleId: z.string().optional(),
    message: z.string().min(10, "Message is too short").max(2000)
});

export async function POST(request) {
    try {
        // 1. Rate limiting
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: 'Too many requests. Please wait a minute and try again.' },
                { status: 429 }
            );
        }

        await connectDB();
        const body = await request.json();

        // 2. Format validation
        const parsedData = inquirySchema.parse(body);

        // 3. Sanitize inputs to prevent stored XSS
        parsedData.customerName = DOMPurify.sanitize(parsedData.customerName);
        parsedData.message = DOMPurify.sanitize(parsedData.message);
        if (parsedData.companyName) {
            parsedData.companyName = DOMPurify.sanitize(parsedData.companyName);
        }

        // 4. DNS MX Record validation
        const isDomainValid = await validateEmailDomain(parsedData.email);
        if (!isDomainValid) {
            return NextResponse.json(
                { error: 'Email domain is invalid or inactive. Please use a valid deliverable email.' },
                { status: 400 }
            );
        }

        // 5. Save Inquiry
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
