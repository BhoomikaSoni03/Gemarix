import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Inquiry from '@/models/Inquiry';

export async function GET() {
    try {
        await connectDB();

        const totalInquiries = await Inquiry.countDocuments();
        const pendingInquiries = await Inquiry.countDocuments({ status: 'Pending' });
        const contactedInquiries = await Inquiry.countDocuments({ status: 'Contacted' });
        const recentInquiries = await Inquiry.find().populate('marbleId', 'name').sort({ createdAt: -1 }).limit(10);

        const analytics = {
            total: totalInquiries,
            pending: pendingInquiries,
            contacted: contactedInquiries,
            recent: recentInquiries
        };

        return NextResponse.json({ success: true, analytics }, { status: 200 });
    } catch (error) {
        console.error('API Error /admin/analytics:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
