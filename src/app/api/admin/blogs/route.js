import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import { requireAdmin } from '@/lib/adminAuth';

// GET /api/admin/blogs — paginated list with optional status filter
export async function GET(request) {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    await connectDB();
    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status');
    const page   = parseInt(searchParams.get('page') || '1');
    const limit  = parseInt(searchParams.get('limit') || '20');

    const query = status ? { status } : {};
    const [blogs, total] = await Promise.all([
        Blog.find(query)
            .sort({ updatedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .select('title slug category status publishedAt createdAt updatedAt')
            .lean(),
        Blog.countDocuments(query),
    ]);

    return NextResponse.json({ blogs, total, page, pages: Math.ceil(total / limit) });
}

// POST /api/admin/blogs — create blog
export async function POST(request) {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    await connectDB();
    const body = await request.json();

    // Auto-generate slug from title if not provided
    if (!body.slug && body.title) {
        body.slug = body.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    const blog = await Blog.create(body);
    return NextResponse.json({ blog }, { status: 201 });
}
