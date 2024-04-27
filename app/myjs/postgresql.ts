import { Pool } from 'pg';

// 配置数据库连接参数  postgres://[user]:[password]@[neon_hostname]/[dbname]
const connectionString = 'postgres://postgres:postgres@localhost:5432?sslmode=require&sslrootcert=./app/myjs/root.crt';
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