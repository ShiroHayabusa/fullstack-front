import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import '../../components/ColumnContainer.css'

export default function ListBody() {

    const [bodies, setBodies] = useState([]);
    const { make } = useParams();

    useEffect(() => {
        loadBodies()
    }, [make]);


    const loadBodies = async () => {
        const result = await axios.get(`http://localhost:8080/administration/bodies/${make}`);
        setBodies(result.data);
    }

    const groupedList = bodies.reduce((acc, obj) => {
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
                <Link className="nav-link active" aria-current="page" to={`/administration/bodies/${make}/addBody`}
                >Add body</Link>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item"><a href="/administration" className="text-decoration-none">Administration</a></li>
                        <li className="breadcrumb-item"><a href="/administration/bodies" className="text-decoration-none">Bodies</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{make}</li>
                    </ol>
                </nav>
                <h2>{make} bodies</h2>
                <div className='py-4'>
                    <div className="column-container">
                        {sortedKeys.map((letter) => (
                            <div key={letter} className="column-group">
                                <h4>{letter}</h4>
                                <ul className="list-group">
                                    {groupedList[letter].map((body) => (
                                        <li className="list-group-item border-0" key={body.id}>
                                            <a href={`/administration/bodies/${make}/${body.id}`} className="text-decoration-none">
                                                <p>
                                                    {body.name}
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
