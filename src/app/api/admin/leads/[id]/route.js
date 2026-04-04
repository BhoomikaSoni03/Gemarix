import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Inquiry from '@/models/Inquiry';
import { requireAdmin } from '@/lib/adminAuth';

// PATCH /api/admin/leads/[id] — update status and/or notes
export async function PATCH(request, { params }) {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    await connectDB();
    const { status, notes } = await request.json();
    const update = {};
    if (status) update.status = status;
    if (notes  !== undefined) update.notes = notes;

    const lead = await Inquiry.findByIdAndUpdate(id, update, { new: true });
    if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ lead });
}

// DELETE /api/admin/leads/[id]
export async function DELETE(request, { params }) {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    await connectDB();
    await Inquiry.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
}
