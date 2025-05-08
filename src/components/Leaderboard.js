import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import './Leaderboard.css';

const MEDALS = ['🥇', '🥈', '🥉'];

function Leaderboard() {
  const [teams, setTeams] = useState([]);

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
    const interval = setInterval(fetchTeams, 1000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const sorted = [...teams].sort((a, b) => b.points - a.points);

  return (
    <div className="leaderboard-container">
      <h2>Points Table</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Team Name</th>
            <th>Points</th>
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
              </motion.tr>
            ))}
          </tbody>
        </AnimatePresence>
      </table>
    </div>
  );
}

export default Leaderboard;