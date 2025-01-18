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