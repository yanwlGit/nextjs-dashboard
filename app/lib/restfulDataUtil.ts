import axios from 'axios';
import type { RestfulData } from '@/app/lib/definitions';
import { auth } from '@/auth'

const loginUrl = process.env.LOGIN_URL;
const queryBaseUrl = process.env.PREFIX_DATA_URL_BASE;

//export async function loginAxios<R>(uname: string,pwd: string): Promise<RestfulData<R>>
export async function loginAxios<R>(uname: string, pwd: string) {
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


  // httpBasic 认证 axios只支持get方式
  return await axios.get(`${loginUrl}`, { auth: { 'username': `${uname}`, 'password': `${pwd}` } })
    .then(function (response) {
      // 处理成功情况
      //console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      // 处理错误情况
      console.log("loginAxios error---->" + error);
      throw error;
    })
    .finally(function () {
      // 总是会执行
    });
}

export async function queryAxios<R>(url: string): Promise<RestfulData<R>> {
  /*const axiosInstance = axios.create({
    baseURL: `${queryBaseUrl}${url}`,
    headers: {
      Authorization: `Bearer ${session?.user?.name}`
    }
  });*/
  const session = await auth();
  return await axios.post(`${queryBaseUrl}${url}`, JSON.stringify({ message: `hello message` }), {
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.user?.name}` }
  })
    .then(function (response) {
      // 处理成功情况
      console.log("result1---->" + response.data);
      return response.data;
    })
    .catch(function (error) {
      // 处理错误情况
      console.log("queryAxios error---->" + error);
      throw error;
    })
    .finally(function () {
      // 总是会执行
    });
}