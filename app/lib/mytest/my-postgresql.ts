import { Pool } from 'pg';
import { Weather } from './my-definitions';

import { formatDateToLocal } from '../utils';

// 配置数据库连接参数  postgres://[user]:[password]@[neon_hostname]/[dbname]
const connectionString = process.env.DATABASE_URL;
export const MyPostpresqlPool = new Pool({
    connectionString: connectionString,
    ssl: true
});
//方式2
/*export const MyPostpresqlPool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'postgres'
});*/

export async function getWeathers() {

    // 连接到数据库
    const client = await MyPostpresqlPool.connect();
    try {

        // 执行查询，并等待结果
        const data = await client.query<Weather>(`SELECT * FROM weather`);
        const weathers = data.rows.map((weather) => ({
            ...weather,
            date: formatDateToLocal(weather.date,'zh-CN'),
        }));
        return weathers;

    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch getWeathers ');
    } finally {
        // 释放客户端
        client.release();
    }

}