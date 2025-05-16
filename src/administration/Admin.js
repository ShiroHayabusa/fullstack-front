import React from 'react'
import { Link } from 'react-router-dom';

export default function Admin() {
    return (
        <div>
            <div className='container'>
                <nav aria-label="breadcrumb" className='mt-3'>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Administration</li>
                    </ol>
                </nav>
                <div>
                    <ul className="list-group list-group-flush">
                        <div className="h4 pb-2 text-secondary text-start border-bottom border-secondary">Catalog</div>
                        <Link className="list-group-item text-start" to='/admin/countries'>Countries</Link>
                        <Link className="list-group-item text-start" to='/bodies'>Bodies</Link>
                        <Link className="list-group-item text-start" to='/admin/bodytypes'>Bodytypes</Link>
                        <Link className="list-group-item text-start" to='/admin/titles'>Titles</Link>
                        <Link className="list-group-item text-start" to='/engines'>Engines</Link>
                        <Link className="list-group-item text-start" to='/admin/engineTypes'>Engine types</Link>
                        <Link className="list-group-item text-start" to='/admin/transmissions'>Transmissions</Link>
                        <Link className="list-group-item text-start" to='/admin/transmissionTypes'>Transmission types</Link>
                        <Link className="list-group-item text-start" to='/admin/drivetrains'>Drivetrains</Link>
                        <Link className="list-group-item text-start" to='/admin/markets'>Markets</Link>
                        <Link className="list-group-item text-start" to='/admin/fuels'>Fuels</Link>
                        <Link className="list-group-item text-start" to='/admin/awards'>Awards</Link>
                        <div className="h4 pb-2 text-secondary text-start border-bottom border-secondary">Autosport</div>
                        <Link className="list-group-item text-start" to='/admin/races'>Races</Link>
                        <Link className="list-group-item text-start" to='/admin/series'>Series</Link>
                        <Link className="list-group-item text-start" to='/admin/tracks'>Tracks</Link>
                        <Link className="list-group-item text-start" to='/admin/classes'>Classes</Link>
                        <div className="h4 pb-2 text-secondary text-start border-bottom border-secondary">Users</div>
                        <Link className="list-group-item text-start" to='/admin/users'>Users</Link>
                        <Link className="list-group-item text-start" to='/admin/roles'>Roles</Link>
                        <div className="h4 pb-2 text-secondary text-start border-bottom border-secondary">Other</div>
                        <Link className="list-group-item text-start" to='/admin/persons'>Persons</Link>
                        <Link className="list-group-item text-start" to='/admin/check-bucket-availability'>Bucket availability</Link>
                    </ul>
                </div>
            </div>
        </div>
    )
}
