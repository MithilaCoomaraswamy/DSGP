import { Link } from 'react-router-dom';

function Header(){
    return(
        <header>
            <nav> 
                <ul>
                    <div className="heading">
                        <Link to="/">
                            <img src="logo.png" alt="FemPredict Logo"  className="logo"/>
                        </Link>
                    </div>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/period_tracker">Period Tracker</Link></li>
                    <li><Link to="/pcos_quiz">PCOS Quiz</Link></li>
                    <li><Link to="/chatbot">Chatbot</Link></li>
                    <li><Link to="/exercise_recommender">Exercise Recommender</Link></li>
                    <li><Link to="/profile"><i className="fas fa-user-circle" style={{ fontSize: '40px', color: 'black'}}></i></Link></li>
                </ul>
            </nav>
        
        </header>
    );
    }
    export default Header

