'use server';
import { z } from 'zod';
import { MyPostpresqlPool } from '@/app/lib/mytest/my-postgresql';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

// This is temporary until @types/react-dom is updated
export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {

    /** 
     * 如果您正在使用具有许多字段的表单，则可能需要考虑使用entries()方法与 JavaScript 的Object.fromEntries().例如：
     * const rawFormData = Object.fromEntries(formData.entries())
    */
    // Validate form using Zod
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }
    const client = await MyPostpresqlPool.connect();
    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    // Insert data into the database
    try {
        await client.query(`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES ('${customerId}', ${amountInCents}, '${status}', '${date}')
        `);
    } catch (error) {
        // If a database error occurs, return a more specific error.
        return {
            message: 'Database Error: Failed to Create Invoice.',
        };
    }
    //更新数据库后，将重新验证路径，并从服务器获取新数据
    revalidatePath('/dashboard/invoices');
    //将用户重定向回页面,不能在try块里面
    redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(
    id: string,
    prevState: State,
    formData: FormData,
) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        };
    }
    const client = await MyPostpresqlPool.connect();
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;

    try {
        await client.query(`
            UPDATE invoices
            SET customer_id = '${customerId}', amount = ${amountInCents}, status = '${status}'
            WHERE id = '${id}'
        `);
    } catch (error) {
        return { message: 'Database Error: Failed to Update Invoice.' };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
    //throw new Error('Failed to Delete Invoice');//测试错误页面
    const client = await MyPostpresqlPool.connect();
    try {
        await client.query(`DELETE FROM invoices WHERE id = '${id}'`);
        //调用以清除客户端缓存并发出新的服务器请求。revalidatePath
        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted Invoice' };
    } catch (error) {
        console.error('deleteInvoice Database Error:', error);
        return { message: 'Database Error: Failed to Delete Invoice.' };
    } finally {
        client.release();
    }
}