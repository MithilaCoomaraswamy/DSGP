function Body() {
    return (
        <><div id="sections">
            <section 
                id="hero" 
                style={{
                    backgroundImage: 'url("banner1.png")', // Replace with the URL of your image
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat', 
                    backgroundPosition: 'center',
                    height: '100vh', // Full viewport height
                    color: 'white', // Text color (adjust as needed)
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '20px', // Optional padding
                    borderRadius: '50px',
                }}
            >
                {/* You can add any content you want in the hero section here, e.g., a heading */}
                <button>Click me</button>
            </section>

            <section id="about"
            style={{
                    backgroundImage: 'url("banner2.png")', // Replace with the URL of your image
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat', 
                    backgroundPosition: 'center',
                    height: '100vh', // Full viewport height
                    color: 'white', // Text color (adjust as needed)
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '20px', // Optional padding
                }}
            >
                {/* You can add any content you want in the hero section here, e.g., a heading */}
                <button
                    style={{
                        backgroundColor: '#821d30', // Background color for the button
                        color: '#f7d6d0', // Text color for the button
                        fontWeight: 'bold', // Bold text
                    }}
                >
                    Click me
                </button>
            </section>

            <section id="services"
            style={{
                    backgroundImage: 'url("banner3.png")', // Replace with the URL of your image
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat', 
                    backgroundPosition: 'center',
                    height: '100vh', // Full viewport height
                    color: 'white', // Text color (adjust as needed)
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '20px', // Optional padding
                }}
            >
                {/* You can add any content you want in the hero section here, e.g., a heading */}
                <button>Click me</button>
            </section>


            <section 
                id="contact"
                style={{
                    backgroundImage: 'url("banner4.png")', // Replace with the URL of your image
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat', 
                    backgroundPosition: 'center',
                    height: '100vh', // Full viewport height
                    color: 'white', // Text color (adjust as needed)
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '20px', // Optional padding
                }}
            >
                {/* You can add any content you want in the contact section here */}
                <button
                    style={{
                        backgroundColor: '#821d30', // Background color for the button
                        color: '#f7d6d0', // Text color for the button
                        fontWeight: 'bold', // Bold text
                    }}
                >
                    Click me
                </button>
            </section>
        </div>
        </>
    );
}

export default Body;
