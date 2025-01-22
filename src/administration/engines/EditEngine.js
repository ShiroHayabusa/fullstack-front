import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function EditEngine() {

    const { make, engineId } = useParams();
    let navigate = useNavigate();

    const [engine, setEngine] = useState({
        name: '',
        displacement: '',
        power: '',
        engineType: '',
        torque: '',
        fuel: '',
        description: ''
    });
    const [engineTypes, setEngineTypes] = useState([]);
    const [fuels, setFuels] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchEngine = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/engines/${make}/${engineId}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setEngine({
                    name: response.data.name,
                    displacement: response.data.displacement,
                    power: response.data.power,
                    engineType: response.data.engineType?.id,
                    torque: response.data.torque,
                    fuel: response.data.fuel?.id,
                    description: response.data.description,
                    photo: response.data.photo
                });
            } catch (error) {
                setError('Error fetching engine details: ' + error.message);
            }
        };

        fetchEngine();
        fetchEngineTypes();
        fetchFuels()
    }, []);

    const fetchEngineTypes = () => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/api/admin/engineTypes`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    setEngineTypes(data)
                } 
                
            })
            .catch((error) => console.log(error));
    };

    const fetchFuels = () => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/api/admin/fuels`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    setFuels(data)
                } 
            })
            .catch((error) => console.log(error));
    };

    const onInputChange = (e) => {
        setEngine({ ...engine, [e.target.name]: e.target.value });
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!engine.name) {
            setError('Please provide a engine name.');
            return;
        }

        const formData = new FormData();

        Object.keys(engine).forEach(key => {
            formData.append(key, engine[key]);
        });

        if (selectedFile) {
            formData.append('photo', selectedFile);
        }

        if (engine.engineType) {
            formData.append('engineTypeId', engine.engineType);
        }

        if (engine.fuel) {
            formData.append('fuelId', engine.fuel);
        }

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/engines/${make}/${engineId}`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (response.status === 200) {
                setSuccess('Engine updated successfully');
                setError('');
                navigate(`/admin/engines/${make}/${engineId}`);
            }
        } catch (error) {
            setError('Error updating engine: ' + error.message);
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb mt-3">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item"><a href='/admin' className="text-decoration-none">Administration</a></li>
                    <li className="breadcrumb-item"><a href='/admin/engines' className="text-decoration-none">Engines</a></li>
                    <li className="breadcrumb-item"><a href={`/admin/engines/${make}`} className="text-decoration-none">{make}</a></li>
                    <li className="breadcrumb-item"><a href={`/admin/engines/${make}/${engineId}`} className="text-decoration-none">{engine.name}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Edit engine</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Edit Engine</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={onSubmit}>

                        <input
                            type='text'
                            className='form-control mt-3 mb-3'
                            placeholder='Enter engine name'
                            name='name'
                            value={engine.name}
                            onChange={onInputChange}
                        />

                        <select
                            onChange={onInputChange}
                            name='engineType'
                            className="form-select mt-3 mb-3"
                            value={engine.engineType}
                        >
                            <option value={"default"}>
                                Select engine type
                            </option>
                            {engineTypes.map((engineType) => (
                                <option key={engineType.id} value={engineType.id} >
                                    {engineType.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type='text'
                            className='form-control mt-3 mb-3'
                            placeholder='Enter displacement'
                            name='displacement'
                            value={engine.displacement}
                            onChange={onInputChange}
                        />

                        <input
                            type='text'
                            className='form-control mt-3 mb-3'
                            placeholder='Enter power'
                            name='power'
                            value={engine.power}
                            onChange={onInputChange}
                        />

                        <input
                            type='text'
                            className='form-control mt-3 mb-3'
                            placeholder='Enter torque'
                            name='torque'
                            value={engine.torque}
                            onChange={onInputChange}
                        />

                        <select
                            onChange={onInputChange}
                            name='fuel'
                            className="form-select mt-3 mb-3"
                            value={engine.fuel}
                        >
                            <option value={"default"}>
                                Select fuel
                            </option>
                            {fuels.map((fuel) => (
                                <option key={fuel.id} value={fuel.id} >
                                    {fuel.name}
                                </option>
                            ))}
                        </select>

                        <textarea
                            type='text'
                            className='form-control mt-3 mb-3'
                            placeholder='Enter description'
                            name='description'
                            value={engine.description}
                            onChange={onInputChange}
                        />

                        <img
                            style={{ width: '40px', height: 'auto' }}
                            src={`https://newloripinbucket.s3.amazonaws.com/image/engines/${make}/${engine.name}/${engine?.photo?.name || 'defaultImage.jpg'}`}
                            className="mb-3"
                            alt="...">
                        </img>

                        <input
                            type='file'
                            className='form-control mt-3 mb-3'
                            name='photo'
                            onChange={handleFileChange}
                        />

                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/admin/engines/${make}/${engineId}`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
