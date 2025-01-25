function About() {
    return (
      <section className="about-us">
      <div className="about-page">
        <h3>About Us</h3>
        <p>
        Welcome to our website! We are dedicated to providing effective solutions and support to women managing PCOS 
        (Polycystic Ovary Syndrome). Our goal is to empower you with the knowledge, tools, and resources needed to 
        take control of your health and wellbeing.
        </p>
  
        <h3>Our Mission</h3>
        <p>
        Our mission is to offer personalized, evidence-based guidance that helps women with PCOS manage their symptoms 
        and lead healthier lives. We believe in fostering a supportive community, where every woman can feel informed, 
        confident, and in charge of her journey to better health.
        </p>
  
        <h3>Our Values</h3>
          <div className="values-list">
            <div className="value-item">
              <h4>Empathy</h4>
              <p>We understand the challenges of living with PCOS and are here to support you every step of the way.</p>
            </div>
            <div className="value-item">
              <h4>Education</h4>
              <p>We provide trustworthy, science-backed information to help you make informed decisions about managing PCOS.</p>
            </div>
            <div className="value-item">
              <h4>Holistic Care</h4>
              <p>We believe in a comprehensive approach to PCOS management, combining lifestyle changes, nutrition, mental health support, and medical guidance.</p>
            </div>
          </div>
        <h3>Meet the Team</h3>
        <p>
          Our diverse and talented team is at the heart of everything we do. Each member brings a unique perspective to the table, working 
          together to achieve our common goals.
        </p>
  
        <div className="team-cards">
          <div className="card">
            <img src="20230967.jpg" alt="Team Member 1" />
            <h4>Mithila Coomaraswamy</h4>
            <p>Team lead, period tracker designer</p>
          </div>
          <div className="card">
            <img src="team.png" alt="Team Member 2" />
            <h4>Danishya Shanmuganathan</h4>
            <p>Chat bot designer</p>
          </div>
          <div className="card">
            <img src="team.png" alt="Team Member 3" />
            <h4>Harini Crusz</h4>
            <p>PCOS quiz designer</p>
          </div>
          <div className="card">
            <img src="team.png" alt="Team Member 4" />
            <h4>Chathuranga Dayarathne</h4>
            <p>Exercise Recommender deisgner</p>
          </div>
        </div>
      </div>
      </section>
    );
  }
  
  export default About;
  