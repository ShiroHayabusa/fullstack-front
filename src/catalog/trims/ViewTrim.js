import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function ViewTrim() {

    const [trim, setTrim] = useState({
        name: '',
        bodystyle: ''
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
                                <img src={`https://newloripinbucket.s3.amazonaws.com/image/catalog/${make || 'defaultMake'}/${model || 'defaultModel'}/${trim.bodystyle.generation?.name || 'defaultGeneration'}/${trim.bodystyle?.facelift?.name || 'defaultBodystyle'}/${trim?.bodystyle?.bodytype?.name}/${trim.name}/${trim?.photo?.name || 'defaultImage.jpg'}`} className="img-thumbnail"></img>
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
