import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
//import { MyPostpresqlPool } from '@/app/lib/mytest/my-postgresql';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import {loginAxios} from '@/app/lib/restfulDataUtil';

async function getUser(uname: string,pwd: string): Promise<User | undefined> {
    //const client = await MyPostpresqlPool.connect();
    try {
        //const user = await client.query<User>(`SELECT * FROM users WHERE email='${email}'`);
        const token = await loginAxios<User>(uname,pwd);
        //console.log(token);
        //console.log(user1.rows[0]);
        //next-auth 后续会使用到Id,后端直接返回token不可直接使用，转换为user 类型
        const user={  
            id: token,
            name: token,//session 中无法获取Id
            email: "",
            password: ""
        };
        return user;
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
                    .object({ username: z.string().min(2), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { username, password } = parsedCredentials.data;
                    const user = await getUser(username,password);
                    if (!user) return null;
                    //const passwordsMatch = await bcrypt.compare(password, user.password);
                    //if (passwordsMatch) return user;
                    return user;
                }
                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
})