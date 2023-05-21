import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function ViewUser() {

    const [models, setModels] = useState([]);

    const { make } = useParams();

    useEffect(() => {
        loadModels()
    }, []);

    const loadModels = async () => {
        const result = await axios.get(`http://localhost:8080/catalog/${make}`);
        setModels(result.data);
    }

    return (
        <div>
            <ul class="nav">
                <li class="nav-item">
                    <Link class="nav-link active" aria-current="page" to={`/catalog/${make}/addModel`}
                    >Add Model</Link>
                </li>
            </ul>
            <div className='container'>
                {models.map((model, index) => (
                    <ul className="list-group list-group-flush" key={index}>
                        <Link className="list-group-item" to={`/catalog/${make}/${model.name}`}>{model.name}</Link>
                    </ul>
                ))
                }
            </div>
        </div>
    )
}
