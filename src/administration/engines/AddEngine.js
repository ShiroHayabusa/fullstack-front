import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AddEngine() {

    let navigate = useNavigate();

    const [engine, setEngine] = useState({
        name: "",
        displacement: "",
        power: "",
        engineType: "",
        torque: "",
        make: "",
        fuel: ""
    });
    const { make } = useParams();
    const [engineTypes, setEngineTypes] = useState([]);
    const [fuels, setFuels] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { name, displacement, power, engineType, torque, fuel, description } = engine;

    const { user } = useAuth();

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

    useEffect(() => {
        fetchEngineTypes();
        fetchFuels()
    }, [])

    const onInputChange = (e) => {
        setEngine({ ...engine, [e.target.name]: e.target.value });
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!name) {
            setError('Please provide an engine name and upload photo.');
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

        if (engine.make) {
            formData.append('makeId', engine.make);
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/engines/${make}/addEngine`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (response.status === 200 || response.status === 201) {
                setSuccess('Engine added successfully');
                setError('');
                setEngine({ name: "" });
                setSelectedFile(null);
                navigate(`/engines/${make}`);
            }
        } catch (error) {
            console.error('Error adding engine: ', error.message);
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb mt-3">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item"><a href='/admin' className="text-decoration-none">Administration</a></li>
                    <li className="breadcrumb-item"><a href='/engines' className="text-decoration-none">Engines</a></li>
                    <li className="breadcrumb-item"><a href={`/engines/${make}`} className="text-decoration-none">{make}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Add engine</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Add engine</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={(e) => onSubmit(e)}>

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter engine name'
                            name='name'
                            value={name}
                            onChange={(e) => onInputChange(e)}
                        />

                        <select onChange={onInputChange} name="engineType" className="form-select mt-3 mb-3">
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
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter displacement'
                            name='displacement'
                            value={displacement}
                            onChange={(e) => onInputChange(e)}
                        />

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter power'
                            name='power'
                            value={power}
                            onChange={(e) => onInputChange(e)}
                        />

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter torque'
                            name='torque'
                            value={torque}
                            onChange={(e) => onInputChange(e)}
                        />

                        <select onChange={onInputChange} name="fuel" className="form-select mt-3 mb-3">
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
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter description'
                            name='description'
                            value={description}
                            onChange={(e) => onInputChange(e)}
                        />

                        <input
                            type="file"
                            className="form-control mt-3 mb-3"
                            name='flag'
                            onChange={handleFileChange}
                        />

                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/admin/engines/${make}`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
