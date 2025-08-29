import Link from "next/link";
import { countries } from "@/lib/data";

export const metadata = { title: "EU Debt Map – Countries" };

export default function CountriesPage(){
  const rows = Object.values(countries).sort((a,b)=> a.name.localeCompare(b.name));
  return (
    <main className="container">
      <div className="card">
        <h1>All Countries</h1>
        <table className="table">
          <thead><tr><th>Code</th><th>Country</th><th style={{textAlign:"right"}}>Latest (€)</th></tr></thead>
          <tbody>
            {rows.map(c=> (
              <tr key={c.code2}>
                <td>{c.code2}</td>
                <td><Link href={`/country/${c.code2}`}>{c.name}</Link></td>
                <td style={{textAlign:"right"}}>{Math.round(c.last_value_eur).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
