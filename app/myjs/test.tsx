import { MyPostpresqlPool } from '@/app/myjs/postgresql';

export default function AcmeLogo() {

  
  async function querDatabase() {

    // 连接到数据库
    const client = await MyPostpresqlPool.connect();
    try {
      // 执行查询，并等待结果
      const result = await client.query('SELECT * FROM weather');
      console.log(result.rows);
      return (
        <div
          className={`flex flex-row items-center leading-none text-white`}
        >
          {result.rows.map((a, index) => {
            return (<p key={index}>{a.city}</p>);
          })}
        </div>
      );
    } catch (error) {
      console.error(error);
    } finally {
      // 释放客户端
      client.release();
    }
  }
  return querDatabase();
}
