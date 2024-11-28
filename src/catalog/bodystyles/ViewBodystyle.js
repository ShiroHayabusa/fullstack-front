import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function ViewBodystyle() {

    const [trims, setTrims] = useState([]);
    const [bodystyle, setBodystyle] = useState({
        name: '',
        generation: '',
        facelift: ''
    });

    const { make, model, generationId, bodystyleId } = useParams();

    useEffect(() => {
        loadTrims()
    }, []);

    useEffect(() => {
        loadBodystyle()
    }, []);

    const loadTrims = async () => {
        const result = await axios.get(
            `http://localhost:8080/catalog/${make}/${model}/${generationId}/${bodystyleId}/listTrim`);
        setTrims(result.data);
        console.log(result.data)
    }

    const loadBodystyle = async () => {
        const result = await axios.get(
            `http://localhost:8080/catalog/${make}/${model}/${generationId}/${bodystyleId}`);
        setBodystyle(result.data);
    }

    return (
        <div>
            <ul class="nav">

                <Link class="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/${generationId}/${bodystyleId}/addTrim`}
                >Add Trim</Link>
                <Link class="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/${generationId}/${bodystyleId}/editBodystyle`}
                >Edit bodystyle</Link>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li class="breadcrumb-item"><a href="/catalog" className="text-decoration-none">Catalog</a></li>
                        <li class="breadcrumb-item"><a href={`/catalog/${make}`} className="text-decoration-none">{make}</a></li>
                        <li class="breadcrumb-item"><a href={`/catalog/${make}/${model}`} className="text-decoration-none">{model}</a></li>
                        <li class="breadcrumb-item"><a href={`/catalog/${make}/${model}/${bodystyle.generation.id}`} className="text-decoration-none">{bodystyle.generation.name}</a></li>
                        <li class="breadcrumb-item active" aria-current="page">{bodystyle.bodytype?.name}</li>
                    </ol>
                </nav>

                {trims.map((trim, index) => {
                    const mainPhoto = Array.isArray(trim.photos) && trim.photos.length > 0
                        ? trim.photos.find((photo) => photo.isMain)
                        : {};
                    return (
                        <div className="card mb-3" key={index} >
                            <div className="row g-0">
                                <div className="col-md-4">
                                    <img
                                        src={`https://newloripinbucket.s3.amazonaws.com/image/catalog/${make || 'defaultMake'}/${model || 'defaultModel'}/${bodystyle.generation.name || 'defaultGeneration'}/${bodystyle.facelift.name || 'defaultBodystyle'}/${bodystyle.bodytype?.name}/${trim.name}/${mainPhoto.name || 'defaultImage.jpg'}`}
                                        className="img-fluid rounded-start"
                                        style={{ maxWidth: '100%', height: 'auto' }}
                                        onError={(e) => {
                                            e.target.src = 'https://newloripinbucket.s3.amazonaws.com/image/placeholder_400x400.png'; // Путь к резервному изображению
                                        }}
                                    ></img>
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            <Link to={`/catalog/${make}/${model}/${bodystyle.generation.id}/${bodystyleId}/${trim.id}`} className="text-decoration-none">{trim.name}</Link>
                                        </h5>
                                        <p className="card-text">{trim.years}</p>
                                        <p className="card-text"><small className="text-body-secondary">{trim.hybrid}</small></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    );

                })}

            </div>
        </div>

    )
}
