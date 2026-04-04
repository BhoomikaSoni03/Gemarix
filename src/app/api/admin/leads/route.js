import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Inquiry from '@/models/Inquiry';
import { requireAdmin } from '@/lib/adminAuth';

// GET /api/admin/leads — paginated list + optional CSV export
export async function GET(request) {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    await connectDB();
    const { searchParams } = request.nextUrl;
    const isCSV   = searchParams.get('export') === 'csv';
    const status  = searchParams.get('status');
    const page    = parseInt(searchParams.get('page') || '1');
    const limit   = parseInt(searchParams.get('limit') || '25');

    const query = status && status !== 'all' ? { status } : {};
    const leads = await Inquiry.find(query)
        .sort({ createdAt: -1 })
        .skip(isCSV ? 0 : (page - 1) * limit)
        .limit(isCSV ? 10000 : limit)
        .lean();

    if (isCSV) {
        const headers = ['Date', 'Name', 'Email', 'Phone', 'Company', 'Product', 'Source', 'Status', 'Message'];
        const rows = leads.map(l => [
            new Date(l.createdAt).toLocaleDateString(),
            l.customerName,
            l.email,
            l.phone || '',
            l.companyName || '',
            l.interestedProduct || '',
            l.source || 'Form',
            l.status,
            (l.message || '').replace(/"/g, '""'),
        ].map(v => `"${v}"`).join(','));

        const csv = [headers.join(','), ...rows].join('\n');
        return new Response(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="gemarix-leads-${Date.now()}.csv"`,
            },
        });
    }

    const total = await Inquiry.countDocuments(query);
    return NextResponse.json({ leads, total, page, pages: Math.ceil(total / limit) });
}
