import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { useAuth } from '../../context/AuthContext';

export default function EditGeneration() {

    const { make, model, generationId } = useParams();
    let navigate = useNavigate();

    const [generationEntity, setGenerationEntity] = useState({
        name: "",
        years: "",
        bodyIds: [],
        description: "",
        photo: ""
    });

    const [bodyList, setBodyList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedBodies, setSelectedBodies] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchGenerationEntity = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}/${generationId}/editGeneration`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setGenerationEntity({
                    name: response.data.name,
                    years: response.data.years,
                    bodyIds: response.data.bodies ? response.data.bodies.map(b => b.id) : [],
                    description: response.data.description,
                    photo: response.data.photo
                });
            } catch (error) {
                setError('Error fetching generation details: ' + error.message);
            }
        };

        const fetchBodies = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/bodies/${make}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setBodyList(response.data);
            } catch (error) {
                console.log('Error fetching bodies:', error);
            }
        };

        fetchGenerationEntity();
        fetchBodies();
    }, [generationId]);

    const options = bodyList.map(body => ({
        value: body.id,
        label: body.name
    }));

    const handleChange = (selectedOptions) => {
        setSelectedBodies(selectedOptions);
        setGenerationEntity(prevState => ({
            ...prevState,
            bodyIds: selectedOptions ? selectedOptions.map(option => option.value) : []
        }));
    };

    useEffect(() => {
        if (bodyList.length > 0 && generationEntity.bodyIds.length > 0) {
            const initialSelected = bodyList
                .filter(body => generationEntity.bodyIds.includes(body.id))
                .map(body => ({ value: body.id, label: body.name }));
            setSelectedBodies(initialSelected);
        }
    }, [bodyList, generationEntity.bodyIds]);

    const onInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setGenerationEntity({
            ...generationEntity,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!generationEntity) {
            setError('Please provide a make name.');
            return;
        }

        const formData = new FormData();
        formData.append('name', generationEntity.name);
        formData.append('years', generationEntity.years);

        if (generationEntity.bodyIds && generationEntity.bodyIds.length > 0) {
            generationEntity.bodyIds.forEach(bodyId => {
                formData.append('bodyIds', bodyId);
            });
        }

        formData.append('description', generationEntity.description);
        if (selectedFile) {
            formData.append('photo', selectedFile);
        }

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}/${generationId}/editGeneration`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (response.status === 200) {
                setSuccess('Make updated successfully');
                setError('');
                navigate(`/catalog/${make}/${model}/${generationId}`);
            }
        } catch (error) {
            setError('Error updating make: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item"><a href='/catalog' className="text-decoration-none">Catalog</a></li>
                    <li className="breadcrumb-item"><a href={`/catalog/${make}`} className="text-decoration-none">{make}</a></li>
                    <li className="breadcrumb-item"><a href={`/catalog/${make}/${model}`} className="text-decoration-none">{model}</a></li>
                    <li className="breadcrumb-item"><a href={`/catalog/${make}/${model}/${generationId}`} className="text-decoration-none">{generationEntity.name}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Edit generation</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Edit Generation</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={onSubmit}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Generation</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Enter generation'
                                name='name'
                                value={generationEntity.name}
                                onChange={onInputChange}
                            />
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='years' className='form-label'>Years</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Enter years'
                                name='years'
                                value={generationEntity.years}
                                onChange={onInputChange}
                            />
                        </div>
                        <Select
                            className='mb-3'
                            isMulti
                            options={options}
                            value={selectedBodies}
                            onChange={handleChange}
                            placeholder="Select body"
                        />

                        <div className='mb-3'>
                            <textarea
                                type='text'
                                className='form-control'
                                placeholder='Enter description'
                                style={{ height: '310px' }}
                                name='description'
                                value={generationEntity.description}
                                onChange={onInputChange}
                            />
                        </div>
                        <img
                            style={{ width: '40px', height: 'auto' }}
                            src={`https://newloripinbucket.s3.amazonaws.com/image/catalog/${make || 'defaultMake'}/${model || 'defaultModel'}/${generationEntity.name || 'defaultGeneration'}/${generationEntity?.photo?.name || 'defaultImage.jpg'}`}
                            className="mb-3"
                            alt="...">
                        </img>
                        <div className='mb-3'>
                            <input
                                type='file'
                                className='form-control'
                                name='photo'
                                onChange={handleFileChange}
                            />
                        </div>

                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/catalog/${make}/${model}/${generationId}`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
