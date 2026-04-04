import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SiteSettings from '@/models/SiteSettings';
import { requireAdmin } from '@/lib/adminAuth';

// GET /api/admin/settings
export async function GET(request) {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    await connectDB();
    let settings = await SiteSettings.findById('global').lean();
    if (!settings) {
        settings = await SiteSettings.create({ _id: 'global' });
    }
    return NextResponse.json({ settings });
}

// PUT /api/admin/settings
export async function PUT(request) {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    await connectDB();
    const body = await request.json();
    delete body._id; // Prevent _id override

    const settings = await SiteSettings.findByIdAndUpdate(
        'global',
        body,
        { new: true, upsert: true, runValidators: true }
    );
    return NextResponse.json({ settings });
}
