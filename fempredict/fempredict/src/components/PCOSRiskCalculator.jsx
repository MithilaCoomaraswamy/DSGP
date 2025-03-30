import React, { useState, useEffect } from "react";
import "../styles/PCOSRiskCalculator.css";

const PCOSRiskCalculator = () => {
  const [formData, setFormData] = useState({
    Age: "",
    Height_cm: "",
    Weight_kg: "",
    BMI: "",
    Sleep_Hours: "",
    Stress_Level: 5,
    Smoking: "",
    Alcohol_Caffeine_Consumption: "",
    Sexual_Activity: "",
    Age_Menarche: "",
    Menstrual_Cycle_Regularity: "",
    Period_Duration: "",
    Acne: "",
    Hair_Thinning: "",
    Weight_Gain: "",
    Excess_Hair_Growth: "",
    Family_History_PCOS: "",
    Geography_Urban: "",
    Diet_Moderate: "",
    Diet_Unhealthy: "",
    Ethnicity: "",
    Ethnicity_Asian: 0, //
    Ethnicity_Caucasian: 0, // Initialize ethnicity fields
    Ethnicity_Hispanic: 0,
    Ethnicity_Other: 0,
  });

  const [result, setResult] = useState(null);
  const [missingFields, setMissingFields] = useState([]);
  const [formErrors, setFormErrors] = useState({});


  useEffect(() => {
    if (formData.Height_cm && formData.Weight_kg) {
      // Automatically calculate BMI
      const bmi = calculateBMI(formData.Height_cm, formData.Weight_kg);
      setFormData((prevData) => ({
        ...prevData,
        BMI: bmi,
      }));
    }
  }, [formData.Height_cm, formData.Weight_kg]);

  const calculateBMI = (height, weight) => {
    const heightInMeters = height / 100; // Convert height from cm to meters
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEthnicityChange = (e) => {
    const selectedEthnicity = e.target.value;

    setFormData((prevData) => {
      let ethnicityData = {
        Ethnicity_Asian: 0,
        Ethnicity_Caucasian: 0,
        Ethnicity_Hispanic: 0,
        Ethnicity_Other: 0,
      };

      if (selectedEthnicity === "Caucasian") {
        ethnicityData.Ethnicity_Caucasian = 1;
      } else if (selectedEthnicity === "Hispanic") {
        ethnicityData.Ethnicity_Hispanic = 1;
      } else if (selectedEthnicity === "Asian") {
        ethnicityData.Ethnicity_Asian = 1;
      } else if (selectedEthnicity === "Other") {
        ethnicityData.Ethnicity_Other = 1;
      }

      return {
        ...prevData,
        Ethnicity: selectedEthnicity,
        ...ethnicityData,
      };
    });
  };

  const validateFields = () => {
    const errors = {};
  
    // Validate Age
    if (!formData.Age || formData.Age < 10 || formData.Age > 100) {
      errors.Age = "Age must be between 10 and 100 years.";
    }
  
    // Validate Height
    if (!formData.Height_cm || formData.Height_cm < 50 || formData.Height_cm > 250) {
      errors.Height_cm = "Height must be between 50 cm and 250 cm.";
    }
  
    // Validate Sleep
    if (!formData.Sleep_Hours || formData.Sleep_Hours < 0 || formData.Sleep_Hours > 24) {
      errors.Sleep_Hours = "Sleep must be between 0 and 24 hours.";
    }

    // Validate Period Duration
    if (!formData.Period_Duration || formData.Period_Duration < 2 || formData.Period_Duration > 7) {
        errors.Period_Duration = "Periods must be between 2 and 7 days.";
      }
  

    // Validate Weight
    if (!formData.Weight_kg || formData.Weight_kg < 20 || formData.Weight_kg > 300) {
        errors.Weight_kg = "Weight must be between 20 kg and 300 kg.";
      }
  
    // Validate Age at First Period (Menarche)
    if (!formData.Age_Menarche || formData.Age_Menarche < 8 || formData.Age_Menarche > 18) {
      errors.Age_Menarche = "Age at first period must be between 8 and 18 years.";
    }
  
    // Store the errors in the state
    setFormErrors(errors);
  
    // Return false if there are any errors
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Validate fields
    if (!validateFields()) {
      return; // Stop submission if validation fails
    }
  
    const requiredFields = [
      "Age",
      "Height_cm",
      "Weight_kg",
      "Sleep_Hours",
      "Smoking",
      "Alcohol_Caffeine_Consumption",
      "Sexual_Activity",
      "Age_Menarche",
      "Menstrual_Cycle_Regularity",
      "Period_Duration",
      "Acne",
      "Hair_Thinning",
      "Weight_Gain",
      "Excess_Hair_Growth",
      "Family_History_PCOS",
      "Geography_Urban",
      "Diet_Moderate",
      "Diet_Unhealthy",
      "Ethnicity",
    ];
  
    const missing = requiredFields.filter((field) => !formData[field]);
  
    if (missing.length > 0) {
      setMissingFields(missing);
      return; // Don't submit if there are missing fields
    }
  
    setMissingFields([]); // Clear missing fields
  
    const jsonData = { ...formData };
    Object.keys(jsonData).forEach((key) => {
      jsonData[key] = isNaN(jsonData[key]) ? jsonData[key] : parseFloat(jsonData[key]);
    });
  
    fetch("http://127.0.0.1:5000/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setResult({
            message: `Error: ${data.error}`,
            type: "error",
          });
        } else {
          const isHighRisk = data.prediction === "High Risk";
          setResult({
            message: `${data.prediction} - ${data.message}`,
            recommendation: data.recommendation,
            type: isHighRisk ? "error" : "success",
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setResult({
          message: "Something went wrong. Try again.",
          type: "error",
        });
      });
  };
  

  return (
    <div>
    <div className="container">
      <h1>PCOS Risk Predictor</h1>

      <form id="pcosForm">
        <div className="form-row">
          <label htmlFor="age">Age (in years):</label>
          <input
            type="number"
            name="Age"
            id="age"
            placeholder="e.g. 25"
            value={formData.Age}
            onChange={handleInputChange}
            required
          />
          {formErrors.Age && <span className="error">{formErrors.Age}</span>}
        </div>

        <div className="form-row">
          <label htmlFor="height">Height (cm):</label>
          <input
            type="number"
            name="Height_cm"
            id="height"
            step="0.1"
            placeholder="e.g. 165"
            value={formData.Height_cm}
            onChange={handleInputChange}
            required
          />
          {formErrors.Height_cm && <span className="error">{formErrors.Height_cm}</span>}
        </div>

        <div className="form-row">
          <label htmlFor="weight">Weight (kg):</label>
          <input
            type="number"
            name="Weight_kg"
            id="weight"
            step="0.1"
            placeholder="e.g. 60"
            value={formData.Weight_kg}
            onChange={handleInputChange}
            required
          />
            {formErrors.Weight_kg && <span className="error">{formErrors.Weight_kg}</span>}
        </div>

        <div className="form-row">
          <label htmlFor="bmi">Body Mass Index (BMI):</label>
          <input
            type="text"
            name="BMI"
            id="bmi"
            value={formData.BMI}
            readOnly
          />
        </div>

        {/* Section: Lifestyle */}
        <div className="form-row">
          <label htmlFor="sleep">Average Sleep Hours:</label>
          <input
            type="number"
            name="Sleep_Hours"
            id="sleep"
            min="0"
            max="24"
            step="0.1"
            placeholder="e.g. 7.5"
            value={formData.Sleep_Hours}
            onChange={handleInputChange}
            required
          />
            {formErrors.Sleep_Hours && <span className="error">{formErrors.Sleep_Hours}</span>}
        </div>

        <div className="form-row">
          <label htmlFor="stress">Stress Level (1 = Low, 10 = High):</label>
          <input
            type="range"
            name="Stress_Level"
            id="stress"
            min="1"
            max="10"
            value={formData.Stress_Level}
            onChange={handleInputChange}
          />
          <output id="stressValue">{formData.Stress_Level}</output>
        </div>

        <div className="form-row">
          <label htmlFor="smoking">Do you smoke?</label>
          <select
            name="Smoking"
            id="smoking"
            value={formData.Smoking}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled hidden>
              Choose an option
            </option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="alcohol">Alcohol/Caffeine Consumption:</label>
          <select
            name="Alcohol_Caffeine_Consumption"
            id="alcohol"
            value={formData.Alcohol_Caffeine_Consumption}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled hidden>
              Choose frequency
            </option>
            <option value="0">None</option>
            <option value="1">Sometimes</option>
            <option value="2">Frequently</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="sexual_activity">Are you sexually active?</label>
          <select
            name="Sexual_Activity"
            id="sexual_activity"
            value={formData.Sexual_Activity}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled hidden>
              Select one
            </option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        {/* Section: Menstrual Health */}
        <div className="form-row">
          <label htmlFor="menarche">Age at First Period (Menarche):</label>
          <input
            type="number"
            name="Age_Menarche"
            id="menarche"
            placeholder="e.g. 13"
            value={formData.Age_Menarche}
            onChange={handleInputChange}
            required
          />
            {formErrors.Age_Menarche && <span className="error">{formErrors.Age_Menarche}</span>}
        </div>

        <div className="form-row">
          <label htmlFor="cycle">Menstrual Cycle Regularity:</label>
          <select
            name="Menstrual_Cycle_Regularity"
            id="cycle"
            value={formData.Menstrual_Cycle_Regularity}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled hidden>
              Select one
            </option>
            <option value="2">Regular</option>
            <option value="1">Irregular</option>
            <option value="0">Absent</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="duration">Average Period Duration (days):</label>
          <input
            type="number"
            name="Period_Duration"
            id="duration"
            min="1"
            max="10"
            placeholder="e.g. 5"
            value={formData.Period_Duration}
            onChange={handleInputChange}
            required
          />
            {formErrors.Period_Duration && <span className="error">{formErrors.Period_Duration}</span>}
        </div>

        {/* Section: Symptoms */}
        <div className="form-row">
          <label htmlFor="acne">Do you experience acne?</label>
          <select
            name="Acne"
            id="acne"
            value={formData.Acne}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled hidden>
              Choose one
            </option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="hair_loss">Hair thinning or loss?</label>
          <select
            name="Hair_Thinning"
            id="hair_loss"
            value={formData.Hair_Thinning}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled hidden>
              Choose one
            </option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="weight_gain">Unexplained weight gain?</label>
          <select
            name="Weight_Gain"
            id="weight_gain"
            value={formData.Weight_Gain}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled hidden>
              Choose one
            </option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="hair_growth">Excess facial/body hair (Hirsutism)?</label>
          <select
            name="Excess_Hair_Growth"
            id="hair_growth"
            value={formData.Excess_Hair_Growth}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled hidden>
              Choose one
            </option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        {/* Section: Family & Diet */}
        <div className="form-row">
          <label htmlFor="family_history">Family History of PCOS:</label>
          <select
            name="Family_History_PCOS"
            id="family_history"
            value={formData.Family_History_PCOS}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled hidden>
              Choose one
            </option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="location">Where do you live?</label>
          <select
            name="Geography_Urban"
            id="location"
            value={formData.Geography_Urban}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled hidden>
              Select area
            </option>
            <option value="1">Urban</option>
            <option value="0">Rural</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="diet_type">How would you describe your diet?</label>
          <select
            name="Diet_Moderate"
            id="diet_type"
            value={formData.Diet_Moderate}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled hidden>
              Select one
            </option>
            <option value="1">Balanced/Moderate</option>
            <option value="0">Unbalanced</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="unhealthy_diet">Do you frequently eat junk food?</label>
          <select
            name="Diet_Unhealthy"
            id="unhealthy_diet"
            value={formData.Diet_Unhealthy}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled hidden>
              Choose one
            </option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        {/* Section: Ethnicity */}
        <div className="form-row">
          <label htmlFor="ethnicity">Ethnicity:</label>
          <select
            name="Ethnicity"
            id="ethnicity"
            value={formData.Ethnicity}
            onChange={handleEthnicityChange}
            required
          >
            <option value="" disabled hidden>
              Select one
            </option>
            <option value="Asian">Asian</option>
            <option value="Caucasian">Caucasian</option>
            <option value="Hispanic">Hispanic</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <button type="button" onClick={handleSubmit}>
          Predict Risk
        </button>
      </form>

      {/* Missing Fields Display */}
      {missingFields.length > 0 && (
        <div className="error-box">
          <p>❌ Missing fields: {missingFields.join(", ")}</p>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className={`result-box ${result.type}`}>
          <p>{result.message}</p>
          {result.recommendation && <p><em>{result.recommendation}</em></p>}
        </div>
      )}
    </div>
            <footer>
            <p>Contact us: support@pcosmanagement.com</p>
            <p>Legal Disclaimer: This information is for educational purposes and not a substitute for medical advice.</p>
          </footer>
          </div>
  );
};

export default PCOSRiskCalculator;
