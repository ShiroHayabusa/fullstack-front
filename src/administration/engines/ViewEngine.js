import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function ViewEngine() {

    const [engine, setEngine] = useState({
        name: '',
        displacement: '',
        power: '',
        engineType: '',
        torque: '',
        fuel: '',
        make: '',
        description: ''
    });

    const { make, engineId } = useParams();

    useEffect(() => {
        loadEngine()
    }, []);

    const loadEngine = async () => {
        const result = await axios.get(
            `http://localhost:8080/administration/engines/${make}/${engineId}`);
        setEngine(result.data);
    }

    return (

        <div>
            <ul className="nav">
                <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to={`/administration/engines/${make}/${engineId}/editEngine`}
                    >Edit Engine</Link>
                </li>
            </ul>

            <div className='container'>


                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li class="breadcrumb-item"><a href="/administration" className="text-decoration-none">Administration</a></li>
                        <li class="breadcrumb-item"><a href="/administration/engines" className="text-decoration-none">Engines</a></li>
                        <li class="breadcrumb-item"><a href={`/administration/engines/${make}/`} className="text-decoration-none">{make}</a></li>
                        <li class="breadcrumb-item active" aria-current="page">{engine.name}</li>
                    </ol>
                </nav>
                <div className="h5 pb-1 mb-4 text-black border-bottom border-black text-start">
                    {make + ' ' + engine.name}
                </div>

                <div className="row">
                    <div className="col-lg-4 border">
                        <div>
                            Year
                        </div>
                        <div>
                            Description
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <a className="nav-link active" href="#">Specs</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" aria-current="page" href="#">Photo</a>
                                <img src={`https://newloripinbucket.s3.amazonaws.com/image/engines/${make}/${engine.name}/${engine?.photo?.name}`} className="img-thumbnail"></img>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Video</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link disabled">Spots</a>
                            </li>
                        </ul>
                    </div>
                    <div class="col-lg-4 border">

                        <div className="mb-3">
                            <label for="exampleFormControlTextarea1" className="form-label">Comments</label>
                            <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
