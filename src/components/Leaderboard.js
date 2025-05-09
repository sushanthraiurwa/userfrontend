import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import './Leaderboard.css';

const MEDALS = ['🥇', '🥈', '🥉'];

function Leaderboard() {
  const [teams, setTeams] = useState([]);
  const [now, setNow] = useState(Date.now()); // To trigger re-render every second

  const fetchTeams = async () => {
    try {
      const res = await api.get('/teams');
      setTeams(res.data);
    } catch (err) {
      console.error('Error fetching teams:', err);
    }
  };

  useEffect(() => {
    fetchTeams();
    const fetchInterval = setInterval(fetchTeams, 1000); // Refresh teams
    const tickInterval = setInterval(() => setNow(Date.now()), 1000); // Trigger render
    return () => {
      clearInterval(fetchInterval);
      clearInterval(tickInterval);
    };
  }, []);

  const sorted = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (a.totalTimeTaken === null) return 1;
    if (b.totalTimeTaken === null) return -1;
    return a.totalTimeTaken - b.totalTimeTaken;
  });

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? `${h}h ` : ''}${m > 0 ? `${m}m ` : ''}${s}s`;
  };

  const renderTime = (team) => {
    if (typeof team.totalTimeTaken === 'number') {
      return formatTime(team.totalTimeTaken);
    } else if (team.timerStarTime) {
      const elapsed = Math.floor((now - new Date(team.timerStarTime)) / 1000);
      return (
        <>
          {formatTime(elapsed)} <span className="blinking">⏱</span>
        </>
      );
    } else {
      return '--';
    }
  };

  return (
    <div className="leaderboard-container">
      <h2>Points Table</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Team Name</th>
            <th>Points</th>
            <th>Time Taken</th>
          </tr>
        </thead>
        <AnimatePresence>
          <tbody>
            {sorted.map((team, idx) => (
              <motion.tr
                key={team._id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                layout
                className={idx < 3 ? `top-${idx + 1}` : ''}
              >
                <td>
                  {idx + 1} {idx < 3 && <span className="medal">{MEDALS[idx]}</span>}
                </td>
                <td>{team.name}</td>
                <td>{team.points}</td>
                <td>{renderTime(team)}</td>
              </motion.tr>
            ))}
          </tbody>
        </AnimatePresence>
      </table>
    </div>
  );
}

export default Leaderboard;
