import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function ViewGeneration() {
    const [bodystyles, setBodystyles] = useState([]);
    const [facelifts, setFacelifts] = useState([]);
    const [generation, setGeneration] = useState({
        name: ''
    });

    const { make, model, generationId } = useParams();

    // Объединяем все вызовы данных в один useEffect
    useEffect(() => {
        const loadData = async () => {
            await Promise.all([loadFacelifts(), loadBodystyles(), loadGeneration()]);
        };
        loadData();
    }, []);

    const loadFacelifts = async () => {
        const result = await axios.get(`http://localhost:8080/catalog/${make}/${model}/${generationId}/faceliftList`);
        setFacelifts(result.data);
    };

    const loadBodystyles = async () => {
        const result = await axios.get(`http://localhost:8080/catalog/${make}/${model}/${generationId}/bodystyles`);
        setBodystyles(result.data);
    };

    const loadGeneration = async () => {
        const result = await axios.get(`http://localhost:8080/catalog/${make}/${model}/${generationId}`);
        setGeneration(result.data);
    };

    return (
        <div>
            <ul className="nav">
                <Link className="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/${generationId}/addFacelift`}>Add facelift</Link>
                <Link className="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/${generationId}/addBodystyle`}>Add bodystyle</Link>
                <Link className="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/${generationId}/editGeneration`}>Edit generation</Link>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item"><a href="/catalog" className="text-decoration-none">Catalog</a></li>
                        <li className="breadcrumb-item"><a href={`/catalog/${make}`} className="text-decoration-none">{make}</a></li>
                        <li className="breadcrumb-item"><a href={`/catalog/${make}/${model}`} className="text-decoration-none">{model}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{generation.name}</li>
                    </ol>
                </nav>
                {facelifts.map((facelift) => (
                    <div className="h4 pb-2 text-secondary text-start border-bottom border-secondary" key={facelift.id}>
                        {facelift.name}
                        <Link to={`/catalog/${make}/${model}/${generationId}/${facelift.id}/editFacelift`} className="ms-3 text-decoration-none">Edit facelift</Link>
                        <div className="mt-3">
                            <div className="row row-cols-1 row-cols-md-3 g-3">
                                {bodystyles.filter(bodystyle => bodystyle.facelift.name === facelift.name).map((bodystyle) => (
                                    <div className="col" key={bodystyle.id}>
                                        <div className="card">
                                            <img
                                                src={`https://newloripinbucket.s3.amazonaws.com/image/catalog/${make || 'defaultMake'}/${model || 'defaultModel'}/${generation.name || 'defaultGeneration'}/${bodystyle.facelift.name}/${bodystyle.bodytype?.name || 'defaultBodystyle'}/${bodystyle?.photo?.name || 'defaultImage.jpg'}`}
                                                alt={bodystyle.name || "Default Image"}
                                                className="card-img-top"
                                            />
                                            <div className="card-body">
                                                <h5 className="card-title">
                                                    <Link to={`/catalog/${make}/${model}/${generationId}/${bodystyle.id}`} className="text-decoration-none">{bodystyle.bodytype?.name}</Link>
                                                </h5>
                                                <p className="card-text">{bodystyle.years}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
