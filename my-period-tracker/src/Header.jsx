function Header(){
return(
    <header>
        <nav> 
            <ul>
                <div className="heading">
                    <a href="#">
                        <img src="logo.png" alt="FemPredict Logo"  className="logo"/>
                    </a>
                </div>
                <li><a href="#">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Period Tracker</a></li>
                <li><a href="#">PCOS Quiz</a></li>
                <li><a href="#">Chatbot</a></li>
                <li><a href="#">Exercise Recommender</a></li>
                <li><a href="#">
                        <i className="fas fa-user-circle" style={{ fontSize: '40px', color: 'black'}}></i>
                    </a>
                </li>
            </ul>
        </nav>
    
    </header>
);
}
export default Header