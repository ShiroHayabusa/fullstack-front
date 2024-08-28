import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function AddTrim() {

    let navigate = useNavigate();
    const { make, model, generationId, bodystyleId } = useParams();
    const [trim, setTrim] = useState({
        name: "",
        altName: "",
        description: "",
        engine: "",
        transmission: "",
        body: "",
        drivetrain: "",
        years: "",
        tuner: "",
        amount: "",
        maxSpeed: "",
        acceleration: "",
        uniq: false,
        weight: "",
        electric: false,
        hybrid: false,
        battery: "",
        range: ""
    });

    const { name, altName, description, engine, transmission, body, drivetrain, years, tuner, amount, maxSpeed, acceleration,
        uniq, weight, electric, hybrid, battery, range } = trim;

    const [bodystyleEntity, setBodystyleEntity] = useState({
        name: '',
        generation: ''
    });

    const [engineList, setEngineList] = useState([]);
    const [transmissionList, setTransmissionList] = useState([]);
    const [bodyList, setBodyList] = useState([]);
    const [drivetrainList, setDrivetrainList] = useState([]);
    const [tunerList, setTunerList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const loadBodystyleEntity = async () => {
        const result = await axios.get(`http://localhost:8080/catalog/${make}/${model}/${generationId}/${bodystyleId}/getOne`);
        setBodystyleEntity(result.data);
        console.log("bodystyle:", result.data);
    }
    useEffect(() => {
        loadBodystyleEntity();
        fetchEngineData();
        fetchTransmissionData();
        fetchBodyData();
        fetchDrivetrainData();
        fetchTunerData();
    }, []);

    const onChange = (e) => {
        setTrim({ ...trim, [e.target.name]: e.target.value });
    };

    const fetchEngineData = () => {
        axios
            .get('http://localhost:8080/administration/engines')
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    //check the api call is success by stats code 200,201 ...etc
                    setEngineList(data)
                    console.log("engines:", data);
                } else {
                    //error handle section 
                }
            })
            .catch((error) => console.log(error));
    };

    const fetchTransmissionData = () => {
        axios
            .get('http://localhost:8080/administration/transmissions')
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    //check the api call is success by stats code 200,201 ...etc
                    setTransmissionList(data)
                    console.log("transmissions:", data);
                } else {
                    //error handle section 
                }
            })
            .catch((error) => console.log(error));
    };

    const fetchBodyData = () => {
        axios
            .get('http://localhost:8080/administration/bodies')
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    //check the api call is success by stats code 200,201 ...etc
                    setBodyList(data)
                    console.log("bodies:", data);
                } else {
                    //error handle section 
                }
            })
            .catch((error) => console.log(error));
    };

    const fetchDrivetrainData = () => {
        axios
            .get('http://localhost:8080/administration/drivetrains')
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    //check the api call is success by stats code 200,201 ...etc
                    setDrivetrainList(data)
                    console.log("drivetrains:", data);
                } else {
                    //error handle section 
                }
            })
            .catch((error) => console.log(error));
    };

    const fetchTunerData = () => {
        axios
            .get('http://localhost:8080/catalog/tuners')
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    //check the api call is success by stats code 200,201 ...etc
                    setTunerList(data)
                    console.log("tuners:", data);
                } else {
                    //error handle section 
                }
            })
            .catch((error) => console.log(error));
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        //  if (!bodystyle.facelift || !bodystyle.name || !selectedFile) {
        //      setError('Please provide facelift, bodystyle and upload an image.');
        //      return;
        //  }
        const formData = new FormData();
        Object.keys(trim).forEach(key => {
            formData.append(key, trim[key]);
        });
        if (selectedFile) {
            formData.append('photo', selectedFile);
        }

        try {
            const response =
                await axios.post(`http://localhost:8080/catalog/${make}/${model}/${generationId}/${bodystyleId}/addTrim`, formData);
            if (response.status === 200 || response.status === 201) {
                console.log('Trim added successfully');
                navigate(`/catalog/${make}/${model}/${generationId}/${bodystyleId}`);
            }
        } catch (error) {
            console.error('Error adding trim: ', error);
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="/">Home</a></li>
                    <li class="breadcrumb-item"><a href="/catalog">Catalog</a></li>
                    <li class="breadcrumb-item"><Link to={`/catalog/${make}`}>{make}</Link></li>
                    <li class="breadcrumb-item"><Link to={`/catalog/${make}/${model}`}>{model}</Link></li>
                    <li class="breadcrumb-item"><Link to={`/catalog/${make}/${model}/${generationId}`}>{bodystyleEntity.generation.name}</Link></li>
                    <li class="breadcrumb-item"><Link to={`/catalog/${make}/${model}/${generationId}/${bodystyleId}`}>{bodystyleEntity.bodytype?.name}</Link></li>
                    <li class="breadcrumb-item active" aria-current="page">Add trim</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Add trim</h2>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Name</label>
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter trim'
                                name='name'
                                value={name}
                                onChange={(e) => onChange(e)}
                            />
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter altName'
                                name='altName'
                                value={altName}
                                onChange={(e) => onChange(e)}
                            />
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter description'
                                name='description'
                                value={description}
                                onChange={(e) => onChange(e)}
                            />
                            <select onChange={onChange} name='engine' className="form-select mt-5 mb-5">
                                <option value={"default"}>
                                    Select engine
                                </option>
                                {engineList.map((item) => (
                                    <option key={item.id} value={item.id} >
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                            <select onChange={onChange} name='transmission' className="form-select mt-5 mb-5">
                                <option value={"default"}>
                                    Select transmission
                                </option>
                                {transmissionList.map((item) => (
                                    <option key={item.id} value={item.id} >
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                            <select onChange={onChange} name='body' className="form-select mt-5 mb-5">
                                <option value={"default"}>
                                    Select body
                                </option>
                                {bodyList.map((item) => (
                                    <option key={item.id} value={item.id} >
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                            <select onChange={onChange} name='drivetrain' className="form-select mt-5 mb-5">
                                <option value={"default"}>
                                    Select drivetrain
                                </option>
                                {drivetrainList.map((item) => (
                                    <option key={item.id} value={item.id} >
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                            <select onChange={onChange} name='tuner' className="form-select mt-5 mb-5">
                                <option value={"default"}>
                                    Select tuner
                                </option>
                                {tunerList.map((item) => (
                                    <option key={item.id} value={item.id} >
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter years of production'
                                name='years'
                                value={years}
                                onChange={(e) => onChange(e)}
                            />
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter amount'
                                name='amount'
                                value={amount}
                                onChange={(e) => onChange(e)}
                            />
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter maximum speed'
                                name='maxSpeed'
                                value={maxSpeed}
                                onChange={(e) => onChange(e)}
                            />
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter acceleration'
                                name='acceleration'
                                value={acceleration}
                                onChange={(e) => onChange(e)}
                            />
                           
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter weight'
                                name='weight'
                                value={weight}
                                onChange={(e) => onChange(e)}
                            />
                            
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter battery'
                                name='battery'
                                value={battery}
                                onChange={(e) => onChange(e)}
                            />
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter range'
                                name='range'
                                value={range}
                                onChange={(e) => onChange(e)}
                            />

                            <div className='mb-3'>
                                <input
                                    type="file"
                                    className="form-control"
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
                                    name="uniq"
                                    checked={uniq}
                                    onChange={onChange}
                                />
                                <label className="form-check-label" for="flexSwitchCheckDefault">Uniq</label>
                            </div>

                            <div className="form-check form-switch mb-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="flexSwitchCheckDefault"
                                    name="electric"
                                    checked={electric}
                                    onChange={onChange}
                                />
                                <label className="form-check-label" for="flexSwitchCheckDefault">Electric</label>
                            </div>

                            <div className="form-check form-switch mb-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="flexSwitchCheckDefault"
                                    name="hybrid"
                                    checked={hybrid}
                                    onChange={onChange}
                                />
                                <label className="form-check-label" for="flexSwitchCheckDefault">Hybrid</label>
                            </div>

                        </div>
                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/catalog/${make}/${model}/${generationId}/${bodystyleId}`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
