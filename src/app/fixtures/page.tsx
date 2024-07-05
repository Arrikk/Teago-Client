"use client"
import { useState, useEffect } from 'react';
import Navigation from '../nav';

type Team = {
  _id: string,
  name: string
}

type League = {
  _id: string,
  name: string
}

type Fixture = {
  _id: string,
  homeTeam: Team,
  awayTeam: Team,
  date: string,
  homeTeamGoals: number,
  awayTeamGoals: number
}

export default function Fixtures() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/leagues`)
      .then(res => res.json())
      .then(data => setLeagues(data.data));
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/fixtures`)
      .then(res => res.json())
      .then(data => setFixtures(data.data));
  }, []);

  useEffect(() => {
    if (selectedLeague) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams?league=${selectedLeague}`)
        .then(res => res.json())
        .then(data => setTeams(data.data));
    }
  }, [selectedLeague]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeTeam || !awayTeam || !date) {
      setMessage('All fields are required');
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fixture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ homeTeamId:homeTeam, awayTeamId:awayTeam, date })
    });

    if (res.ok) {
      const newFixture = await res.json();
      setFixtures([...fixtures, newFixture.data]);
      setHomeTeam('');
      setAwayTeam('');
      setDate('');
      setMessage('Fixture added successfully');
    } else {
      const errorData = await res.json();
      setMessage(`Error: ${errorData.errors[0].msg}`);
    }
  }

  const handleUpdate = async (id: string, homeTeamGoals: number, awayTeamGoals: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fixture/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ homeTeamGoals, awayTeamGoals })
    });

    if (res.ok) {
      const updatedFixture = await res.json();
      setFixtures(fixtures.map(fixture => fixture._id === id ? updatedFixture.data : fixture));
      setMessage('Score updated successfully');
    } else {
      const errorData = await res.json();
      setMessage(`Error: ${errorData.errors[0].msg}`);
    }
  }

  const handleScoreChange = (id: string, homeTeamGoals: number, awayTeamGoals: number) => {
    setFixtures(fixtures.map(fixture => 
      fixture._id === id ? { ...fixture, homeTeamGoals, awayTeamGoals } : fixture
    ));
    handleUpdate(id, homeTeamGoals, awayTeamGoals);
  }

  return (
    <div className="container mx-auto p-4 text-center">
        <Navigation />
      <h1 className="text-2xl font-bold mb-4">Fixtures</h1>
      {message && <div className="mb-4 text-red-500">{message}</div>}
      <form onSubmit={handleSubmit} className="mb-4">
        <select 
          value={selectedLeague}
          onChange={(e) => setSelectedLeague(e.target.value)}
          className="border p-2 mr-2"
        >
          <option value="">Select League</option>
          {leagues.map(league => (
            <option key={league._id} value={league._id}>{league.name}</option>
          ))}
        </select>
        <select 
          value={homeTeam}
          onChange={(e) => setHomeTeam(e.target.value)}
          className="border p-2 mr-2"
        >
          <option value="">Select Home Team</option>
          {teams.map(team => (
            <option key={team._id} value={team._id}>{team.name}</option>
          ))}
        </select>
        <select 
          value={awayTeam}
          onChange={(e) => setAwayTeam(e.target.value)}
          className="border p-2 mr-2"
        >
          <option value="">Select Away Team</option>
          {teams.map(team => (
            <option key={team._id} value={team._id}>{team.name}</option>
          ))}
        </select>
        <input 
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">Add Fixture</button>
      </form>

      <div className="space-y-4">
        {fixtures.map(fixture => (
          <div key={fixture._id} className="flex justify-center items-center space-x-4 border p-2 rounded shadow">
            <span>{fixture.homeTeam.name}</span>
            <div className="flex items-center space-x-2">
              <input 
                type="number"
                value={fixture.homeTeamGoals}
                onChange={(e) => handleScoreChange(fixture._id, parseInt(e.target.value), fixture.awayTeamGoals)}
                className="border p-2 w-12 text-center rounded bg-gray-200"
              />
              <span>-</span>
              <input 
                type="number"
                value={fixture.awayTeamGoals}
                onChange={(e) => handleScoreChange(fixture._id, fixture.homeTeamGoals, parseInt(e.target.value))}
                className="border p-2 w-12 text-center rounded bg-gray-200"
              />
            </div>
            <span>{fixture.awayTeam.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
