import { Link } from 'react-router-dom';


export default function Spots() {

    return (
        <div>
            <ul class="nav">
                <li class="nav-item">
                    <Link class="nav-link active" aria-current="page" to='/spots/addSpot'>Add Spot</Link>
                </li>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/">Home</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Spots</li>

                    </ol>
                </nav>
            </div>
        </div>
    )
}