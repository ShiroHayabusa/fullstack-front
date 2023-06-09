import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function ViewBodystyle() {

    const [trims, setTrims] = useState([]);
    const [bodystyle, setBodystyle] = useState({
        name:'',
        generation: ''
    });

    const { make, model, generationId, bodystyleId } = useParams();

    useEffect(() => {
        loadTrims()
    }, []);

    useEffect(() => {
        loadBodystyle()
    }, []);

    const loadTrims = async () => {
        const result = await axios.get('http://localhost:8080/catalog/' + make + '/' + model 
        + '/' + generationId + '/' + bodystyleId + '/listTrim');
        setTrims(result.data);
    }

    const loadBodystyle = async () => {
        const result = await axios.get(`http://localhost:8080/catalog/` + make + '/'
        + model + '/' + generationId + '/' + bodystyleId);
        setBodystyle(result.data);
    }

    return (
        <div>
            <ul class="nav">
                <li class="nav-item">
                    <Link class="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/${generationId}/${bodystyleId}/addTrim`}
                    >Add Trim</Link>
                </li>
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
                    <ul className="list-group list-group-flush" key={index}>
                        <Link className="list-group-item" to={`/catalog/${make}/${model}/${bodystyle.generation.id}/${bodystyleId}/${trim.id}`}>{trim.name}</Link>
                    </ul>
                ))
                }
            </div>
        </div>
    )
}
