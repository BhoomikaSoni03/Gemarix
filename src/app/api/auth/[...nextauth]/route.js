import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Admin Login',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const validUser = process.env.ADMIN_USERNAME;
                const validPassHash = process.env.ADMIN_PASSWORD_HASH;

                console.log('--- AUTH ATTEMPT ---');
                console.log('Valid User in Env:', validUser ? 'SET' : 'MISSING');
                console.log('Incoming User:', credentials?.username);

                // Hard-fail if env vars are not configured — never fall back to defaults
                if (!validUser || !validPassHash) {
                    console.error('ADMIN_USERNAME or ADMIN_PASSWORD_HASH is not set in environment variables.');
                    return null;
                }

                const isUsernameMatch = credentials?.username?.trim() === validUser.trim();
                const isPasswordMatch = credentials?.password
                    ? await bcrypt.compare(credentials.password.trim(), validPassHash.trim())
                    : false;

                console.log('User Match:', isUsernameMatch);
                console.log('Pass Match:', isPasswordMatch);

                if (isUsernameMatch && isPasswordMatch) {
                    return { id: 1, name: 'Admin', email: 'admin@gemarix.com' };
                }
                return null;
            }
        })
    ],
    session: { strategy: 'jwt' },
    pages: {
        signIn: '/admin/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.role = 'admin';
            return token;
        },
        async session({ session, token }) {
            session.user.role = token.role;
            return session;
        }
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
