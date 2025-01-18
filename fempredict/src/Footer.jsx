import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer>
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} FemPredict</p>

                {/* Additional Links */}
                <div className="footer-links">
                    <Link to="/PrivacyPolicy">Privacy Policy</Link>
                    <Link to="/TermsofService">Terms of Service</Link>
                    <Link to="/Contact">Contact Us</Link>
                </div>

                {/* Social Media Icons */}
                <div className="social-icons">
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-facebook" style={{ fontSize: '40px', color: 'black'}}></i>
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-twitter" style={{ fontSize: '40px', color: 'black' }}></i>
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-instagram" style={{ fontSize: '40px', color: 'black' }}></i>
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;