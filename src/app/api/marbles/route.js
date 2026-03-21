import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Marble from '@/models/Marble';

export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const chosenOne = searchParams.get('chosenOne');

        let query = {};
        if (chosenOne === 'true') {
            query.isChosenOne = true;
        }

        const marbles = await Marble.find(query).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, marbles }, { status: 200 });
    } catch (error) {
        console.error('API Error /marbles:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
