import { Link } from 'react-router-dom';


export default function Autosport() {

    return (
        <div>
            <ul className="nav">
                <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to='/spots/addSpot'>Add Series</Link>
                </li>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Autosport</li>

                    </ol>
                </nav>
            </div>
        </div>
    )
}