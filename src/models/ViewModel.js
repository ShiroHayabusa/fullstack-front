import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function ViewModel() {

    const [generations, setGenerations] = useState([]);

    const { make, model } = useParams();

    useEffect(() => {
        loadGenerations()
    }, []);

    const loadGenerations = async () => {
        const result = await axios.get(`http://localhost:8080/catalog/` + make + '/' + model);
        setGenerations(result.data);
    }

    return (
        <div>
            <ul class="nav">
                <li class="nav-item">
                    <Link class="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/addGeneration`}
                    >Add Generation</Link>
                </li>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/">Home</a></li>
                        <li class="breadcrumb-item"><a href="/catalog">Catalog</a></li>
                        <li class="breadcrumb-item"><Link to={`/catalog/${make}`}>{make}</Link></li>
                        <li class="breadcrumb-item active" aria-current="page">{model}</li>
                    </ol>
                </nav>
                {generations.map((generation, index) => (
                    <ul className="list-group list-group-flush" key={index}>
                        <Link className="list-group-item" to={`/catalog/${make}/${model}/${generation.id}`}>{generation.name}</Link>
                    </ul>
                ))
                }
            </div>
        </div>
    )
}
