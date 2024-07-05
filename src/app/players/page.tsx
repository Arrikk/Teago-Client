"use client"
import { useState, useEffect } from 'react';
import Navigation from '../nav';
type Player = {
  _id: string,
  name: string,
  team: Team
}

type Team = {
  _id: string,
  name: string,
  league: League
}

type League = {
  _id: string,
  name: string
}

export default function Players() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [name, setName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/leagues`)
      .then(res => res.json())
      .then(data => setLeagues(data.data));
  }, []);

  useEffect(() => {
    if (selectedLeagueId) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams?league=${selectedLeagueId}`)
        .then(res => res.json())
        .then(data => setTeams(data.data));
    } else {
      setTeams([]);
    }
  }, [selectedLeagueId]);

  useEffect(() => {
    if (teamId) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/players?team=${teamId}`)
        .then(res => res.json())
        .then(data => setPlayers(data.data));
    } else {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/players`)
        .then(res => res.json())
        .then(data => setPlayers(data.data));
    }
  }, [teamId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/player`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, teamId })
    });
    const newPlayer = await res.json();
    setPlayers([...players, newPlayer.data]);
    setName('');
    setTeamId('');
  }

  return (
    <div className="container mx-auto p-4 text-center">
      <Navigation />
      <h1 className="text-2xl font-bold mb-4">Players</h1>
      <form onSubmit={handleSubmit} className="mb-4 flex justify-center items-center space-x-2">
        <input 
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Player Name"
        />
        <select 
          value={selectedLeagueId}
          onChange={(e) => setSelectedLeagueId(e.target.value)}
          className="border p-2 mr-2"
        >
          <option value="">Select League</option>
          {leagues.map(league => (
            <option key={league._id} value={league._id}>{league.name}</option>
          ))}
        </select>
        <select 
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          className="border p-2 mr-2"
        >
          <option value="">Select Team</option>
          {teams.map(team => (
            <option key={team._id} value={team._id}>{team.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2">Add Player</button>
      </form>

      <div className="mb-4 flex justify-center items-center space-x-2">
        <label htmlFor="selectedLeague" className="mr-2">Filter by League:</label>
        <select 
          id="selectedLeague"
          value={selectedLeagueId}
          onChange={(e) => setSelectedLeagueId(e.target.value)}
          className="border p-2 mr-2"
        >
          <option value="">Select League</option>
          {leagues.map(league => (
            <option key={league._id} value={league._id}>{league.name}</option>
          ))}
        </select>
        <label htmlFor="selectedTeam" className="mr-2">Filter by Team:</label>
        <select
          id="selectedTeam"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
          className="border p-2"
        >
          <option value="">Select Team</option>
          {teams.map(team => (
            <option key={team._id} value={team._id}>{team.name}</option>
          ))}
        </select>
      </div>

      <ul className="space-y-4">
        {players.map(player => (
          <li key={player._id} className="border p-2 rounded shadow">
            {player.name} (Team: {player.team.name})
          </li>
        ))}
      </ul>
    </div>
  );
}
