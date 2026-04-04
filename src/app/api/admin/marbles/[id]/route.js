import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Marble from '@/models/Marble';
import { requireAdmin } from '@/lib/adminAuth';

// GET /api/admin/marbles/[id]
export async function GET(request, { params }) {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    await connectDB();
    const marble = await Marble.findById(id).lean();
    if (!marble) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ marble });
}

// PUT /api/admin/marbles/[id]
export async function PUT(request, { params }) {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    await connectDB();
    const body = await request.json();
    const marble = await Marble.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!marble) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ marble });
}

// DELETE /api/admin/marbles/[id]
export async function DELETE(request, { params }) {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    await connectDB();
    await Marble.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
}
