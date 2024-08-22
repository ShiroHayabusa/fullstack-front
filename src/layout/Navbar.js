import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
    return (
        <div>
            <nav className="navbar bg-dark" data-bs-theme="dark">
                <div className="container-fluid">
                    <Link className="navbar-brand text-white" to={'/'}>Loripin</Link>
                    <nav class="nav">
                        <Link class="nav-link text-white" to='/catalog'>Catalog</Link>
                        <Link class="nav-link text-white" to='/spots'>Spots</Link>
                        <Link class="nav-link text-white" to='/autosport'>Autosport</Link>
                        <Link class="nav-link text-white" to='/administration'>Administration</Link>
                    </nav>
                    <button className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
            </nav>

        </div>
    )
}
