import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function ViewTrim() {

    const [trim, setTrim] = useState({
        name: '',
        bodystyle: '',
        description: '',
        engine: '',
        transmission: '',
        body: '',
        drivetrain: '',
        years: '',
        tuner: '',
        amount: '',
        maxSpeed: '',
        acceleration: '',
        weight: '',
        uniq: '',
        electric: '',
        hybrid: '',
        battery: '',
        range: '',
        market: ''
    });

    const { make, model, generationId, bodystyleId, trimId } = useParams();

    useEffect(() => {
        loadTrim()
    }, []);

    const loadTrim = async () => {
        const result = await axios.get(
            `http://localhost:8080/catalog/${make}/${model}/${generationId}/${bodystyleId}/${trimId}`);
        setTrim(result.data);
    }

    return (

        <div>
            <ul className="nav">
                <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/${generationId}/${bodystyleId}/${trim.id}/editTrim`}
                    >Edit Trim</Link>
                </li>
            </ul>

            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li class="breadcrumb-item"><a href="/catalog" className="text-decoration-none">Catalog</a></li>
                        <li class="breadcrumb-item"><a href={`/catalog/${make}`} className="text-decoration-none">{make}</a></li>
                        <li class="breadcrumb-item"><a href={`/catalog/${make}/${model}`} className="text-decoration-none">{model}</a></li>
                        <li class="breadcrumb-item"><a href={`/catalog/${make}/${model}/${generationId}`} className="text-decoration-none">{trim.bodystyle.generation?.name}</a></li>
                        <li class="breadcrumb-item"><a href={`/catalog/${make}/${model}/${generationId}/${bodystyleId}`} className="text-decoration-none">{trim.bodystyle.bodytype?.name}</a></li>
                        <li class="breadcrumb-item active" aria-current="page">{trim.name}</li>
                    </ol>
                </nav>

                <div className="h5 pb-1 mb-4 text-black border-bottom border-black text-start">
                    {make + ' ' + model + ' ' + trim.name}
                </div>

                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
                    <div className="col">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item text-start">
                                Years of production: {trim.years}
                            </li>
                            <li class="list-group-item text-start">
                                Market: {trim.market?.name}
                            </li>
                            <li class="list-group-item text-start">
                                Amount: {trim.amount}
                            </li>
                            <li class="list-group-item text-start">
                                {trim.description}
                            </li>
                            <li class="list-group-item text-start">
                                Engine: <Link to={`/administration/engines/${make}/${trim.engine?.id}`} className="text-decoration-none">{trim.engine?.name}</Link>
                                <p>{trim.engine?.displacement} {trim.engine?.power} {trim.engine?.torque}</p>
                            </li>
                            <li class="list-group-item text-start">
                                Transmission: <Link to={`/administration/transmissions/${make}/${trim.transmission?.id}`} className="text-decoration-none">{trim.transmission?.name}</Link>
                                <p>{trim.transmission?.transmissionType?.name}</p>
                            </li>
                            <li class="list-group-item text-start">
                                Body: {trim.body?.name}
                            </li>
                            <li class="list-group-item text-start">
                                Drivetrain: {trim.drivetrain?.name}
                            </li>
                        </ul>
                    </div>
                    <div className="col">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item text-start">
                                Max speed: {trim.maxSpeed}
                            </li>
                            <li class="list-group-item text-start">
                                Acceleration: {trim.acceleration}
                            </li>
                            <li class="list-group-item text-start">
                                Weight: {trim.weight}
                            </li>
                            <li class="list-group-item text-start">
                                Length: {trim.bodystyle.length}
                            </li>
                            <li class="list-group-item text-start">
                                Width: {trim.bodystyle.width}
                            </li>
                            <li class="list-group-item text-start">
                                Height: {trim.bodystyle.height}
                            </li>
                            <li class="list-group-item text-start">
                                Wheelbase: {trim.bodystyle.base}
                            </li>
                        </ul>
                    </div>
                    <div className="col">
                        <img
                            src={`https://newloripinbucket.s3.amazonaws.com/image/catalog/${make}/${model}/${trim.bodystyle.generation?.name}/${trim.bodystyle?.facelift?.name}/${trim?.bodystyle?.bodytype?.name}/${trim.name}/${trim?.photo?.name}`} className="img-thumbnail">
                        </img>
                    </div>
                </div>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2">
                    <div class="col border">
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
