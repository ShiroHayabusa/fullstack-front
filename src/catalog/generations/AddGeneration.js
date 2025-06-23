import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { useAuth } from '../../context/AuthContext';

export default function AddGeneration() {

    let navigate = useNavigate();

    const [generation, setGeneration] = useState({
        name: "",
        years: "",
        description: "",
        bodyIds: []
    });
    const [bodyList, setBodyList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [modelDetails, setModelDetails] = useState(null);
    const { name, years, description } = generation;
    const { make, model } = useParams();
    const [selectedBodies, setSelectedBodies] = useState([]);
    const { user } = useAuth();

    const onInputChange = (e) => {
        setGeneration({ ...generation, [e.target.name]: e.target.value });
    };

    const loadModelDetails = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}`);
            setModelDetails(result.data);
        } catch (error) {
            console.error('Error loading model details:', error);
        }
    };

    const fetchBodies = () => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/api/bodies/${make}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    setBodyList(data)
                }
            })
            .catch((error) => console.log(error));
    };

    const options = bodyList.map(body => ({
        value: body.id,
        label: body.name
    }));

    const handleSelectChange = (selectedOptions) => {
        setSelectedBodies(selectedOptions);
        setGeneration(prevState => ({
            ...prevState,
            bodyIds: selectedOptions ? selectedOptions.map(option => option.value) : []
        }));
    };

    useEffect(() => {
        fetchBodies();
        loadModelDetails();
    }, [])

    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', generation.name);
        formData.append('years', generation.years);
        formData.append('description', generation.description);

        if (generation.bodyIds && generation.bodyIds.length > 0) {
            generation.bodyIds.forEach(bodyId => {
                formData.append('bodyIds', bodyId);
            });
        }

        if (selectedFile) {
            formData.append('photo', selectedFile);
        }
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/${modelDetails.id}/addGeneration`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (response.status === 200 || response.status === 201) {
                console.log('Generation added successfully');
                navigate(`/catalog/${make}/${model}`);
            }
        } catch (error) {
            console.error('Error adding generation: ', error);
        }
    };


    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    return (
        <div className='container'>
            <nav className='mt-2' aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item"><a href="/catalog" className="text-decoration-none">Catalog</a></li>
                    <li className="breadcrumb-item"><Link to={`/catalog/${make}`} className="text-decoration-none">{make}</Link></li>
                    <li className="breadcrumb-item"><Link to={`/catalog/${make}/${model}`} className="text-decoration-none">{modelDetails?.name}</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Add generation</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Add generation</h2>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Generation</label>
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter generation'
                                name='name'
                                value={name}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className='mb-3'>
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter years'
                                name='years'
                                value={years}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className='mb-3'>
                            <textarea
                                className='form-control'
                                placeholder='Enter description'
                                style={{ height: '310px' }}
                                name='description'
                                value={description}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className='mb-3'>
                            <Select
                                isMulti
                                options={options}
                                value={selectedBodies}
                                onChange={handleSelectChange}
                                placeholder="Select body"
                            />
                        </div>
                        <div className='mt-3 mb-3'>
                            <input
                                type="file"
                                className="form-control"
                                name='photo'
                                onChange={handleFileChange}
                            />
                        </div>

                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/catalog/${make}/${model}`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
