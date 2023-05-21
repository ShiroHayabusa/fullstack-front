import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function ViewGeneration() {
    const [bodystyles, setBodystyles] = useState([]);
    const [facelifts, setFacelifts] = useState([]);


    const { make, model, generation } = useParams();

    useEffect(() => {
        loadFacelifts()
    }, []);

    useEffect(() => {
        loadBodystyles()
    }, []);

    const loadFacelifts = async () => {
        const result = await axios.get(`http://localhost:8080/catalog/` + make + '/' + model + '/' + generation);
        setFacelifts(result.data);
    }

    const loadBodystyles = async () => {
        const result = await axios.get(`http://localhost:8080/catalog/` + make + '/' + model + '/' + generation);
        setBodystyles(result.data);
    }


    return (
        <div>
            <ul class="nav">
                <Link class="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/${generation}/addFacelift`}
                >Add facelift</Link>
                <Link class="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/${generation}/addBodystyle`}
                >Add bodystyle</Link>
            </ul>
            <div className='container'>
                {bodystyles.map((bodystyle, index) => (
                    <ul className="list-group list-group-flush" key={index}>
                        <Link className="list-group-item" to={`/catalog/${make}/${model}/${generation}/${bodystyle.id}`}>{bodystyle.name}</Link>
                    </ul>
                ))
                }
                {facelifts.map((facelift, index) => (
                    <div class="h4 pb-2 text-secondary text-start border-bottom border-secondary" key={index}>
                        {facelift.name}
                    </div>
                ))
                }

            </div>
        </div>
    )
}
