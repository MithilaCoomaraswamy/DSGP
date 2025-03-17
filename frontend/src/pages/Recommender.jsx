import React, { useState } from "react";

function Recommender() {
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [age, setAge] = useState(0);
  const [exerciseType, setExerciseType] = useState("home");
  const [recommendation, setRecommendation] = useState("");
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!weight || !height || !age) {
      setRecommendation("Please fill out all fields.");
      return;
    }

    setProgress(100);

    try {
      const response = await fetch("http://localhost:5000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weight: Number(weight),
          height: Number(height),
          age: Number(age),
          exerciseType,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setRecommendation(data.error);
      } else {
        const exercise =
          exerciseType === "home" ? data.home_exercise : data.gym_exercise;

        // Check if recommended exercise is null or undefined, if so, recommend visiting a doctor
        if (!exercise) {
          setRecommendation("Recommended exercise not found. Please consult a doctor.");
        } else {
          setRecommendation(`Recommended Exercise: ${exercise}`);
        }
      }
    } catch (error) {
      setRecommendation("An error occurred. Please try again.");
      console.error(error);
    }
  };

  const handleNext = () => {
    setStep(step + 1);
    setProgress((prevProgress) => Math.min(prevProgress + 25, 100));
  };

  return (
    <div className="container">
      <h1>Personalized Exercise Recommender</h1>
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div>
            <label>Weight (kg):</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <button type="button" onClick={handleNext}>
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <label>Height (cm):</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
            <button type="button" onClick={handleNext}>
              Next
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <label>Age:</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <button type="button" onClick={handleNext}>
              Next
            </button>
          </div>
        )}

        {step === 4 && (
          <div>
            <label>Exercise Type:</label>
            <select
              value={exerciseType}
              onChange={(e) => setExerciseType(e.target.value)}
            >
              <option value="home">Home</option>
              <option value="gym">Gym</option>
            </select>
            <button type="submit">Get Recommendations</button>
          </div>
        )}
      </form>

      {progress > 0 && (
        <div className="progress-container">
          <h3>Progress: {progress}%</h3>
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}

      {recommendation && (
        <div className="recommendation">
          <h2>{recommendation}</h2>
        </div>
      )}
    </div>
  );
}

export default Recommender;
