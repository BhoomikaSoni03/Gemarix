import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import AdminNav from './AdminNav';
import './admin.css';

export const metadata = {
    title: 'Gemarix Admin',
    description: 'Gemarix Admin Console',
};

export default async function AdminLayout({ children }) {
    const session = await getServerSession(authOptions);

    // No session — render bare (covers the login page + initial 401 state)
    if (!session) {
        return <>{children}</>;
    }

    return (
        <div className="admin-shell">
            <AdminNav userName={session.user?.name} />
            <main className="admin-main">
                {children}
            </main>
        </div>
    );
}
