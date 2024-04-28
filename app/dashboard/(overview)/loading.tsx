/**
 * 固定名称，流式加载，数据不影响UI展示
 * 路由规则 参考 https://nextjs.org/docs/app/building-your-application/routing/route-groups
 * dashboard 下的 loading.tsx 不放在（overview）下，会自动适用下级子目录
 * (overview)子适用于当前，不会影响路径访问
*/
import DashboardSkeleton from '@/app/ui/skeletons';
export default function Loading() {
    return <DashboardSkeleton />;
}