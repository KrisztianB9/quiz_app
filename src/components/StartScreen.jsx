export default function StartScreen({ onStart }) {
    return (
        <div>
            <h1>🎮 Trivia Battle</h1>
            <p>Teszteld a tudásod! Válassz nehézségi szintet:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button onClick={() => onStart('easy')}>Könnyű (Easy)</button>
                <button onClick={() => onStart('medium')}>Közepes (Medium)</button>
                <button onClick={() => onStart('hard')}>Nehéz (Hard)</button>
            </div>
        </div>
    );
}
