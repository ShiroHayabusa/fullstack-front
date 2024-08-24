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
                        <li class="breadcrumb-item"><a href="/">Home</a></li>
                        <li class="breadcrumb-item"><a href="/catalog">Catalog</a></li>
                        <li class="breadcrumb-item"><Link to={`/catalog/${make}`}>{make}</Link></li>
                        <li class="breadcrumb-item"><Link to={`/catalog/${make}/${model}`}>{model}</Link></li>
                        <li class="breadcrumb-item"><Link to={`/catalog/${make}/${model}/${bodystyle.generation.id}`}>{bodystyle.generation.name}</Link></li>
                        <li class="breadcrumb-item active" aria-current="page">{bodystyle.name}</li>
                    </ol>
                </nav>

                {trims.map((trim, index) => (
                    <div className="card mb-3" >
                        <div className="row g-0">
                            <div className="col-md-4">
                                <img
                                    src={`https://newloripinbucket.s3.amazonaws.com/image/catalog/${make || 'defaultMake'}/${model || 'defaultModel'}/${bodystyle.generation.name || 'defaultGeneration'}/${bodystyle.facelift.name || 'defaultBodystyle'}/${bodystyle.name}/${trim.name}/${trim?.photo?.name || 'defaultImage.jpg'}`}
                                    className="img-fluid rounded-start"
                                ></img>
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        <Link to={`/catalog/${make}/${model}/${bodystyle.generation.id}/${bodystyleId}/${trim.id}`}>{trim.name}</Link>
                                    </h5>
                                    <p className="card-text">{trim.years}</p>
                                    <p className="card-text"><small className="text-body-secondary">{trim.hybrid}</small></p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
                }
            </div>
        </div>

    )
}
