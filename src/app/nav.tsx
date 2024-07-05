import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="mb-4">
      <Link href="/fixtures" className="mr-4">Fixtures</Link>
      <Link href="/teams" className="mr-4">Teams</Link>
      <Link href="/leagues" className="mr-4">Leagues</Link>
      <Link href="/players" className="mr-4">Players</Link>
    </nav>
  );
}
