import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
    title:           { type: String, required: true, trim: true },
    slug:            { type: String, required: true, unique: true, trim: true, lowercase: true },
    content:         { type: String, required: true },      // HTML content
    excerpt:         { type: String, maxlength: 300 },
    featuredImage:   { type: String },                      // Cloudinary URL
    category:        { type: String, default: 'General' },
    tags:            [{ type: String }],
    metaTitle:       { type: String, maxlength: 70 },
    metaDescription: { type: String, maxlength: 160 },
    status:          { type: String, enum: ['draft', 'published'], default: 'draft' },
    publishedAt:     { type: Date },
}, { timestamps: true });

// Auto-set publishedAt when status changes to published
BlogSchema.pre('save', function (next) {
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    next();
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
