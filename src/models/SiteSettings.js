import mongoose from 'mongoose';

// Singleton settings document — always has _id = 'global'
const SiteSettingsSchema = new mongoose.Schema({
    _id:                { type: String, default: 'global' },
    // WhatsApp
    whatsappNumber:     { type: String, default: '' },
    whatsappMessage:    { type: String, default: "Hi, I'm interested in your marble collection!" },
    // Google Analytics
    ga4MeasurementId:   { type: String, default: '' },
    // SEO
    seoSiteTitle:       { type: String, default: 'Gemarix — Premium Marble' },
    seoSiteDescription: { type: String, default: 'Luxury marble surfaces for discerning spaces.' },
    seoKeywords:        { type: String, default: 'marble, granite, luxury stone, interior design' },
    sitemapEnabled:     { type: Boolean, default: true },
}, { _id: false, timestamps: true });

export default mongoose.models.SiteSettings
    || mongoose.model('SiteSettings', SiteSettingsSchema);
