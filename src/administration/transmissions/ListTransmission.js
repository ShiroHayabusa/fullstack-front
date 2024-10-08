import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import '../../components/ColumnContainer.css'

export default function ListTransmission() {

    const [transmissions, setTransmissions] = useState([]);
    const { make } = useParams();

    useEffect(() => {
        loadTransmissions()
    }, [make]);


    const loadTransmissions = async () => {
        const result = await axios.get(`http://localhost:8080/administration/transmissions/${make}`);
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
            <ul className="nav">
                <Link className="nav-link active" aria-current="page" to={`/administration/transmissions/${make}/addTransmission`}
                >Add transmission</Link>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item"><a href="/administration" className="text-decoration-none">Administration</a></li>
                        <li className="breadcrumb-item"><a href="/administration/transmissions" className="text-decoration-none">Transmissions</a></li>
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
                                            <a href={`/administration/transmissions/${make}/${transmission.id}`} className="text-decoration-none">
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
