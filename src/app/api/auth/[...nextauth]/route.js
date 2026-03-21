import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Admin Login',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "admin" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (
                    credentials?.username === process.env.ADMIN_USERNAME &&
                    credentials?.password === process.env.ADMIN_PASSWORD
                ) {
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
