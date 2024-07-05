"use client"
import { useState, useEffect } from 'react'
import Navigation from '../nav'

type League = {
  _id: string,
  name: string
}

export default function Leagues() {
  const [leagues, setLeagues] = useState<League[]>([])
  const [name, setName] = useState('')

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/leagues`)
      .then(res => res.json())
      .then(data => setLeagues(data?.data))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/league`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name })
    })
    const newLeague = await res.json()
    setLeagues([...leagues, newLeague.data])
    setName('')
  }

  return (
    <div className="container mx-auto p-4 text-center">
      <Navigation />
      <h1 className="text-2xl font-bold mb-4">Leagues</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input 
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mr-2"
          placeholder="League Name"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">Add League</button>
      </form>
      <ul>
        {leagues.map(league => (
          <li key={league._id} className="border-b p-2">{league.name}</li>
        ))}
      </ul>
    </div>
  )
}
