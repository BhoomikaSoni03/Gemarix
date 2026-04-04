import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Marble from '@/models/Marble';
import { requireAdmin } from '@/lib/adminAuth';

// GET /api/admin/marbles
export async function GET(request) {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    await connectDB();
    const { searchParams } = request.nextUrl;
    const category = searchParams.get('category');
    const query = category ? { category } : {};

    const marbles = await Marble.find(query)
        .sort({ createdAt: -1 })
        .select('-reviews')
        .lean();

    return NextResponse.json({ marbles });
}

// POST /api/admin/marbles — create marble
export async function POST(request) {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    await connectDB();
    const body = await request.json();
    const marble = await Marble.create(body);
    return NextResponse.json({ marble }, { status: 201 });
}

// PATCH /api/admin/marbles — bulk price update
// Body: { ids: [...], priceRetail?, priceBulk? }
export async function PATCH(request) {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    await connectDB();
    const { ids, priceRetail, priceBulk } = await request.json();
    if (!ids?.length) return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });

    const update = {};
    if (priceRetail !== undefined) update.priceRetail = priceRetail;
    if (priceBulk   !== undefined) update.priceBulk   = priceBulk;

    const result = await Marble.updateMany({ _id: { $in: ids } }, update);
    return NextResponse.json({ modified: result.modifiedCount });
}
