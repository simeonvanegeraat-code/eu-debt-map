import Link from "next/link";
export default function Header(){
  return (
    <header className="header container">
      <Link href="/" className="brand">EU Debt Map</Link>
      <nav className="nav">
        <Link href="/countries">Countries</Link>
        <Link href="/about">About</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </header>
  );
}
