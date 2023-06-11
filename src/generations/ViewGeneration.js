import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function ViewGeneration() {
    const [bodystyles, setBodystyles] = useState([]);
    const [facelifts, setFacelifts] = useState([]);
    const [generation, setGeneration] = useState({
        name: ''
    });


    const { make, model, generationId } = useParams();

    useEffect(() => {
        loadFacelifts()
    }, []);

    useEffect(() => {
        loadBodystyles()
    }, []);

    useEffect(() => {
        loadGeneration()
    }, []);

    const loadFacelifts = async () => {
        const result = await axios.get(`http://localhost:8080/catalog/` + make + '/'
            + model + '/' + generationId + '/faceliftList');
        setFacelifts(result.data);
    }

    const loadBodystyles = async () => {
        const result = await axios.get(`http://localhost:8080/catalog/` + make + '/'
            + model + '/' + generationId + '/bodystyles');
        setBodystyles(result.data);
    }

    const loadGeneration = async () => {
        const result = await axios.get(`http://localhost:8080/catalog/` + make + '/'
        + model + '/' + generationId);
        setGeneration(result.data);
    }

    return (
        <div>
            <ul className="nav">
                <Link className="nav-link active" aria-current="page"
                    to={`/catalog/${make}/${model}/${generationId}/addFacelift`}
                >Add facelift</Link>
                <Link className="nav-link active" aria-current="page"
                    to={`/catalog/${make}/${model}/${generationId}/addBodystyle`}
                >Add bodystyle</Link>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item"><a href="/catalog">Catalog</a></li>
                        <li className="breadcrumb-item"><Link to={`/catalog/${make}`}>{make}</Link></li>
                        <li className="breadcrumb-item"><Link to={`/catalog/${make}/${model}`}>{model}</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{generation.name}</li>
                    </ol>
                </nav>
                {facelifts.map((facelift, index) => (
                    <div className="h4 pb-2 text-secondary text-start border-bottom border-secondary" key={index}>
                        {facelift.name}
                        <div className="">
                            {bodystyles.map((bodystyle, index) => (
                                facelift.name === bodystyle.facelift.name ? (
                                    <ul className="list-group list-group-flush" key={index}>
                                        <Link className="list-group-item text-capitalize" to={`/catalog/${make}/${model}/${generationId}/${bodystyle.id}`}>{bodystyle.name}</Link>
                                    </ul>
                                ) : (<div></div>)
                            ))
                            }
                        </div>
                    </div>
                ))
                }
            </div>
        </div>
    )
}
