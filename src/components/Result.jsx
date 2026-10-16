import { useState } from 'react';

export default function Result({ score, onRestart }) {
    const [name, setName] = useState('');
    const [saved, setSaved] = useState(false);

    const [leaderboard, setLeaderboard] = useState(() => {
        return JSON.parse(localStorage.getItem('trivia-scores')) || [];
    });

    const handleSave = () => {
        if (!name.trim()) return;
        const newEntry = { name, score };

        const newLeaderboard = [...leaderboard, newEntry]
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        localStorage.setItem('trivia-scores', JSON.stringify(newLeaderboard));
        setLeaderboard(newLeaderboard);
        setSaved(true);
    };

    return (
        <div>
            <h2>Játék Vége!</h2>
            <p>Eredményed: <strong>{score} / 5</strong></p>

            {!saved ? (
                <div style={{ marginTop: '20px' }}>
                    <input
                        type="text"
                        placeholder="Add meg a neved..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button onClick={handleSave}>Mentés</button>
                </div>
            ) : (
                <p style={{ color: '#28a745' }}>Sikeresen mentve!</p>
            )}

            <div className="leaderboard">
                <h3>🏆 Top 5 Játékos</h3>
                <ul>
                    {leaderboard.map((entry, idx) => (
                        <li key={idx}>{idx + 1}. {entry.name} - {entry.score}/5</li>
                    ))}
                    {leaderboard.length === 0 && <li>Még nincsenek eredmények.</li>}
                </ul>
            </div>

            <button onClick={onRestart} style={{ marginTop: '20px', width: '100%' }}>Új Játék</button>
        </div>
    );
}
