import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Footer() {

    return (


            <footer className="bg-dark text-center text-white mt-5" >

                <div className="container p-4 pb-0">

                    <section className="mb-4">

                        <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button" style={{ border: "none" }}
                        ><i className="bi bi-youtube" style={{"fontSize": "1.5rem", "color": "currentColor"}}></i></a>


                        <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button" style={{ border: "none" }}
                        ><i className="bi bi-instagram" style={{"fontSize": "1.5rem", "color": "currentColor"}}></i></a>


                        <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button" style={{ border: "none" }}
                        ><i className="bi bi-facebook" style={{"fontSize": "1.5rem", "color": "currentColor"}}></i></a>


                        <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button" style={{ border: "none" }}
                        ><i className="bi bi-twitter-x" style={{"fontSize": "1.5rem", "color": "currentColor"}}></i></a>


                        <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button" style={{ border: "none" }}
                        ><i className="bi bi-linkedin" style={{"fontSize": "1.5rem", "color": "currentColor"}}></i></a>

                        <a className="btn btn-outline-light btn-floating m-1" href="#!" role="button" style={{ border: "none" }}
                        ><i className="bi bi-reddit" style={{"fontSize": "1.5rem", "color": "currentColor"}}></i></a>
                    </section>

                </div>
                <div className="text-center p-3" >             
                    <a className="text-white text-decoration-none" href="https://loripin.com/">© Loripin.com</a>
                </div>

            </footer>

    );

}