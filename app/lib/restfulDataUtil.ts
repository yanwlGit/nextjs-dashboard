import axios from 'axios';
import type { RestfulData } from '@/app/lib/definitions';

const loginBaseUrl = process.env.PREFIX_LOGIN_URL_BASE;
const queryBaseUrl = process.env.PREFIX_DATA_URL_BASE;

export async function loginAxios<R>(url: string): Promise<RestfulData<R>> {
  /*const aa={
      message: '查询成功',
      rows: [
        {
          id: 66666,
          name: 'User',
          age: 34,
          email: 'user@nextmail.com',
          //123456
          password: '$2b$10$Z1nBz24HYEYhF0HefnBc..1BihoaJIOmtOwTCffl.PheatmW2ZC9O'
        }
      ],
      status: 1
    };

  const jsonString = JSON.stringify(aa);
  const jsonObject = JSON.parse(jsonString);
  return jsonObject;*/
  console.log(`${loginBaseUrl}${url}`);
  // 向给定ID的用户发起请求
  return await axios.post(`${loginBaseUrl}${url}`)
    .then(function (response) {
      // 处理成功情况
      //console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      // 处理错误情况
      console.log("loginAxios error---->" + error);
    })
    .finally(function () {
      // 总是会执行
    });
}

export async function queryAxios<R>(url: string): Promise<RestfulData<R>> {

  /*axios.post('/api/data', JSON.stringify({ key: 'value' }), {
    headers: { 'Content-Type': 'application/json' }
  });*/

  console.log(`${queryBaseUrl}${url}`);
  // 向给定ID的用户发起请求
  return await axios.post(`${queryBaseUrl}${url}`, JSON.stringify({ token: 'testToken' }),{
    headers: { 'Content-Type': 'application/json' }
  })
    .then(function (response) {
      // 处理成功情况
      console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      // 处理错误情况
      console.log("queryAxios error---->" + error);
    })
    .finally(function () {
      // 总是会执行
    });
}