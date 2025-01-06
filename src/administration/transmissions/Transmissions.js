import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../../components/ColumnContainer.css'
import { useAuth } from '../../context/AuthContext';

export default function Transmissions() {

    const [makes, setMakes] = useState([])
    const { user } = useAuth();

    useEffect(() => {
        loadMakes();
    }, []);

    const loadMakes = async () => {
        const result = await axios.get("http://localhost:8080/catalog", {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });
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
                    <li className="breadcrumb-item"><a href='/administration' className="text-decoration-none">Administration</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Transmissions</li>
                </ol>
            </nav>
            <h2>Transmissions</h2>
            <div className='py-4'>
                <div className="column-container">
                    {sortedKeys.map((letter) => (
                        <div key={letter} className="column-group">
                            <h4>{letter}</h4>
                            <ul className="list-group">
                                {groupedList[letter].map((make) => (
                                    <li className="list-group-item border-0" key={make.id}>
                                        <a href={`/administration/transmissions/${make.name}`} className="text-decoration-none">
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