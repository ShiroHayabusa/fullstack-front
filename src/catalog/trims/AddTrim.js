import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
    const [selectedFiles, setSelectedFiles] = useState([]);
    const { user } = useAuth();
    const [mainPhotoIndex, setMainPhotoIndex] = useState(0);
    const [previewUrls, setPreviewUrls] = useState([]);

    const loadBodystyleEntity = async () => {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}/${generationId}/${bodystyleId}/getOne`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });
        setBodystyleEntity(result.data);
    }
    useEffect(() => {
        loadBodystyleEntity();
        fetchEngineData();
        fetchTransmissionData();
        fetchBodyData();
        fetchDrivetrainData();
        fetchTunerData();
    }, [make, model, generationId, bodystyleId]);

    const onChange = (e) => {
        setTrim({ ...trim, [e.target.name]: e.target.value });
    };

    const fetchEngineData = () => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/api/engines/${make}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    setEngineList(data)
                }
            })
            .catch((error) => console.log(error));
    };

    const fetchTransmissionData = () => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/api/transmissions/${make}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    setTransmissionList(data)
                }
            })
            .catch((error) => console.log(error));
    };

    const fetchBodyData = () => {
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

    const fetchDrivetrainData = () => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/api/admin/drivetrains`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    setDrivetrainList(data)
                }
            })
            .catch((error) => console.log(error));
    };

    const fetchTunerData = () => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/api/catalog/tuners`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    setTunerList(data)
                } 
            })
            .catch((error) => console.log(error));
    };

    const handleFileChange = async (event) => {
        const files = Array.from(event.target.files);
        const previewUrls = files.map(file => URL.createObjectURL(file));
        setSelectedFiles([...event.target.files]);
        setPreviewUrls(previewUrls);
        setMainPhotoIndex(0);
    };

    const clearPreviews = () => {
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        setPreviewUrls([]);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(trim).forEach(key => {
            formData.append(key, trim[key]);
        });
        formData.append("mainPhotoIndex", mainPhotoIndex);

        selectedFiles.forEach(file => {
            formData.append('photos', file);
        });

        try {
            const response =
                await axios.post(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}/${generationId}/${bodystyleId}/addTrim`, formData, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
            if (response.status === 200 || response.status === 201) {
                console.log('Trim added successfully');
                navigate(`/catalog/${make}/${model}/${generationId}/${bodystyleId}`);
            }
        } catch (error) {
            console.error('Error adding trim: ', error);
        }
        clearPreviews();
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item"><a href="/catalog" className="text-decoration-none">Catalog</a></li>
                    <li className="breadcrumb-item"><Link to={`/catalog/${make}`} className="text-decoration-none">{make}</Link></li>
                    <li className="breadcrumb-item"><Link to={`/catalog/${make}/${model}`} className="text-decoration-none">{model}</Link></li>
                    <li className="breadcrumb-item"><Link to={`/catalog/${make}/${model}/${generationId}`} className="text-decoration-none">{bodystyleEntity.generation.name}</Link></li>
                    <li className="breadcrumb-item"><Link to={`/catalog/${make}/${model}/${generationId}/${bodystyleId}`} className="text-decoration-none">{bodystyleEntity.bodytype?.name}</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Add trim</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Add trim</h2>
                    <form onSubmit={(e) => onSubmit(e)}>

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter trim'
                            name='name'
                            value={name}
                            onChange={(e) => onChange(e)}
                        />

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter altName'
                            name='altName'
                            value={altName}
                            onChange={(e) => onChange(e)}
                        />

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter description'
                            name='description'
                            value={description}
                            onChange={(e) => onChange(e)}
                        />

                        <select onChange={onChange} name='engine' className="form-select mt-3 mb-3">
                            <option value={"default"}>
                                Select engine
                            </option>
                            {engineList.map((item) => (
                                <option key={item.id} value={item.id} >
                                    {item.name}
                                </option>
                            ))}
                        </select>

                        <select onChange={onChange} name='transmission' className="form-select mt-3 mb-3">
                            <option value={"default"}>
                                Select transmission
                            </option>
                            {transmissionList.map((item) => (
                                <option key={item.id} value={item.id} >
                                    {item.name}
                                </option>
                            ))}
                        </select>

                        <select onChange={onChange} name='body' className="form-select mt-3 mb-3">
                            <option value={"default"}>
                                Select body
                            </option>
                            {bodyList.map((item) => (
                                <option key={item.id} value={item.id} >
                                    {item.name}
                                </option>
                            ))}
                        </select>

                        <select onChange={onChange} name='drivetrain' className="form-select mt-3 mb-3">
                            <option value={"default"}>
                                Select drivetrain
                            </option>
                            {drivetrainList.map((item) => (
                                <option key={item.id} value={item.id} >
                                    {item.name}
                                </option>
                            ))}
                        </select>

                        <select onChange={onChange} name='tuner' className="form-select mt-3 mb-3">
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
                            className='form-control mt-3 mb-3'
                            placeholder='Enter years of production'
                            name='years'
                            value={years}
                            onChange={(e) => onChange(e)}
                        />

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter amount'
                            name='amount'
                            value={amount}
                            onChange={(e) => onChange(e)}
                        />

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter maximum speed'
                            name='maxSpeed'
                            value={maxSpeed}
                            onChange={(e) => onChange(e)}
                        />

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter acceleration'
                            name='acceleration'
                            value={acceleration}
                            onChange={(e) => onChange(e)}
                        />

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter weight'
                            name='weight'
                            value={weight}
                            onChange={(e) => onChange(e)}
                        />

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter battery'
                            name='battery'
                            value={battery}
                            onChange={(e) => onChange(e)}
                        />

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter range'
                            name='range'
                            value={range}
                            onChange={(e) => onChange(e)}
                        />

                        <input
                            type="file"
                            className="form-control mt-3 mb-3"
                            name='photos'
                            onChange={handleFileChange}
                            multiple
                        />
                        {previewUrls.length > 0 && (
                            <div className="mt-3">
                                <h5>Preview (Click to select main photo):</h5>
                                <div className="d-flex flex-wrap">
                                    {previewUrls.map((url, index) => (
                                        <div
                                            key={index}
                                            className={`m-2 position-relative ${mainPhotoIndex === index ? "selected-photo" : "unselected-photo"}`}
                                            style={{ cursor: "pointer", borderWidth: "2px" }}
                                            onClick={() => setMainPhotoIndex(index)}
                                        >
                                            <img
                                                src={url}
                                                alt={`Preview ${index}`}
                                                className="img-thumbnail"
                                                style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="form-check form-switch mb-3 text-start">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="uniq"
                                name="uniq"
                                checked={uniq}
                                onChange={onChange}
                            />
                            <label className="form-check-label" htmlFor="uniq">Uniq</label>
                        </div>

                        <div className="form-check form-switch mb-3 text-start">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="electric"
                                name="electric"
                                checked={electric}
                                onChange={onChange}
                            />
                            <label className="form-check-label" htmlFor="electric">Electric</label>
                        </div>

                        <div className="form-check form-switch mb-3 text-start">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="flexSwitchCheckDefault"
                                name="hybrid"
                                checked={hybrid}
                                onChange={onChange}
                            />
                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Hybrid</label>
                        </div>

                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/catalog/${make}/${model}/${generationId}/${bodystyleId}`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
