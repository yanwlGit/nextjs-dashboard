'use server';
import { z } from 'zod';
import { MyPostpresqlPool } from '@/app/lib/mytest/my-postgresql';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});
const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {

    /** 
     * 如果您正在使用具有许多字段的表单，则可能需要考虑使用entries()方法与 JavaScript 的Object.fromEntries().例如：
     * const rawFormData = Object.fromEntries(formData.entries())
    */
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount * 100;//数据库已分为单位
    const date = new Date().toISOString().split('T')[0];
    const client = await MyPostpresqlPool.connect();
    try {
        await client.query(`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES ('${customerId}', ${amountInCents}, '${status}', '${date}')
        `);
    } catch (error) {
        console.error('CreateInvoice Database Error:', error);
        throw new Error('Failed to CreateInvoice.');
    } finally {
        client.release();
    }
    //更新数据库后，将重新验证路径，并从服务器获取新数据
    revalidatePath('/dashboard/invoices');
    //将用户重定向回页面,不能在try块里面
    redirect('/dashboard/invoices');
}