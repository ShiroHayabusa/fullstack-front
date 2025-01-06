import React from 'react'
import { Link } from 'react-router-dom';

export default function Administration() {
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
                        <Link className="list-group-item text-start" to='/administration/countries'>Countries</Link>
                        <Link className="list-group-item text-start" to='/administration/bodies'>Bodies</Link>
                        <Link className="list-group-item text-start" to='/administration/bodytypes'>Bodytypes</Link>
                        <Link className="list-group-item text-start" to='/administration/titles'>Titles</Link>
                        <Link className="list-group-item text-start" to='/administration/engines'>Engines</Link>
                        <Link className="list-group-item text-start" to='/administration/engineTypes'>Engine types</Link>
                        <Link className="list-group-item text-start" to='/administration/transmissions'>Transmissions</Link>
                        <Link className="list-group-item text-start" to='/administration/transmissionTypes'>Transmission types</Link>
                        <Link className="list-group-item text-start" to='/administration/drivetrains'>Drivetrains</Link>
                        <Link className="list-group-item text-start" to='/administration/markets'>Markets</Link>
                        <Link className="list-group-item text-start" to='/administration/fuels'>Fuels</Link>
                        <div className="h4 pb-2 text-secondary text-start border-bottom border-secondary">Autosport</div>
                        <Link className="list-group-item text-start" to='/administration/races'>Races</Link>
                        <Link className="list-group-item text-start" to='/administration/series'>Series</Link>
                        <Link className="list-group-item text-start" to='/administration/tracks'>Tracks</Link>
                        <Link className="list-group-item text-start" to='/administration/classes'>Classes</Link>
                        <div className="h4 pb-2 text-secondary text-start border-bottom border-secondary">Users</div>
                        <Link className="list-group-item text-start" to='/administration/users'>Users</Link>
                        <Link className="list-group-item text-start" to='/administration/roles'>Roles</Link>
                        <div className="h4 pb-2 text-secondary text-start border-bottom border-secondary">Other</div>
                        <Link className="list-group-item text-start" to='/administration/persons'>Persons</Link>
                        <Link className="list-group-item text-start" to='/administration/check-bucket-availability'>Bucket availability</Link>
                    </ul>
                </div>
            </div>
        </div>
    )
}
