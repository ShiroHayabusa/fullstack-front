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
                    <li class="breadcrumb-item"><a href="/">Home</a></li>
                    <li class="breadcrumb-item"><a href="/catalog">Catalog</a></li>
                    <li class="breadcrumb-item"><Link to={`/catalog/${make}`}>{make}</Link></li>
                    <li class="breadcrumb-item"><Link to={`/catalog/${make}/${model}`}>{model}</Link></li>
                    <li class="breadcrumb-item"><Link to={`/catalog/${make}/${model}/${generationId}`}>{trim.bodystyle.generation?.name}</Link></li>
                    <li class="breadcrumb-item"><Link to={`/catalog/${make}/${model}/${generationId}/${bodystyleId}`}>{trim.bodystyle.name}</Link></li>
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
                                <img src={`https://newloripinbucket.s3.amazonaws.com/image/${make || 'defaultMake'}/${model || 'defaultModel'}/${trim.bodystyle.generation?.name || 'defaultGeneration'}/${trim.bodystyle?.facelift?.name || 'defaultBodystyle'}/${trim?.bodystyle?.name}/${trim.name}/${trim?.photo?.name || 'defaultImage.jpg'}`} className="img-thumbnail"></img>
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
