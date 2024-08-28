import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function AddEngine() {

    let navigate = useNavigate();

    const [engine, setEngine] = useState({
        name: "",
        displacement: "",
        power: "",
        engineType: "",
        torque: "",
        fuel: ""
    });
    const [engineTypes, setEngineTypes] = useState([]);
    const [fuels, setFuels] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { name, displacement, power, engineType, torque, fuel } = engine;

    const fetchEngineTypes = () => {
        axios
            .get('http://localhost:8080/administration/engineTypes')
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    //check the api call is success by stats code 200,201 ...etc
                    setEngineTypes(data)
                } else {
                    //error handle section 
                }
            })
            .catch((error) => console.log(error));
    };

    const fetchFuels = () => {
        axios
            .get('http://localhost:8080/administration/fuels')
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    //check the api call is success by stats code 200,201 ...etc
                    setFuels(data)
                } else {
                    //error handle section 
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

        if (!name || !selectedFile) {
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


        try {
            const response = await axios.post('http://localhost:8080/administration/engines/addEngine', formData);
            if (response.status === 200 || response.status === 201) {
                setSuccess('Engine added successfully');
                setError('');
                setEngine({ name: "" });
                setSelectedFile(null);
                navigate('/administration/engines');
            }
        } catch (error) {
            console.error('Error adding engine: ', error.message);
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="/">Home</a></li>
                    <li class="breadcrumb-item"><a href='/administration'>Administration</a></li>
                    <li class="breadcrumb-item"><a href='/administration/engines'>Engines</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Add engine</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Add engine</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className='mb-3'>
                            
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter engine name'
                                name='name'
                                value={name}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className='mb-3'>
                            
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter displacement'
                                name='displacement'
                                value={displacement}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className='mb-3'>
                           
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter power'
                                name='power'
                                value={power}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className='mb-3'>
                            
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter torque'
                                name='torque'
                                value={torque}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className='mb-3'>
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
                        </div>
                        <div className='mb-3'>
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
                        </div>

                        <div className='mb-3'>
                            <input
                                type="file"
                                className="form-control"
                                name='flag'
                                onChange={handleFileChange}
                            />
                        </div>
                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/administration/engines`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
