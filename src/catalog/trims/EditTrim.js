import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Select from "react-select";

export default function EditTrim() {

    let navigate = useNavigate();
    const { make, model, generationId, bodystyleId, trimId } = useParams();
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

    const [bodystyleEntity, setBodystyleEntity] = useState({
        name: '',
        generation: ''
    });

    const [engines, setEngines] = useState([]);
    const [transmissions, setTransmissions] = useState([]);
    const [bodies, setBodies] = useState([]);
    const [drivetrains, setDrivetrains] = useState([]);
    const [tuners, setTuners] = useState([]);

    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');

    const [selectedDrivetrain, setSelectedDrivetrain] = useState(null);
    const [selectedEngine, setSelectedEngine] = useState(null);
    const [selectedTransmission, setSelectedTransmission] = useState(null);
    const [selectedBody, setSelectedBody] = useState(null);
    const [selectedTuner, setSelectedTuner] = useState(null);

    const [photos, setPhotos] = useState([]);
    const { user } = useAuth(); // Получаем пользователя из AuthContext

    const loadBodystyleEntity = async () => {
        const result = await axios.get(`http://localhost:8080/catalog/${make}/${model}/${generationId}/${bodystyleId}/getOne`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });
        setBodystyleEntity(result.data);
    }

    const fetchTrim = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/catalog/${make}/${model}/${generationId}/${bodystyleId}/${trimId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setTrim({
                name: response.data.name,
                altName: response.data.altName,
                description: response.data.description,
                bodystyle: response.data.bodystyle,
                years: response.data.years,
                amount: response.data.amount,
                maxSpeed: response.data.maxSpeed,
                acceleration: response.data.acceleration,
                uniq: response.data.uniq,
                weight: response.data.weight,
                electric: response.data.electric,
                hybrid: response.data.hybrid,
                battery: response.data.battery,
                range: response.data.range,
                photos: response.data.photos
            });
            setSelectedEngine(
                response.data.engine ? { value: response.data.engine.id, label: response.data.engine.name } : null
            );
            setSelectedTransmission(
                response.data.transmission ? { value: response.data.transmission.id, label: response.data.transmission.name } : null
            );
            setSelectedBody(
                response.data.body ? { value: response.data.body.id, label: response.data.body.name } : null
            );
            setSelectedDrivetrain(
                response.data.drivetrain ? { value: response.data.drivetrain.id, label: response.data.drivetrain.name } : null
            );
            setSelectedTuner(
                response.data.tuner ? { value: response.data.tuner.id, label: response.data.tuner.name } : null
            );
        } catch (error) {
            setError('Error fetching trim details: ' + error.message);
        }
    };

    useEffect(() => {
        loadBodystyleEntity();
        fetchEngines();
        fetchTransmissions();
        fetchBodies();
        fetchDrivetrains();
        fetchTuners();
        fetchTrim();
    }, []);

    const onInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTrim({
            ...trim,
            [name]: type === 'checkbox' ? checked : value || ""
        });
    };

    const fetchEngines = () => {
        axios
            .get(`http://localhost:8080/administration/engines/${make}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    //check the api call is success by stats code 200,201 ...etc
                    setEngines(data)
                } else {
                    //error handle section 
                }
            })
            .catch((error) => console.log(error));
    };

    const fetchTransmissions = () => {
        axios
            .get(`http://localhost:8080/administration/transmissions/${make}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    //check the api call is success by stats code 200,201 ...etc
                    setTransmissions(data)
                } else {
                    //error handle section 
                }
            })
            .catch((error) => console.log(error));
    };

    const fetchBodies = () => {
        axios
            .get(`http://localhost:8080/administration/bodies/${make}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    //check the api call is success by stats code 200,201 ...etc
                    setBodies(data)
                } else {
                    //error handle section 
                }
            })
            .catch((error) => console.log(error));
    };

    const fetchDrivetrains = () => {
        axios
            .get('http://localhost:8080/administration/drivetrains', {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    //check the api call is success by stats code 200,201 ...etc
                    setDrivetrains(data)
                } else {
                    //error handle section 
                }
            })
            .catch((error) => console.log(error));
    };

    const optionsDrivetrain = drivetrains.map((drivetrain) => ({
        value: drivetrain.id,
        label: drivetrain.name,
    }));
    const optionsEngine = engines.map((engine) => ({
        value: engine.id,
        label: engine.name,
    }));
    const optionsTransmission = transmissions.map((transmission) => ({
        value: transmission.id,
        label: transmission.name,
    }));
    const optionsBody = bodies.map((body) => ({
        value: body.id,
        label: body.name,
    }));
    const optionsTuner = tuners.map((tuner) => ({
        value: tuner.id,
        label: tuner.name,
    }));

    const handleDrivetrainChange = (selectedOption) => {
        setSelectedDrivetrain(selectedOption);
    };

    const handleEngineChange = (selectedOption) => {
        setSelectedEngine(selectedOption);
    };

    const handleTransmissionChange = (selectedOption) => {
        setSelectedTransmission(selectedOption);
    };

    const handleBodyChange = (selectedOption) => {
        setSelectedBody(selectedOption);
    };

    const handleTunerChange = (selectedOption) => {
        setSelectedTuner(selectedOption);
    };

    const fetchTuners = () => {
        axios
            .get('http://localhost:8080/catalog/tuners', {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    //check the api call is success by stats code 200,201 ...etc
                    setTuners(data)
                } else {
                    //error handle section 
                }
            })
            .catch((error) => console.log(error));
    };

    const handleSetMain = async (photoId) => {
        try {
            const response = await axios.put(
                `http://localhost:8080/catalog/${make}/${model}/${generationId}/${bodystyleId}/${trimId}/setMainPhoto/${photoId}`, null, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
            );

            if (response.status === 200) {
                // Update the photos in trim to reflect the new main photo
                const updatedPhotos = trim.photos.map((photo) =>
                    photo.id === photoId
                        ? { ...photo, isMain: true }
                        : { ...photo, isMain: false }
                );
                setTrim({ ...trim, photos: updatedPhotos });
            }
        } catch (err) {
            console.error("Error marking photo as main:", err.message);
        }
    };

    const handleDelete = async (photoId) => {
        try {
            const response = await axios.delete(
                `http://localhost:8080/catalog/${make}/${model}/${generationId}/${bodystyleId}/${trimId}/deletePhoto/${photoId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
            );

            if (response.status === 200) {
                // Update the photos in trim locally
                const updatedPhotos = trim.photos.filter((photo) => photo.id !== photoId);
                setTrim({ ...trim, photos: updatedPhotos });
            }
        } catch (err) {
            console.error("Error deleting photo:", err.message);
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];

        if (!file) {
            setError("Please select a valid file.");
            return;
        }

        const formData = new FormData();
        formData.append("photo", file);

        try {
            const response = await axios.put(
                `http://localhost:8080/catalog/${make}/${model}/${generationId}/${bodystyleId}/${trimId}/addPhoto`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${user.token}`
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                const uploadedPhoto = response.data; // Backend returns the Photo object, including the name
                setTrim((prevTrim) => ({
                    ...prevTrim,
                    photos: [...prevTrim.photos, uploadedPhoto],
                }));
                setError("");
                setSelectedFile(null);
            }
        } catch (err) {
            console.error("Error uploading photo:", err.message);
            setError("Failed to upload photo. Please try again.");
        } finally {
            event.target.value = ""; // Сбрасываем input для загрузки следующего файла
        }

    };


    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('uniq', trim.uniq ? 'true' : 'false');
        formData.append('electric', trim.electric ? 'true' : 'false');
        formData.append('hybrid', trim.hybrid ? 'true' : 'false');

        Object.keys(trim).forEach(key => {
            if (key !== 'uniq' && key !== 'electric' && key !== 'hybrid') {
                formData.append(key, trim[key]);
            }
        });

        if (selectedEngine) {
            formData.append('engineId', selectedEngine.value);
        }

        if (selectedTransmission) {
            formData.append('transmissionId', selectedTransmission.value);
        }

        if (selectedBody) {
            formData.append('bodyId', selectedBody.value);
        }

        if (selectedDrivetrain) {
            formData.append('drivetrainId', selectedDrivetrain.value);
        }

        if (selectedTuner) {
            formData.append('tunerId', selectedTuner.value);
        }

        if (selectedFile) {
            formData.append('photo', selectedFile);
        }


        try {
            const response =
                await axios.put(`http://localhost:8080/catalog/${make}/${model}/${generationId}/${bodystyleId}/${trimId}/editTrim`, formData, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
            if (response.status === 200 || response.status === 201) {
                console.log('Trim updated successfully');
                navigate(`/catalog/${make}/${model}/${generationId}/${bodystyleId}/${trimId}`);
            }
        } catch (error) {
            console.error('Error adding trim: ', error);
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb mt-3">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item"><a href="/catalog" className="text-decoration-none">Catalog</a></li>
                    <li className="breadcrumb-item"><Link to={`/catalog/${make}`} className="text-decoration-none">{make}</Link></li>
                    <li className="breadcrumb-item"><Link to={`/catalog/${make}/${model}`} className="text-decoration-none">{model}</Link></li>
                    <li className="breadcrumb-item"><Link to={`/catalog/${make}/${model}/${generationId}`} className="text-decoration-none">{bodystyleEntity.generation.name}</Link></li>
                    <li className="breadcrumb-item"><Link to={`/catalog/${make}/${model}/${generationId}/${bodystyleId}`} className="text-decoration-none">{bodystyleEntity.bodytype?.name}</Link></li>
                    <li className="breadcrumb-item"><Link to={`/catalog/${make}/${model}/${generationId}/${bodystyleId}/${trimId}`} className="text-decoration-none">{trim.name}</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Edit trim</li>
                </ol>
            </nav>
            <div className='row row-cols-1 row-cols-sm-2'>

                <div className='col'>

                    {trim.photos && trim.photos.length > 0 && (
                        <div >
                            {trim.photos.map((photo, index) => (
                                <div key={index} className='mb-2'>
                                    <img
                                        key={index}
                                        src={`https://newloripinbucket.s3.amazonaws.com/image/catalog/${make}/${model}/${trim.bodystyle.generation?.name}/${trim.bodystyle.facelift?.name}/${trim.bodystyle.bodytype?.name}/${trim.name}/${photo.name}`}
                                        alt={photo.name}
                                        className="img-fluid mb-2"

                                    />
                                    {!photo.isMain && (
                                        <div>
                                            <button type="button" className="btn btn-outline-primary"
                                                style={{
                                                    '--bs-btn-padding-y': '.25rem',
                                                    '--bs-btn-padding-x': '.5rem',
                                                    '--bs-btn-font-size': '.75rem',
                                                }}
                                                onClick={() => handleSetMain(photo.id)}
                                            >
                                                Set as main
                                            </button>

                                            <button type="button" className="btn btn-outline-danger mx-2"
                                                style={{
                                                    '--bs-btn-padding-y': '.25rem',
                                                    '--bs-btn-padding-x': '.5rem',
                                                    '--bs-btn-font-size': '.75rem',
                                                }}
                                                onClick={() => handleDelete(photo.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div className="mb-3">
                                <label htmlFor="formFileSm" className="form-label text-start d-block">Add new photo:</label>
                                <input
                                    className="form-control form-control-sm"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                                {error && <p className="text-danger">{error}</p>}
                            </div>
                        </div>
                    )}
                </div>
                <div className='col'>
                    <h2 className='text-center m-4'>Edit trim</h2>
                    <form onSubmit={onSubmit}>

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter trim'
                            name='name'
                            value={trim.name}
                            onChange={onInputChange}
                        />

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter altName'
                            name='altName'
                            value={trim.altName}
                            onChange={onInputChange}
                        />

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter description'
                            name='description'
                            value={trim.description}
                            onChange={onInputChange}
                        />


                        <Select
                            className="text-start mt-3"
                            options={optionsEngine}
                            onChange={handleEngineChange}
                            isSearchable
                            isClearable
                            placeholder="Select engine"
                            value={selectedEngine}
                        />

                        <Select
                            className="text-start mt-3"
                            options={optionsTransmission}
                            onChange={handleTransmissionChange}
                            isSearchable
                            isClearable
                            placeholder="Select transmission"
                            value={selectedTransmission}
                        />

                        <Select
                            className="text-start mt-3"
                            options={optionsBody}
                            onChange={handleBodyChange}
                            isSearchable
                            isClearable
                            placeholder="Select body"
                            value={selectedBody}
                        />

                        <Select
                            className="text-start mt-3"
                            options={optionsDrivetrain}
                            onChange={handleDrivetrainChange}
                            isSearchable
                            isClearable
                            placeholder="Select drivetrain"
                            value={selectedDrivetrain}
                        />

                        <Select
                            className="text-start mt-3"
                            options={optionsTuner}
                            onChange={handleTunerChange}
                            isSearchable
                            isClearable
                            placeholder="Select tuner"
                            value={selectedTuner}
                        />

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter years of production'
                            name='years'
                            value={trim.years}
                            onChange={onInputChange}
                        />

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter amount'
                            name='amount'
                            value={trim.amount}
                            onChange={onInputChange}
                        />

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter maximum speed'
                            name='maxSpeed'
                            value={trim.maxSpeed}
                            onChange={onInputChange}
                        />

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter acceleration'
                            name='acceleration'
                            value={trim.acceleration}
                            onChange={onInputChange}
                        />

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter weight'
                            name='weight'
                            value={trim.weight}
                            onChange={onInputChange}
                        />

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter battery'
                            name='battery'
                            value={trim.battery}
                            onChange={onInputChange}
                        />

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter range'
                            name='range'
                            value={trim.range}
                            onChange={onInputChange}
                        />

                        <div className="form-check form-switch mb-3 text-start">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="flexSwitchCheckDefault"
                                name="uniq"
                                checked={trim.uniq}
                                onChange={onInputChange}
                            />
                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Uniq</label>
                        </div>

                        <div className="form-check form-switch mb-3 text-start">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="flexSwitchCheckDefault"
                                name="electric"
                                checked={trim.electric}
                                onChange={onInputChange}
                            />
                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Electric</label>
                        </div>

                        <div className="form-check form-switch mb-3 text-start">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="flexSwitchCheckDefault"
                                name="hybrid"
                                checked={trim.hybrid}
                                onChange={onInputChange}
                            />
                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Hybrid</label>
                        </div>

                        <button type='submit' className="btn btn-outline-primary">Save</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/catalog/${make}/${model}/${generationId}/${bodystyleId}/${trimId}`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div >
    )
}
