'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
//服务端组件
import { logout } from "@/app/lib/logout";

function testIfElse() {
    let content = true;
    return (
        <div>
            {/*if else*/}
            {content ? (
                <button>重新登录</button>
            ) : (
                <div></div>
            )}

            {/*不需要else*/}
            {content &&
                <button> 重新登录</button>
            }
        </div>
    )
}



export default function Error({
    error,
    reset
}: {
    error: Error & { digest?: string };
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    const router = useRouter();
    let content = false;
    let errorMessage=error.message;
    if(error.message.includes("status code 401")){
        content=true;
        errorMessage="登录已过期，请重新登录";
    }

    return (
        <div>
            <h2>发生错误: </h2>
            <div className="ml-4 mt-9 ">{errorMessage}</div>
            <button
                className="mt-10 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400 mr-5"
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
            >
                再次尝试
            </button>
            {content && 
                <button
                    className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
                    onClick={() => {
                        logout();
                    }}
                >
                    重新登录
                </button>
            }
        </div>
    )
}