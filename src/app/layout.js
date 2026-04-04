import './globals.css';
import CustomCursor from '@/components/ui/CustomCursor';
import Script from 'next/script';
import dbConnect from '@/lib/db';
import SiteSettings from '@/models/SiteSettings';

export async function generateMetadata() {
    try {
        await dbConnect();
        const settings = await SiteSettings.findOne({ _id: 'global' }).lean();
        if (settings) {
            return {
                title: settings.seoSiteTitle || 'Gemarix | Premium Marble Collection',
                description: settings.seoSiteDescription || 'Exclusive B2B showcase of the finest marbles worldwide.',
                keywords: settings.seoKeywords || 'marble, luxury stone, imports',
            };
        }
    } catch (error) {
        // Fallback safely if db doesn't connect
    }
    
    return {
        title: 'Gemarix | Premium Marble Collection',
        description: 'Exclusive B2B showcase of the finest marbles worldwide.',
    };
}

export default async function RootLayout({ children }) {
    let settings = null;
    try {
        await dbConnect();
        settings = await SiteSettings.findOne({ _id: 'global' }).lean();
    } catch(err) {}

    const showWhatsapp = settings?.whatsappNumber;
    const whatsappLink = showWhatsapp ? `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappMessage || 'Hi, I want to know more about Gemarix')}` : null;

    return (
        <html lang="en">
            <body>
                <CustomCursor />
                <main>{children}</main>
                
                {/* Global Floating WhatsApp Widget */}
                {showWhatsapp && (
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            position: 'fixed', bottom: 30, right: 30, zIndex: 9999,
                            background: '#25D366', color: '#fff', padding: '16px 24px',
                            borderRadius: '30px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
                            boxShadow: '0 10px 25px rgba(37,211,102,0.4)', textDecoration: 'none', transition: 'transform 0.2s ease'
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ fill: 'currentColor' }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        Chat with us
                    </a>
                )}

                {/* Global GA4 Script */}
                {settings?.ga4MeasurementId && (
                    <>
                        <Script src={`https://www.googletagmanager.com/gtag/js?id=${settings.ga4MeasurementId}`} strategy="afterInteractive" />
                        <Script id="google-analytics" strategy="afterInteractive">
                            {`
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${settings.ga4MeasurementId}');
                            `}
                        </Script>
                    </>
                )}
            </body>
        </html>
    );
}
