import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
//import { MyPostpresqlPool } from '@/app/lib/mytest/my-postgresql';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import {loginAxios} from '@/app/lib/restfulDataUtil';


async function getUser(email: string): Promise<User | undefined> {
    //const client = await MyPostpresqlPool.connect();
    try {
        //const user = await client.query<User>(`SELECT * FROM users WHERE email='${email}'`);
        const user1 = await loginAxios<User>(`getUserByEmail/${email}`);
        //console.log(user1);
        //console.log(user1.rows[0]);
        return user1.rows[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    } finally {
        //client.release();
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;
                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (passwordsMatch) return user;
                }
                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});