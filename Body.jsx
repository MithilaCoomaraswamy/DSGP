function Body() {
    return (
        <>
        <div className="section-container">
            {/* First Section */}
            <section className="section">
                <div className="section-content">
                    <div className="section-image">
                        <img src="pic1.png" alt="Description 1" />
                    </div>
                    <div className="section-text">
                        <h2>Period Tracker</h2>
                        <p>Tracking your menstrual cycle has never been easier—or more important. With the FemPredict period tracker, you can effortlessly monitor your periods, putting you in control of your body.</p>
                        <button>Click Here</button>
                    </div>
                </div>
            </section>

            {/* Second Section */}
            <section className="section">
                <div className="section-content">
                    <div className="section-image">
                        <img src="pic2.png" alt="Description 2" />
                    </div>
                    <div className="section-text">
                        <h2>PCOS Quiz</h2>
                        <p>Polycystic Ovary Syndrome (PCOS) affects millions of people, but understanding the symptoms and managing your health can be challenging. With this quiz, you can easily check for signs of PCOS, so you can take the first step toward understanding and managing your condition.</p>
                        <button>Click Here</button>
                    </div>
                </div>
            </section>
        </div>
        <div className="section-container">
            {/* First Section */}
            <section className="section">
                <div className="section-content">
                    <div className="section-image">
                        <img src="pic3.png" alt="Description 1" />
                    </div>
                    <div className="section-text">
                        <h2>Exercise Recommender</h2>
                        <p>Looking to build strength, boost energy, lose weight, or simply feel better, the FemPredict exercise recommender helps you discover personalized workout plans tailored to your goals, preferences, and fitness level.</p>
                        <button>Click Here</button>
                    </div>
                </div>
            </section>

            {/* Second Section */}
            <section className="section">
                <div className="section-content">
                    <div className="section-image">
                        <img src="pic4.png" alt="Description 2" />
                    </div>
                    <div className="section-text">
                        <h2>Chatbot</h2>
                        <p>Looking for answers, help, or guidance? Our AI-powered chatbot is here to assist you every step of the way. Whether you need support, have questions, or just want quick information, our chatbot provides instant, friendly assistance at any time.</p>
                        <button>Click Here</button>
                    </div>
                </div>
            </section>
        </div>
        </>
        
    );
}

export default Body;
