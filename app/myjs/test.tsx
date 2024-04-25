import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {

  const { Pool } = require('pg');
  // 配置数据库连接参数
  const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'postgres'
  });

  let testRows;
  async function querDatabase() {

    // 连接到数据库
    const client = await pool.connect();
    try {
      // 执行查询，并等待结果
      const result = await client.query('SELECT * FROM weather');
      console.log("111"); // 输出查询结果
      console.log(result.rows);
      testRows = result.rows;
    } catch (error) {
      console.error(error);
    } finally {
      // 释放客户端
      client.release();
    }
    console.log("222"); // 输出查询结果
    console.log(testRows[0].city); // 输出查询结果
    return (
      <div
        className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
      >
        <GlobeAltIcon className="h-12 w-12 rotate-[15deg]" />
        <p className="text-[44px]">
          {testRows[0].city}
  
        </p>
      </div>
    );
  }
  return querDatabase();
}
