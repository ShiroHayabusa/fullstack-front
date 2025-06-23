import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';
import Masonry from 'react-masonry-css';
import '../../components/Masonry.css'

export default function ViewBody() {

    const breakpointColumnsObj = {
        default: 5,
        1100: 4,
        700: 3,
        500: 2
    };

    const [body, setBody] = useState({
        name: '',
        make: '',
        description: ''
    });
    const [trims, setTrims] = useState([]);

    const { make, bodyId } = useParams();
    const { user } = useAuth();

    useEffect(() => {
        loadBody();
        loadTrims();
    }, []);

    const loadBody = async () => {
        const result = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/bodies/${make}/${bodyId}`);
        setBody(result.data);
    }

    const loadTrims = async () => {
        const result = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/bodies/${bodyId}/trims`);
        setTrims(result.data);
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
                    <div className="row row-cols-2 row-cols-md-5">
                        <Masonry
                            breakpointCols={breakpointColumnsObj}
                            className="my-masonry-grid"
                            columnClassName="my-masonry-grid_column"
                        >
                            {trims.map((trim) => (

                                <Link
                                    className='text-decoration-none text-dark text-center mb-3'
                                    to={`/catalog/${trim.make.name}/${trim.model.id}/${trim.bodystyle.generation?.id}/${trim.bodystyle.id}/${trim.id}`} key={trim.id}>
                                    <img
                                        src={`https://newloripinbucket.s3.amazonaws.com/image/spots/${trim.spotUser}/${trim.spotId}/${trim.photoName}`}
                                        className="img-fluid"
                                        alt=''
                                        onError={(e) => {
                                            e.target.src = 'https://newloripinbucket.s3.amazonaws.com/image/placeholder_400x400.png'; // Placeholder image
                                        }}
                                    />
                                    <div className="fw-bold">{trim.years}</div>
                                    <div>{trim.make.name} {trim.model.name} {trim.name}</div>
                                </Link>
                            ))}
                        </Masonry>
                    </div>
                </div>
            </div>
        </div>
    )
}
