import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Footer() {

    return (


            <footer className="bg-dark text-center text-white mt-5" >

                <div className="container p-4 pb-0">

                    <section className="mb-4">

                        <a className="btn btn-outline-light btn-floating m-1" href="https://www.youtube.com/channel/UC6W8I94B5hwJeTKHn7J3WKQ" role="button" style={{ border: "none" }}
                        ><i className="bi bi-youtube" style={{"fontSize": "1.5rem", "color": "currentColor"}}></i></a>


                        <a className="btn btn-outline-light btn-floating m-1" href="https://www.instagram.com/shiro.hayabusa?igsh=eWxseWNvemhuamRs&utm_source=qr" role="button" style={{ border: "none" }}
                        ><i className="bi bi-instagram" style={{"fontSize": "1.5rem", "color": "currentColor"}}></i></a>


                        <a className="btn btn-outline-light btn-floating m-1" href="https://www.facebook.com/profile.php?id=61577371456722" role="button" style={{ border: "none" }}
                        ><i className="bi bi-facebook" style={{"fontSize": "1.5rem", "color": "currentColor"}}></i></a>


                        <a className="btn btn-outline-light btn-floating m-1" href="https://x.com/LoripinInc" role="button" style={{ border: "none" }}
                        ><i className="bi bi-twitter-x" style={{"fontSize": "1.5rem", "color": "currentColor"}}></i></a>
                    </section>

                </div>
                <div className="text-center p-3" >             
                    <a className="text-white text-decoration-none" href="https://loripin.com/">© Loripin Inc</a>
                </div>

            </footer>

    );

}