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
                        <p>Tracking your menstrual cycle has never been easier—or more important. 
                            With the FemPredict period tracker, you can effortlessly monitor your periods, 
                            putting you in control of your body.</p>
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
                        <p>
                        Polycystic Ovary Syndrome (PCOS) affects millions of women, and recognizing its 
                        symptoms can be challenging. This quiz helps you identify signs of PCOS, taking the 
                        first step toward managing your health.</p>
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
                        <p>Looking to build strength, boost energy, lose weight, or simply feel better, 
                            the FemPredict exercise recommender helps you discover personalized workout 
                            plans tailored to your preferences and fitness level.</p>
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
                        <p>Have questions about managing your reproductive health or need someone to talk to during
                            "that time of the month"? Our AI-powered chatbot provides instant, friendly 
                            assistance at any time.</p>
                        <button>Click Here</button>
                    </div>
                </div>
            </section>
        </div>
        </>
        
    );
}

export default Body;
