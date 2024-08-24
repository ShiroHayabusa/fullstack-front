import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function EditGeneration() {

    const { make, model, generationId } = useParams();
    let navigate = useNavigate();

    const [generationEntity, setGenerationEntity] = useState({
        name: "",
        years: "",
        body: "",
        description: "",
        photo: ""
    });

    const [bodyList, setBodyList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Fetch the current details of the generation
        const fetchGenerationEntity = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/catalog/${make}/${model}/${generationId}/editGeneration`);
                setGenerationEntity({
                    name: response.data.name,
                    years: response.data.years,
                    body: response.data.body?.id || "",
                    description: response.data.description,
                    photo: response.data.photo
                });
                console.log("generation:", response.data)
            } catch (error) {
                setError('Error fetching generation details: ' + error.message);
            }
        };

        const fetchBodies = async () => {
            try {
                const response = await axios.get('http://localhost:8080/administration/bodies');
                setBodyList(response.data);
            } catch (error) {
                console.log('Error fetching bodies:', error);
            }
        };

        fetchGenerationEntity();
        fetchBodies();
    }, [generationId]);

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
        formData.append('body', generationEntity.body);
        formData.append('description', generationEntity.description);
        if (selectedFile) {
            formData.append('photo', selectedFile);
        }

        try {
            const response = await axios.put(`http://localhost:8080/catalog/${make}/${model}/${generationId}/editGeneration`, formData);

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
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="/">Home</a></li>
                    <li class="breadcrumb-item"><a href='/catalog'>Catalog</a></li>
                    <li class="breadcrumb-item"><a href={`/catalog/${make}`}>{make}</a></li>
                    <li class="breadcrumb-item"><a href={`/catalog/${make}/${model}`}>{model}</a></li>
                    <li class="breadcrumb-item"><a href={`/catalog/${make}/${model}/${generationId}`}>{generationEntity.name}</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Edit make</li>
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
                        <select
                            onChange={onInputChange}
                            name="body"
                            className="form-select mt-3 mb-3"
                            value={generationEntity.body}
                        >
                            <option value={"default"}>
                                Select body
                            </option>
                            {bodyList.map((body) => (
                                <option key={body.id} value={body.id}>
                                    {body.name}
                                </option>
                            ))}
                        </select>
                        <div className='mb-3'>
                            <textarea
                                type='text'
                                className='form-control'
                                placeholder='Enter description'
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
