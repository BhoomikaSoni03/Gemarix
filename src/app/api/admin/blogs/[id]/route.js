import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import { requireAdmin } from '@/lib/adminAuth';

// GET /api/admin/blogs/[id]
export async function GET(request, { params }) {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    await connectDB();
    const blog = await Blog.findById(id).lean();
    if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ blog });
}

// PUT /api/admin/blogs/[id]
export async function PUT(request, { params }) {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    await connectDB();
    const body = await request.json();
    const blog = await Blog.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ blog });
}

// DELETE /api/admin/blogs/[id]
export async function DELETE(request, { params }) {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    await connectDB();
    await Blog.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
}
