import React, { useState } from "react";

function Recommender() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [preferences, setPreferences] = useState("");
  const [goals, setGoals] = useState("");
  const [recommendation, setRecommendation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Here we can generate a recommendation based on the inputs
    generateRecommendation();
  };

  const generateRecommendation = () => {
    // Basic logic for exercise recommendations based on the input
    let recommendedExercise = "";

    // Check the user's goals and preferences
    if (goals === "weight loss") {
      if (preferences === "cardio") {
        recommendedExercise = "Try running, cycling, or swimming for weight loss.";
      } else if (preferences === "strength") {
        recommendedExercise = "Try weight lifting or HIIT workouts for fat burning.";
      } else {
        recommendedExercise = "A mix of cardio and strength training is ideal for weight loss.";
      }
    } else if (goals === "muscle gain") {
      recommendedExercise = "Focus on strength training and weight lifting to build muscle.";
    } else if (goals === "general fitness") {
      recommendedExercise = "Try a balanced workout routine with both cardio and strength exercises.";
    }

    // Provide exercise recommendations based on the user's age, weight, and height
    if (age < 18) {
      recommendedExercise += " Since you're under 18, focus on bodyweight exercises and form over heavy lifting.";
    } else if (age >= 18 && age < 40) {
      recommendedExercise += " You're in a great age range for building muscle and endurance.";
    } else if (age >= 40) {
      recommendedExercise += " For your age, focus on joint-friendly exercises like swimming and cycling.";
    }

    // Set the final recommendation state
    setRecommendation(recommendedExercise);
  };

  return (
    <div>
      <h1>Personalized Exercise Recommender</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Weight (kg):</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <div>
          <label>Height (cm):</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div>
          <label>Preferences (Cardio, Strength, Mixed):</label>
          <select
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
          >
            <option value="">Select</option>
            <option value="cardio">Cardio</option>
            <option value="strength">Strength</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
        <div>
          <label>Goals (Weight Loss, Muscle Gain, General Fitness):</label>
          <select
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
          >
            <option value="">Select</option>
            <option value="weight loss">Weight Loss</option>
            <option value="muscle gain">Muscle Gain</option>
            <option value="general fitness">General Fitness</option>
          </select>
        </div>
        <button type="submit">Get Recommendations</button>
      </form>

      {recommendation && (
        <div>
          <h2>Recommended Exercise:</h2>
          <p>{recommendation}</p>
        </div>
      )}
    </div>
  );
}

export default Recommender;
