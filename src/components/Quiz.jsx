import { useState, useEffect, useCallback } from 'react';

const decodeHTML = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
};

export default function Quiz({ difficulty, onFinish }) {
    const [questions, setQuestions] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await fetch(`https://opentdb.com/api.php?amount=5&difficulty=${difficulty}&type=multiple`);
                const data = await res.json();

                const formattedQuestions = data.results.map((q) => {
                    const answers = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
                    return { ...q, shuffled_answers: answers };
                });

                setQuestions(formattedQuestions);
            } catch (error) {
                console.error("Hiba az adatok lekérésekor:", error);
            }
        };
        fetchQuestions();
    }, [difficulty]);

    const currentQ = questions[currentIdx];

    const handleAnswer = useCallback((answer) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(answer);

        const isCorrect = answer === currentQ?.correct_answer;
        if (isCorrect) setScore(prev => prev + 1);

        setTimeout(() => {
            if (currentIdx + 1 < questions.length) {
                setCurrentIdx(prev => prev + 1);
                setSelectedAnswer(null);
                setTimeLeft(10);
            } else {
                onFinish(score + (isCorrect ? 1 : 0));
            }
        }, 2000);
    }, [selectedAnswer, currentQ, currentIdx, questions, score, onFinish]);

    // Időzítő
    useEffect(() => {
        if (selectedAnswer !== null) return;

        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            const timeout = setTimeout(() => handleAnswer(null), 0);
            return () => clearTimeout(timeout);
        }
    }, [timeLeft, selectedAnswer, handleAnswer]);


    if (questions.length === 0) return <h2>Kérdések betöltése...</h2>;

    return (
        <div>
            <p>Kérdés: {currentIdx + 1} / 5</p>
            <div className="progress-bar-container">
                <div
                    className={`progress-bar ${timeLeft <= 3 ? 'danger' : ''}`}
                    style={{ width: `${(timeLeft / 10) * 100}%` }}
                ></div>
            </div>
            <h3>{decodeHTML(currentQ.question)}</h3>

            <div>
                {currentQ.shuffled_answers.map((ans, idx) => {
                    let btnClass = "answer-btn";
                    if (selectedAnswer !== null) {
                        if (ans === currentQ.correct_answer) btnClass += " correct";
                        else if (ans === selectedAnswer) btnClass += " wrong";
                    }

                    return (
                        <button
                            key={idx}
                            className={btnClass}
                            onClick={() => handleAnswer(ans)}
                            disabled={selectedAnswer !== null}
                        >
                            {decodeHTML(ans)}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
