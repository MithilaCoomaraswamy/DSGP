import React, { useState } from 'react';

function PCOS() {
  const questions = [
    { question: 'Do you have irregular periods?', id: 1 },
    { question: 'Do you have excess body hair (hirsutism)?', id: 2 },
    { question: 'Do you experience acne or oily skin?', id: 3 },
    { question: 'Do you have thinning hair on your scalp?', id: 4 },
    { question: 'Do you have trouble losing weight?', id: 5 },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [progress, setProgress] = useState(0);

  const handleAnswer = (answer) => {
    setAnswers([...answers, answer]);
    const nextQuestion = currentQuestion + 1;
    setCurrentQuestion(nextQuestion);
    setProgress(((nextQuestion + 1) / questions.length) * 100);
  };

  const result = () => {
    const positiveAnswers = answers.filter(answer => answer).length;
    if (positiveAnswers >= 3) {
      return 'You may have PCOS. Please consult with a healthcare provider for diagnosis.';
    } else {
      return 'Your answers suggest that PCOS may not be likely, but it’s always best to check with a healthcare provider.';
    }
  };

  return (
    <div>
      <h1>PCOS Risk Assessment Quiz</h1>
      {currentQuestion < questions.length ? (
        <div>
          <p>{questions[currentQuestion].question}</p>
          <button onClick={() => handleAnswer(true)}>Yes</button>
          <button onClick={() => handleAnswer(false)}>No</button>
        </div>
      ) : (
        <div>
          <h2>{result()}</h2>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <p>Progress: {Math.round(progress)}%</p>
        <div style={{ width: '100%', height: '20px', backgroundColor: '#e0e0e0' }}>
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: progress === 100 ? 'green' : '#76c7c0',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default PCOS;
