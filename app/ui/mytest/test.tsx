import { Weather } from '@/app/lib/mytest/my-definitions';

export  function Weathers({ weathers, }: { weathers: Weather[] }) {

  if (!weathers || weathers.length == 0) {
    return (
      <div className={`mb-4 text-xl`}>
        No data available.
      </div>
    );
  }
  //console.log(result.rows);
  return (
    <div className={`mb-1 text-xl`}>
      
      {weathers.map((a) => {
        return (<p key={a.city}>{a.city}  {a.temp_hi} {a.date} </p>);
      })}
      
    </div>
  );
}
