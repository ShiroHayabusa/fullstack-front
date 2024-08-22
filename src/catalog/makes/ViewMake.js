import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ColumnListModels from '../../components/ColumnListModels'

export default function ViewMake() {

    const [models, setModels] = useState([]);
    const [makeDetails, setMakeDetails] = useState(null);
    const { make } = useParams();

    useEffect(() => {
        loadModels();
        loadMakeDetails();
    }, [make]);


    const loadModels = async () => {
        const result = await axios.get(`http://localhost:8080/catalog/${make}`);

        setModels(result.data);


    }

    const loadMakeDetails = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/catalog/editMake/${make}`);
            setMakeDetails(result.data);
            console.log('make', result.data);
        } catch (error) {
            console.error('Error loading make details:', error);
        }
    };

    const groupedList = models.reduce((acc, obj) => {
        const k = obj.name.charAt(0).toUpperCase();
        acc[k] = acc[k] || [];
        acc[k].push(obj);
        return acc;
    }, {})

    const makePhotoName = makeDetails && makeDetails.photo ? makeDetails.photo.name : 'placeholder.jpg';
    const photoURL = `https://newloripinbucket.s3.amazonaws.com/image/${make}/${makePhotoName}`;

    return (
        <div>
            <ul className="nav">
                <Link className="nav-link active" aria-current="page" to={`/catalog/${make}/addModel`}
                >Add Model</Link>
                <Link className="nav-link active" aria-current="page" to={`/catalog/editMake/${make}`}
                >Edit make</Link>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item"><a href="/catalog">Catalog</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{make}</li>
                    </ol>
                </nav>
                <h2>{make}</h2>
                <div>
                    <img
                        src={photoURL}
                        style={{ width: '100px', height: 'auto' }}
                        alt={`${make} logo`}
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/100'; }} // Fallback image
                    />
                </div>
                <div className='py-4'>
                    <ColumnListModels groupedItems={groupedList} itemsPerColumn={6} make={make} />
                </div>
            </div>
        </div>
    )
}
