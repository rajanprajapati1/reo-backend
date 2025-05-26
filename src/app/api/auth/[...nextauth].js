import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongoose-adapter';
import mongoose from 'mongoose';
import User from '@/models/User';

const MONGODB_URI = process.env.MONGODB_URI;

const clientPromise = mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'GoogleMobile',
            credentials: {
                idToken: { label: "Google ID Token", type: "text" },
            },
            async authorize(credentials) {
                const { idToken } = credentials;

                const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
                const googleUser = await res.json();

                if (!googleUser || !googleUser.email_verified) return null;

                let user = await User.findOne({ email: googleUser.email });
                if (!user) {
                    user = await User.create({
                        email: googleUser.email,
                        name: googleUser.name,
                        image: googleUser.picture,
                    });
                }

                return {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                };
            }
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
});
