function Footer() {
    return (
        <footer>
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} FemPredict</p>

                {/* Additional Links */}
                <div className="footer-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Contact Us</a>
                </div>

                {/* Social Media Icons */}
                <div className="social-icons">
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        <img src="facebook-icon.png" alt="Facebook" className="social-icon"/>
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        <img src="twitter-icon.png" alt="Twitter" className="social-icon"/>
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        <img src="instagram-icon.png" alt="Instagram" className="social-icon"/>
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
