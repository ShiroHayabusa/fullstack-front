import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext';
import '../../components/ColumnContainer.css'

export default function Engines() {

    const [makes, setMakes] = useState([])
    const { user } = useAuth();

    useEffect(() => {
        loadMakes();
    }, []);

    const loadMakes = async () => {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog`);
        setMakes(result.data);
    };

    const groupedList = makes.reduce((acc, obj) => {
        const firstLetter = obj.name.charAt(0).toUpperCase();
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(obj);
        return acc;
    }, {});

    const sortedKeys = Object.keys(groupedList).sort();

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb mt-3">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Engines</li>
                </ol>
            </nav>
            <h2>Engines</h2>
            <div className='py-4'>
                <div className="column-container">
                    {sortedKeys.map((letter) => (
                        <div key={letter} className="column-group">
                            <h4>{letter}</h4>
                            <ul className="list-group">
                                {groupedList[letter].map((make) => (
                                    <li className="list-group-item border-0" key={make.id}>
                                        <a href={`/engines/${make.name}`} className="text-decoration-none">
                                            <p >
                                                {make.name}
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
    )
}