import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AddFacelift() {

    let navigate = useNavigate();

    const [facelift, setFacelift] = useState({
        name: "",
        description: ""
    });

    const { name, description } = facelift;
    const { make, model, generation } = useParams();
    const [modelDetails, setModelDetails] = useState(null);

    const [generationEntity, setGenerationEntity] = useState(null);

    const { user } = useAuth();

    const loadGenerationEntity = async () => {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}/${generation}/editGeneration`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });
        setGenerationEntity(result.data);
    }

    const loadModelDetails = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}`);
            setModelDetails(result.data);
        } catch (error) {
            console.error('Error loading model details:', error);
        }
    };

    useEffect(() => {
        loadGenerationEntity();
        loadModelDetails();
    }, [])

    const onInputChange = (e) => {
        setFacelift({ ...facelift, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);

        await axios.post(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}/${generation}/addFacelift`, formData, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });
        navigate(`/catalog/${make}/${model}/${generation}`);
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb mt-2">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item"><a href="/catalog" className="text-decoration-none">Catalog</a></li>
                    <li className="breadcrumb-item"><Link to={`/catalog/${make}`} className="text-decoration-none">{make}</Link></li>
                    <li className="breadcrumb-item"><Link to={`/catalog/${make}/${model}`} className="text-decoration-none">{modelDetails?.name}</Link></li>
                    <li className="breadcrumb-item"><Link to={`/catalog/${make}/${model}/${generation}`} className="text-decoration-none">{generationEntity?.name}</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Add facelift</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Add facelift</h2>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Name</label>
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter facelift'
                                name='name'
                                value={name}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className='mb-3'>
                            <textarea
                                type={'text'}
                                className='form-control'
                                placeholder='Enter description'
                                name='description'
                                value={description}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/catalog/${make}/${model}/${generation}`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
