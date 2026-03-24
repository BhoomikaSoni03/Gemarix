import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import styles from './page.module.css';
import LogoutButton from './LogoutButton';

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/admin/login');
    }

    const connectDB = (await import('@/lib/db')).default;
    const Inquiry = (await import('@/models/Inquiry')).default;

    await connectDB();

    const totalInquiries = await Inquiry.countDocuments();
    const pendingInquiries = await Inquiry.countDocuments({ status: 'Pending' });
    const recentInquiries = await Inquiry.find().sort({ createdAt: -1 }).limit(5);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Welcome back, {session.user.name}</p>
                </div>
                <LogoutButton />
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <h3>Total Inquiries</h3>
                    <p className={styles.statNumber}>{totalInquiries}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Pending Inquiries</h3>
                    <p className={styles.statNumber} style={{ color: '#d4af37' }}>{pendingInquiries}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Website Traffic</h3>
                    <p className={styles.statNumber}>1,204</p>
                    <small className={styles.mockData}>*Mock Google Analytics Vercel Data*</small>
                </div>
            </div>

            <div className={styles.tableSection}>
                <h2>Recent Inquiries</h2>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Company</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentInquiries.map((inq) => (
                                <tr key={inq._id.toString()}>
                                    <td>{new Date(inq.createdAt).toLocaleDateString()}</td>
                                    <td>{inq.customerName}</td>
                                    <td>{inq.email}</td>
                                    <td>{inq.companyName || '-'}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles[inq.status.toLowerCase()]}`}>
                                            {inq.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {recentInquiries.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No inquiries yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
