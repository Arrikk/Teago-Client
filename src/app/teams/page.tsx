"use client"
import { useState, useEffect } from 'react'
import Navigation from '../nav'
type League ={
    _id: string,
    name: string
}

type Team = {
  _id: string,
  name: string,
  league: League
}



export default function Teams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [name, setName] = useState('')
  const [leagueId, setLeagueId] = useState('')
  const [leagues, setLeagues] = useState<League[]>([])
  const [selectedLeagueId, setSelectedLeagueId] = useState('')

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/leagues`)
      .then(res => res.json())
      .then(data => setLeagues(data.data))
  }, [])

  useEffect(() => {
    if (selectedLeagueId) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams?league=${selectedLeagueId}`)
        .then(res => res.json())
        .then(data => setTeams(data.data))
    } else {
      setTeams([])
    }
  }, [selectedLeagueId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, leagueId })
    })
    const newTeam = await res.json()
    setTeams([...teams, newTeam.data])
    setName('')
    setLeagueId('')
  }

  return (
    <div className="container mx-auto p-4 text-center">
      <Navigation />
      <h1 className="text-2xl font-bold mb-4">Teams</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input 
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Team Name"
        />
        <select 
          value={leagueId}
          onChange={(e) => setLeagueId(e.target.value)}
          className="border p-2 mr-2"
        >
          <option value="">Select League</option>
          {leagues.map(league => (
            <option key={league._id} value={league._id}>{league.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2">Add Team</button>
      </form>

      <div className="mb-4">
        <label htmlFor="selectedLeague" className="mr-2">Filter by League:</label>
        <select
          id="selectedLeague"
          value={selectedLeagueId}
          onChange={(e) => setSelectedLeagueId(e.target.value)}
          className="border p-2"
        >
          <option value="">Select League</option>

          {leagues.map(league => (
            <option key={league._id} value={league._id}>{league.name}</option>
          ))}
        </select>
      </div>

      <ul>
        {teams.map(team => (
          <li key={team._id} className="border-b p-2">{team.name} (League: {team?.league ? team.league.name : "N/A"})</li>
        ))}
      </ul>
    </div>
  )
}
