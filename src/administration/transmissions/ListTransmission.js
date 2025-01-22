import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';
import '../../components/ColumnContainer.css'

export default function ListTransmission() {

    const [transmissions, setTransmissions] = useState([]);
    const { make } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        loadTransmissions()
    }, [make]);


    const loadTransmissions = async () => {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/transmissions/${make}`);
        setTransmissions(result.data);
    }

    const groupedList = transmissions.reduce((acc, obj) => {
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
                    <Link className="nav-link active" aria-current="page" to={`/transmissions/${make}/addTransmission`}
                    >Add transmission</Link>
                </ul>
            )}
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mt-3">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item"><a href="/transmissions" className="text-decoration-none">Transmissions</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{make}</li>
                    </ol>
                </nav>
                <h2>{make} transmissions</h2>
                <div className='py-4'>
                    <div className="column-container">
                        {sortedKeys.map((letter) => (
                            <div key={letter} className="column-group">
                                <h4>{letter}</h4>
                                <ul className="list-group">
                                    {groupedList[letter].map((transmission) => (
                                        <li className="list-group-item border-0" key={transmission.id}>
                                            <a href={`/transmissions/${make}/${transmission.id}`} className="text-decoration-none">
                                                <p>
                                                    {transmission.name}
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
