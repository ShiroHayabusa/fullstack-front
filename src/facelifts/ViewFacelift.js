import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function ViewFacelift() {

    const [trims, setTrims] = useState([]);

    const { make, model, generation, facelift } = useParams();

    useEffect(() => {
        loadTrims()
    }, []);

    const loadTrims = async () => {
        const result = await axios.get('http://localhost:8080/catalog/' + make + '/' + model + '/' + facelift);
        setTrims(result.data);
    }

    return (
        <div>
            <ul class="nav">
                <li class="nav-item">
                    <Link class="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/${generation}/${facelift}/addTrim`}
                    >Add Bodystyle</Link>
                </li>
            </ul>
            <div className='container'>
                {trims.map((trim, index) => (
                    <ul className="list-group list-group-flush" key={index}>
                        <Link className="list-group-item" to={`/catalog/${make}/${model}/${generation}/${facelift}/${trim.name}`}>{trim.name}</Link>
                    </ul>
                ))
                }
            </div>
        </div>
    )
}
