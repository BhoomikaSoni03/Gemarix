import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { v2 as cloudinary } from 'cloudinary';

function getCloudinary() {
    const { CLOUDINARY_URL, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    
    // If the user provided the all-in-one URL string, let the SDK parse it automatically
    if (CLOUDINARY_URL) {
        return cloudinary;
    }
    
    // Otherwise fallback to individual keys
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
        return null; // Signals the UI that Cloudinary isn't configured yet
    }
    
    cloudinary.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key:    CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
    });
    return cloudinary;
}

// GET /api/admin/media — list images in gemarix/ folder
export async function GET(request) {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const cld = getCloudinary();
    if (!cld) {
        return NextResponse.json({ configured: false, resources: [] });
    }

    const result = await cld.api.resources({
        type: 'upload',
        prefix: 'gemarix',
        max_results: 200,
        resource_type: 'image',
    });

    return NextResponse.json({
        configured: true,
        resources: result.resources.map(r => ({
            publicId:   r.public_id,
            url:        r.secure_url,
            format:     r.format,
            width:      r.width,
            height:     r.height,
            bytes:      r.bytes,
            createdAt:  r.created_at,
        })),
    });
}

// POST /api/admin/media — upload image (multipart/form-data)
export async function POST(request) {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const cld = getCloudinary();
    if (!cld) {
        return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 503 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    const result = await cld.uploader.upload(base64, {
        folder:         'gemarix',
        transformation: [{ quality: 'auto', fetch_format: 'webp' }],
        use_filename:    true,
        unique_filename: true,
    });

    return NextResponse.json({
        publicId: result.public_id,
        url:      result.secure_url,
        format:   result.format,
        width:    result.width,
        height:   result.height,
        bytes:    result.bytes,
    }, { status: 201 });
}

// DELETE /api/admin/media — delete by publicId
export async function DELETE(request) {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const cld = getCloudinary();
    if (!cld) return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 503 });

    const { publicIds } = await request.json();
    if (!publicIds?.length) return NextResponse.json({ error: 'No publicIds provided' }, { status: 400 });

    const results = await Promise.all(
        publicIds.map(id => cld.uploader.destroy(id))
    );

    return NextResponse.json({ deleted: results.filter(r => r.result === 'ok').length });
}
