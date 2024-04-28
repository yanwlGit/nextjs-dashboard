import { Weathers } from '@/app/ui/mytest/test';
import { getWeathers } from '@/app/lib/mytest/my-postgresql';

export default async function Page() {
    const weathers = await getWeathers();

    return (
        <main>
            <h1 className={`mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {<Weathers weathers={weathers} />}
            </div>
        </main>
    );
}