function submitForm() {
    const form = document.getElementById("pcosForm");
    const formData = new FormData(form);
    const jsonData = {};

    formData.forEach((value, key) => {
        jsonData[key] = isNaN(value) ? value : parseFloat(value);
    });

    fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .then(data => {
        const resultBox = document.getElementById("result");

        if (data.error) {
            resultBox.innerHTML = `<p><strong>Error:</strong> ${data.error}</p>`;
            resultBox.className = "result-box error";
        } else {
            const isHighRisk = data.prediction === "High Risk";
            const riskClass = isHighRisk ? "high-risk" : "low-risk";
            const boxClass = isHighRisk ? "result-box error" : "result-box success";

            resultBox.innerHTML = `
                <p class="${riskClass}"><strong>${data.prediction}</strong></p>
                <p>${data.message}</p>
                <p><em>${data.recommendation}</em></p>
            `;
            resultBox.className = boxClass;
        }

        resultBox.style.display = "block";
    })
    .catch(error => {
        console.error("Error:", error);
        const resultBox = document.getElementById("result");
        resultBox.innerHTML = "<p style='color:red;'>Something went wrong. Try again.</p>";
        resultBox.className = "result-box error";
        resultBox.style.display = "block";
    });
}
