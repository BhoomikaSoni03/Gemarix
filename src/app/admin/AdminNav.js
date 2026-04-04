'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
    LayoutDashboard,
    Image,
    Gem,
    FileText,
    Users,
    Settings,
    LogOut,
    ChevronRight,
} from 'lucide-react';

const NAV_SECTIONS = [
    {
        label: 'Overview',
        items: [
            { href: '/admin',    label: 'Dashboard',      icon: LayoutDashboard },
        ],
    },
    {
        label: 'Content',
        items: [
            { href: '/admin/marbles', label: 'Marble Inventory', icon: Gem },
            { href: '/admin/blogs',   label: 'Blog & CMS',       icon: FileText },
            { href: '/admin/media',   label: 'Media Library',    icon: Image },
        ],
    },
    {
        label: 'Business',
        items: [
            { href: '/admin/leads',    label: 'Lead CRM',         icon: Users },
            { href: '/admin/settings', label: 'Integrations',     icon: Settings },
        ],
    },
];

export default function AdminNav({ userName }) {
    const pathname = usePathname();
    const router   = useRouter();

    const isActive = (href) =>
        href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/admin/login' });
    };

    const initials = (userName || 'A')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <aside className="admin-sidebar">
            {/* Logo */}
            <div className="admin-logo">
                <div className="admin-logo-text">Gemarix</div>
                <div className="admin-logo-sub">Admin Console</div>
            </div>

            {/* Navigation */}
            <nav className="admin-nav">
                {NAV_SECTIONS.map((section) => (
                    <div key={section.label}>
                        <div className="admin-nav-section">{section.label}</div>
                        {section.items.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`admin-nav-link${isActive(href) ? ' active' : ''}`}
                            >
                                <Icon />
                                <span style={{ flex: 1 }}>{label}</span>
                                {isActive(href) && <ChevronRight style={{ width: 14, height: 14, opacity: 0.5 }} />}
                            </Link>
                        ))}
                    </div>
                ))}
            </nav>

            {/* Bottom: user + logout */}
            <div className="admin-nav-bottom">
                <div className="admin-nav-user">
                    <div className="admin-nav-avatar">{initials}</div>
                    <div>
                        <div className="admin-nav-username">{userName || 'Admin'}</div>
                        <div className="admin-nav-role">Administrator</div>
                    </div>
                </div>
                <button onClick={handleLogout} className="admin-nav-link" style={{ color: 'var(--a-red)' }}>
                    <LogOut />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
