import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

/**
 * Use at the top of protected API route handlers.
 * Returns { session } on success, or a 401 NextResponse on failure.
 *
 * @example
 * const auth = await requireAdmin();
 * if (auth instanceof NextResponse) return auth;
 * const { session } = auth;
 */
export async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return { session };
}
