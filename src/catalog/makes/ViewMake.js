import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ColumnListModels from '../../components/ColumnListModels'
import '../../components/ColumnContainer.css'

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
        const firstLetter = obj.name.charAt(0).toUpperCase();
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(obj);
        return acc;
    }, {});

    const sortedKeys = Object.keys(groupedList).sort();

    const makePhotoName = makeDetails && makeDetails.photo ? makeDetails.photo.name : 'placeholder.jpg';
    const photoURL = `https://newloripinbucket.s3.amazonaws.com/image/catalog/${make}/${makePhotoName}`;

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
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item"><a href="/catalog" className="text-decoration-none">Catalog</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{make}</li>
                    </ol>
                </nav>
                <div class="card border-0 border-bottom mb-3" >
                    <div class="row g-0">
                        <div class="col-md-2 mb-3">
                            <img
                                src={photoURL}
                                style={{ width: '200px', height: 'auto' }}
                                alt={`${make} logo`}
                                className='img-fluid mt-3'
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/100'; }} // Fallback image 
                            />
                        </div>
                        <div class="col-md-10">
                            <div class="card-body">
                                <h3 class="card-title text-start">{make}</h3>
                                <p class="card-text text-start">{makeDetails?.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='py-4'>
                    <div className="column-container">
                        {sortedKeys.map((letter) => (
                            <div key={letter} className="column-group">
                                <h4>{letter}</h4>
                                <ul className="list-group">
                                    {groupedList[letter].map((model) => (
                                        <li className="list-group-item border-0" key={model.id}>
                                            <a href={`/catalog/${make}/${model.name}`} className="text-decoration-none">
                                                <p>
                                                    {model.name}
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
