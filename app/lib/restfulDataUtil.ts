import axios from 'axios';
import type { User, RestfulData } from '@/app/lib/definitions';

const dataBaseUrl = process.env.PREFIX_DATA_URL_BASE;

export async function textAxios<R>(email: string): Promise<RestfulData<R>> {
    // 向给定ID的用户发起请求
    return await axios.post(`${dataBaseUrl}getUserByEmail/${email}`)
        .then(function (response) {
            // 处理成功情况
            //console.log(response.data);
            return response.data;
        })
        .catch(function (error) {
            // 处理错误情况
            console.log(error);
        })
        .finally(function () {
            // 总是会执行
        });
}