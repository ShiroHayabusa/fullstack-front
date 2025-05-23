import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function EditMake() {

    const { make } = useParams(); 
    let navigate = useNavigate();

    const [makeEntity, setMakeEntity] = useState({
        name: "",
        country: "",
        description: "",
        tuner: false,
        photo: ""
    });

    const [countryList, setCountryList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchMakeEntity = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/editMake/${make}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setMakeEntity({
                    name: response.data.name,
                    country: response.data.country?.id || "",
                    description: response.data.description,
                    tuner: response.data.tuner,
                    photo: response.data.photo
                });
            } catch (error) {
                setError('Error fetching make details: ' + error.message);
            }
        };

        const fetchCountries = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/countries`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setCountryList(response.data);
            } catch (error) {
                console.log('Error fetching countries:', error);
            }
        };

        fetchMakeEntity();
        fetchCountries();
    }, [make]);

    const onInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setMakeEntity({
            ...makeEntity,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!make) {
            setError('Please provide a make name.');
            return;
        }

        const formData = new FormData();
        formData.append('name', makeEntity.name);
        formData.append('country', makeEntity.country);
        formData.append('description', makeEntity.description);
        formData.append('tuner', makeEntity.tuner);
        if (selectedFile) {
            formData.append('photo', selectedFile);
        }

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/catalog/editMake/${make}`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (response.status === 200) {
                setSuccess('Make updated successfully');
                setError('');
                navigate(`/catalog/${makeEntity.name}`);
            }
        } catch (error) {
            setError('Error updating make: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className='container'>
            <nav className='mt-2' aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item"><a href='/catalog' className="text-decoration-none">Catalog</a></li>
                    <li className="breadcrumb-item"><a href={`/catalog/${make}`} className="text-decoration-none">{make}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Edit make</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Edit Make</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={onSubmit}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Make</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Enter make name'
                                name='name'
                                value={makeEntity.name}
                                onChange={onInputChange}
                            />
                        </div>
                        <select
                            onChange={onInputChange}
                            name="country"
                            className="form-select mt-3 mb-3"
                            value={makeEntity.country}
                        >
                            <option value={"default"}>
                                Select country
                            </option>
                            {countryList.map((country) => (
                                <option key={country.id} value={country.id}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                        <div className='mb-3'>
                            <textarea
                                type='text'
                                className='form-control'
                                placeholder='Enter description'
                                name='description'
                                style={{ height: '200px' }}
                                value={makeEntity.description}
                                onChange={onInputChange}
                            />
                        </div>
                        <img
                            style={{ width: '40px', height: 'auto' }}
                            src={`https://newloripinbucket.s3.amazonaws.com/image/catalog/${makeEntity.name || 'defaultMake'}/${makeEntity?.photo?.name || 'defaultImage.jpg'}`}
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
                        <div className="form-check form-switch mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="flexSwitchCheckDefault"
                                name="tuner"
                                checked={makeEntity.tuner}
                                onChange={onInputChange}
                            />
                            <label className="form-check-label text-start w-100" htmlFor="flexSwitchCheckDefault">Tuner</label>
                        </div>

                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/catalog/${makeEntity.name}`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
