import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';

export default function ViewBody() {

    const [body, setBody] = useState({
        name: '',
        make: '',
        description: ''
    });

    const { make, bodyId } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        loadBody()
    }, []);

    const loadBody = async () => {
        const result = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/bodies/${make}/${bodyId}`);
        setBody(result.data);
    }

    return (

        <div>
            {user?.roles.includes("ROLE_ADMIN") && (
                <ul className="nav">
                    <li className="nav-item">
                        <Link className="nav-link active" aria-current="page" to={`/admin/bodies/${make}/${bodyId}/editBody`}
                        >Edit body</Link>
                    </li>
                </ul>
            )}

            <div className='container'>


                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mt-3">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item"><a href="/bodies" className="text-decoration-none">Bodies</a></li>
                        <li className="breadcrumb-item"><a href={`/bodies/${make}/`} className="text-decoration-none">{make}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{body.name}</li>
                    </ol>
                </nav>
                <div className="h5 pb-1 mb-4 text-black border-bottom border-black text-start">
                    {make + ' ' + body.name}
                </div>

                <div className="row">
                    <div className="col-lg-4 border">
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

                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Video</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link disabled">Spots</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-lg-4 border">

                        <div className="mb-3">
                            <label htmlFor="exampleFormControlTextarea1" className="form-label">Comments</label>
                            <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
