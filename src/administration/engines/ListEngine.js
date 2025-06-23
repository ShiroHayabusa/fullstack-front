import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';
import '../../components/ColumnContainer.css'

export default function ListEngine() {

    const [engines, setEngines] = useState([]);
    const { make } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        loadEngines()
    }, [make]);


    const loadEngines = async () => {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/engines/${make}`);
        setEngines(result.data);
    }

    const groupedList = engines.reduce((acc, obj) => {
        const firstLetter = obj.name.charAt(0).toUpperCase();
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(obj);
        return acc;
    }, {});

    const sortedKeys = Object.keys(groupedList).sort();

    return (
        <div>
            {user?.roles.includes("ROLE_ADMIN") && (
                <ul className="nav">
                    <Link className="nav-link active" aria-current="page" to={`/admin/engines/${make}/addEngine`}
                    >Add Engine</Link>
                </ul>
            )}
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mt-3">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item"><a href="/engines" className="text-decoration-none">Engines</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{make}</li>
                    </ol>
                </nav>
                <h2>{make} engines</h2>
                <div className='py-4'>
                    <div className="column-container">
                        {sortedKeys.map((letter) => (
                            <div key={letter} className="column-group">
                                <h4>{letter}</h4>
                                <ul className="list-group">
                                    {groupedList[letter].map((engine) => (
                                        <li className="list-group-item border-0" key={engine.id}>
                                            <a href={`/engines/${make}/${engine.id}`} className="text-decoration-none">
                                                <p>
                                                    {engine.name}
                                                </p>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
