import Link from 'next/link'

const Homepage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">Sports Platform</h1>
      <div className="flex space-x-4">
          <Link href="/leagues" className="text-blue-500">Leagues</Link>
          <Link href="/teams" className="text-blue-500">Teams</Link>
          <Link href="/players" className="text-blue-500">Players</Link>
          <Link href="/fixtures" className="text-blue-500">Fixtures</Link>
      </div>
    </div>
  )
}

export default Homepage
