import dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);

export async function validateEmailDomain(email) {
    try {
        const domain = email.split('@')[1];
        if (!domain) return false;

        const mxRecords = await resolveMx(domain);
        return mxRecords && mxRecords.length > 0;
    } catch (error) {
        console.error(`Email validation error for ${email}:`, error.message);
        return false; // Domain doesn't have MX records or doesn't exist
    }
}
