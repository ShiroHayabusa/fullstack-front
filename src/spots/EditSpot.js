import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './AddSpot.css';
import Select from "react-select";
import { useAuth } from '../context/AuthContext';

export default function EditSpot() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [spot, setSpot] = useState({ caption: "" });
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');

    const [makes, setMakes] = useState([]);
    const [models, setModels] = useState([]);
    const [generations, setGenerations] = useState([]);
    const [facelifts, setFacelifts] = useState([]);
    const [bodystyles, setBodystyles] = useState([]);
    const [trims, setTrims] = useState([]);

    const [selectedMake, setSelectedMake] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);
    const [selectedGeneration, setSelectedGeneration] = useState(null);
    const [selectedFacelift, setSelectedFacelift] = useState(null);
    const [selectedBodystyle, setSelectedBodystyle] = useState(null);
    const [selectedTrim, setSelectedTrim] = useState(null);

    const { user } = useAuth(); // Получаем пользователя из AuthContext

    const fetchSpot = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/spots/${id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setSpot({
                caption: response.data.caption,
                make: response.data.make,
                photos: response.data.photos,
                user: response.data.user
            });
            setSelectedMake(
                response.data.make ? { value: response.data.make.name, label: response.data.make.name } : null
            );
            setSelectedModel(
                response.data.model ? { value: response.data.model.name, label: response.data.model.name } : null
            );
            setSelectedGeneration(
                response.data.generation ? { value: response.data.generation.id, label: response.data.generation.name } : null
            );
            setSelectedFacelift(
                response.data.facelift ? { value: response.data.facelift.id, label: response.data.facelift.name } : null
            );
            setSelectedBodystyle(
                response.data.bodystyle ? { value: response.data.bodystyle.id, label: response.data.bodystyle.bodytype.name } : null
            );
            setSelectedTrim(
                response.data.trim ? { value: response.data.trim.id, label: response.data.trim.name } : null
            );
        } catch (error) {
            setError('Error fetching spot details: ' + error.message);
        }
    };

    useEffect(() => {
        const fetchMakes = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/catalog`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setMakes(response.data);
            } catch (error) {
                console.error("Error fetching makes:", error);
            }
        };
        fetchMakes();
    }, []);

    const optionsMake = makes.map((make) => ({
        value: make.name, // Приводим к нижнему регистру для value
        label: make.name, // Оригинальное имя для отображения
    }));

    useEffect(() => {
        if (selectedMake) {
            const fetchModels = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/catalog/${selectedMake.value}`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    });
                    setModels(response.data);
                } catch (error) {
                    console.error("Error fetching models:", error);
                }
            };
            fetchModels();
        } else {
            setModels([]);
        }
    }, [selectedMake]);

    const optionsModel = models.map((model) => ({
        value: model.name, // Приводим к нижнему регистру для value
        label: model.name, // Оригинальное имя для отображения
    }));

    useEffect(() => {
        if (selectedModel) {
            const fetchGenerations = async () => {
                try {
                    const response =
                        await axios.get(`http://localhost:8080/catalog/${selectedMake.value}/${selectedModel.value}`, {
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                            },
                        });
                    setGenerations(response.data);
                } catch (error) {
                    console.error("Error fetching generations:", error);
                }
            };
            fetchGenerations();
        } else {
            setGenerations([]);
        }
    }, [selectedModel]);

    const optionsGeneration = generations.map((generation) => ({
        value: generation.id,
        label: generation.name,
    }));

    useEffect(() => {
        if (selectedGeneration) {
            const fetchFacelifts = async () => {
                try {
                    const response =
                        await axios.get(`http://localhost:8080/catalog/${selectedMake.value}/${selectedModel.value}/${selectedGeneration.value}/faceliftList`, {
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                            },
                        });
                    setFacelifts(response.data);
                } catch (error) {
                    console.error("Error fetching facelifts:", error);
                }
            };
            fetchFacelifts();
        } else {
            setFacelifts([]);
        }
    }, [selectedGeneration]);

    const optionsFacelift = facelifts.map((facelift) => ({
        value: facelift.id,
        label: facelift.name,
    }));

    useEffect(() => {
        if (selectedFacelift) {
            const fetchBodystyles = async () => {
                try {
                    const response =
                        await axios.get(`http://localhost:8080/catalog/${selectedMake.value}/${selectedModel.value}/${selectedGeneration.value}/${selectedFacelift.value}/bodystyles`, {
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                            },
                        });
                    setBodystyles(response.data);
                } catch (error) {
                    console.error("Error fetching bodystyles:", error);
                }
            };
            fetchBodystyles();
        } else {
            setBodystyles([]);
        }
    }, [selectedFacelift]);

    const optionsBodystyle = bodystyles.map((bodystyle) => ({
        value: bodystyle.id,
        label: bodystyle.bodytype?.name,
    }));

    useEffect(() => {
        if (selectedBodystyle) {
            const fetchTrims = async () => {
                try {
                    const response =
                        await axios.get(`http://localhost:8080/catalog/${selectedMake.value}/${selectedModel.value}/${selectedGeneration.value}/${selectedBodystyle.value}/listTrim`, {
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                            },
                        });
                    setTrims(response.data);
                } catch (error) {
                    console.error("Error fetching trims:", error);
                }
            };
            fetchTrims();
        } else {
            setTrims([]);
        }
    }, [selectedBodystyle]);

    const optionsTrim = trims.map((trim) => ({
        value: trim.id,
        label: trim.name,
    }));

    const handleMakeChange = (selectedOption) => {
        setSelectedMake(selectedOption);
        setSelectedModel(null); // Сбрасываем выбор модели
        setSelectedGeneration(null); // Сбрасываем выбор поколения
        setSelectedFacelift(null); // Сбрасываем выбор фейслифта
        setSelectedBodystyle(null); // Сбрасываем выбор кузова
        setSelectedTrim(null); // Сбрасываем выбор комплектации
    };

    const handleModelChange = (selectedOption) => {
        setSelectedModel(selectedOption);
        setSelectedGeneration(null); // Сбрасываем выбор поколения
        setSelectedFacelift(null); // Сбрасываем выбор фейслифта
        setSelectedBodystyle(null); // Сбрасываем выбор кузова
        setSelectedTrim(null); // Сбрасываем выбор комплектации
    };

    const handleGenerationChange = (selectedOption) => {
        setSelectedGeneration(selectedOption);
        setSelectedFacelift(null); // Сбрасываем выбор фейслифта
        setSelectedBodystyle(null); // Сбрасываем выбор кузова
        setSelectedTrim(null); // Сбрасываем выбор комплектации
    };

    const handleFaceliftChange = (selectedOption) => {
        setSelectedFacelift(selectedOption);
        setSelectedBodystyle(null); // Сбрасываем выбор кузова
        setSelectedTrim(null); // Сбрасываем выбор комплектации
    };

    const handleBodystyleChange = (selectedOption) => {
        setSelectedBodystyle(selectedOption);
        setSelectedTrim(null); // Сбрасываем выбор комплектации
    };

    const handleTrimChange = (selectedOption) => {
        setSelectedTrim(selectedOption);
    };

    useEffect(() => {
        fetchSpot();
    }, []);


    const onInputChange = (e) => {
        const { name, value } = e.target;
        setSpot({
            ...spot,
            [name]: value
        });
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
                `http://localhost:8080/spots/${id}/addPhoto`,
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
                setSpot((prevSpot) => ({
                    ...prevSpot,
                    photos: [...prevSpot.photos, uploadedPhoto],
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

    const handleSetMain = async (photoId) => {
        try {
            const response = await axios.put(
                `http://localhost:8080/spots/${id}/setMainPhoto/${photoId}`, null, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
            );

            if (response.status === 200) {
                // Update the photos in spot to reflect the new main photo
                const updatedPhotos = spot.photos.map((photo) =>
                    photo.id === photoId
                        ? { ...photo, isMain: true }
                        : { ...photo, isMain: false }
                );
                setSpot({ ...spot, photos: updatedPhotos });
            }
        } catch (err) {
            console.error("Error marking photo as main:", err.message);
        }
    };

    const handleDelete = async (photoId) => {
        try {
            const response = await axios.delete(
                `http://localhost:8080/spots/${id}/deletePhoto/${photoId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
            );

            if (response.status === 200) {
                // Update the photos in spot locally
                const updatedPhotos = spot.photos.filter((photo) => photo.id !== photoId);
                setSpot({ ...spot, photos: updatedPhotos });
            }
        } catch (err) {
            console.error("Error deleting photo:", err.message);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('caption', spot.caption);
        if (selectedTrim) {
            formData.append('trim', selectedTrim.value);
        }
        if (selectedBodystyle) {
            formData.append('bodystyle', selectedBodystyle.value);
        }
        if (selectedFacelift) {
            formData.append('facelift', selectedFacelift.value);
        }
        if (selectedGeneration) {
            formData.append('generation', selectedGeneration.value);
        }
        if (selectedModel) {
            formData.append('model', selectedModel.value);
        }
        if (selectedMake) {
            formData.append('make', selectedMake.value);
        }

        try {
            const response =
                await axios.put(`http://localhost:8080/spots/editSpot/${id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
            if (response.status === 200 || response.status === 201) {
                console.log('Spot updated successfully');
                navigate(`/spots/${id}`);
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error adding spot: ', error);
        }
    };

    return (
        <div className="container mt-3">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/" className="text-decoration-none">Home</Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to="/spots" className="text-decoration-none">Spots</Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to={`/spots/${id}`} className="text-decoration-none">Spot {id}</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">Edit spot</li>
                </ol>
            </nav>
            <form onSubmit={onSubmit}>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
                    <div className="col">
                        {spot.photos && spot.photos.length > 0 && (
                            <div >
                                {spot.photos.map((photo, index) => (
                                    <div key={index} className='mb-2'>
                                        <img
                                            key={index}
                                            src={`https://newloripinbucket.s3.amazonaws.com/image/spots/${spot.user?.username}/${photo.name}`}
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
                            </div>
                        )}

                        <div class="mb-3">
                            <label for="formFileSm" class="form-label text-start d-block">Add new photo:</label>
                            <input
                                className="form-control form-control-sm"
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            {error && <p className="text-danger">{error}</p>}
                        </div>
                    </div>

                    <div className="col">
                        <div className="form-floating mb-3">
                            <textarea
                                className="form-control"
                                id="floatingTextarea2"
                                style={{ height: '391px' }}
                                name="caption"
                                value={spot.caption}
                                onChange={onInputChange}>
                            </textarea>
                            <label htmlFor="floatingTextarea2">Caption</label>
                        </div>

                    </div>

                    <div className="col">
                        <h5>Specify the car:</h5>
                        <Select className='text-start'
                            options={optionsMake}
                            onChange={handleMakeChange}
                            isSearchable
                            placeholder="Select make"
                            value={selectedMake}
                        />
                        <Select className='text-start mt-3'
                            options={optionsModel}
                            onChange={handleModelChange}
                            isSearchable
                            placeholder="Select model"
                            value={selectedModel}
                            isDisabled={!selectedMake}
                        />

                        <Select className='text-start mt-3'
                            options={optionsGeneration}
                            onChange={handleGenerationChange}
                            isSearchable
                            placeholder="Select generation"
                            isDisabled={!selectedModel}
                            value={selectedGeneration}
                        />

                        <Select className='text-start mt-3'
                            options={optionsFacelift}
                            onChange={handleFaceliftChange}
                            isSearchable
                            placeholder="Select facelift"
                            isDisabled={!selectedGeneration}
                            value={selectedFacelift}
                        />

                        <Select className='text-start mt-3'
                            options={optionsBodystyle}
                            onChange={handleBodystyleChange}
                            isSearchable
                            placeholder="Select bodystyle"
                            isDisabled={!selectedFacelift}
                            value={selectedBodystyle}
                        />

                        <Select className='text-start mt-3'
                            options={optionsTrim}
                            onChange={handleTrimChange}
                            isSearchable
                            placeholder="Select trim"
                            isDisabled={!selectedBodystyle}
                            value={selectedTrim}
                        />
                    </div>
                </div>
                <div className="d-flex justify-content-center mt-3">
                    <button type='submit' className="btn btn-outline-primary">Save</button>
                    <Link className="btn btn-outline-danger mx-2" to={`/spots/${id}`}>Cancel</Link>
                </div>
            </form>
        </div>



    );
}
