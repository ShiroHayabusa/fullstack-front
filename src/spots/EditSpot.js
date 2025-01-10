import axios from 'axios';
import React, { useState, useEffect, useMemo } from 'react';
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

    // Списки опций
    const [makes, setMakes] = useState([]);
    const [models, setModels] = useState([]);
    const [generations, setGenerations] = useState([]);
    const [facelifts, setFacelifts] = useState([]);
    const [bodystyles, setBodystyles] = useState([]);
    const [trims, setTrims] = useState([]);

    // Выбранные опции
    const [selectedMake, setSelectedMake] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);
    const [selectedGeneration, setSelectedGeneration] = useState(null);
    const [selectedFacelift, setSelectedFacelift] = useState(null);
    const [selectedBodystyle, setSelectedBodystyle] = useState(null);
    const [selectedTrim, setSelectedTrim] = useState(null);

    const { user } = useAuth(); // Получаем пользователя из AuthContext

    // Вспомогательная функция для сброса зависимых полей
    const resetDependentFields = (level) => {
        switch (level) {
            case 'make':
                setSelectedModel(null);
                setModels([]);
            // Fall through
            case 'model':
                setSelectedGeneration(null);
                setGenerations([]);
            // Fall through
            case 'generation':
                setSelectedFacelift(null);
                setFacelifts([]);
            // Fall through
            case 'facelift':
                setSelectedBodystyle(null);
                setBodystyles([]);
            // Fall through
            case 'bodystyle':
                setSelectedTrim(null);
                setTrims([]);
                break;
            default:
                break;
        }
    };

    // Функция для загрузки данных спота
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

    // Загрузка списка марок при монтировании компонента
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
    }, [user.token]);

    // Мемоизация опций для селектов
    const optionsMake = useMemo(() =>
        makes.map((make) => ({
            value: make.name,
            label: make.name,
        })), [makes]);

    const optionsModel = useMemo(() =>
        models.map((model) => ({
            value: model.name,
            label: model.name,
        })), [models]);

    const optionsGeneration = useMemo(() =>
        generations.map((generation) => ({
            value: generation.id,
            label: generation.name,
        })), [generations]);

    const optionsFacelift = useMemo(() =>
        facelifts.map((facelift) => ({
            value: facelift.id,
            label: facelift.name,
        })), [facelifts]);

    const optionsBodystyle = useMemo(() =>
        bodystyles.map((bodystyle) => ({
            value: bodystyle.id,
            label: bodystyle.bodytype?.name,
        })), [bodystyles]);

    const optionsTrim = useMemo(() =>
        trims.map((trim) => ({
            value: trim.id,
            label: trim.name,
        })), [trims]);

    // Загрузка моделей при изменении selectedMake
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
    }, [selectedMake, user.token]);

    // Загрузка поколений при изменении selectedModel
    useEffect(() => {
        if (selectedModel && selectedMake) {
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
    }, [selectedModel, selectedMake, user.token]);

    // Загрузка фейслифтов при изменении selectedGeneration
    useEffect(() => {
        if (selectedGeneration && selectedMake && selectedModel) {
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
    }, [selectedGeneration, selectedMake, selectedModel, user.token]);

    // Загрузка кузовов при изменении selectedFacelift
    useEffect(() => {
        if (selectedFacelift && selectedMake && selectedModel && selectedGeneration) {
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
    }, [selectedFacelift, selectedMake, selectedModel, selectedGeneration, user.token]);

    // Загрузка комплектаций при изменении selectedBodystyle
    useEffect(() => {
        if (selectedBodystyle && selectedMake && selectedModel && selectedGeneration) {
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
    }, [selectedBodystyle, selectedMake, selectedModel, selectedGeneration, user.token]);

    // Обработчики изменений селектов
    const handleMakeChange = (selectedOption) => {
        setSelectedMake(selectedOption);
        resetDependentFields('make');
    };

    const handleModelChange = (selectedOption) => {
        setSelectedModel(selectedOption);
        resetDependentFields('model');
    };

    const handleGenerationChange = (selectedOption) => {
        setSelectedGeneration(selectedOption);
        resetDependentFields('generation');
    };

    const handleFaceliftChange = (selectedOption) => {
        setSelectedFacelift(selectedOption);
        resetDependentFields('facelift');
    };

    const handleBodystyleChange = (selectedOption) => {
        setSelectedBodystyle(selectedOption);
        resetDependentFields('bodystyle');
    };

    const handleTrimChange = (selectedOption) => {
        setSelectedTrim(selectedOption);
    };

    // Загрузка данных спота при монтировании
    useEffect(() => {
        fetchSpot();
    }, []);

    // Обработчик ввода текста
    const onInputChange = (e) => {
        const { name, value } = e.target;
        setSpot({
            ...spot,
            [name]: value
        });
    };

    // Обработчик загрузки файла
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

    // Обработчик установки основной фотографии
    const handleSetMain = async (photoId) => {
        try {
            const response = await axios.put(
                `http://localhost:8080/spots/${id}/setMainPhoto/${photoId}`, null, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

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

    // Обработчик удаления фотографии
    const handleDelete = async (photoId) => {
        try {
            const response = await axios.delete(
                `http://localhost:8080/spots/${id}/deletePhoto/${photoId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (response.status === 200) {
                // Update the photos in spot locally
                const updatedPhotos = spot.photos.filter((photo) => photo.id !== photoId);
                setSpot({ ...spot, photos: updatedPhotos });
            }
        } catch (err) {
            console.error("Error deleting photo:", err.message);
        }
    };

    // Обработчик отправки формы
    const onSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            caption: spot.caption || '',
            make: selectedMake ? selectedMake.value : null,
            model: selectedModel ? selectedModel.value : null,
            generation: selectedGeneration ? selectedGeneration.value : null, // Long ID
            facelift: selectedFacelift ? selectedFacelift.value : null, // Long ID
            bodystyle: selectedBodystyle ? selectedBodystyle.value : null, // Long ID
            trim: selectedTrim ? selectedTrim.value : null, // Long ID
        };

        console.log('Payload:', payload); // For debugging purposes

        try {
            const response =
                await axios.put(`http://localhost:8080/spots/editSpot/${id}`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                            'Content-Type': 'application/json', // Explicitly setting content type
                        },
                    });
            if (response.status === 200 || response.status === 201) {
                console.log('Spot updated successfully');
                navigate(`/spots/${id}`);
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error updating spot:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Failed to update spot. Please try again.');
            }
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
                            isClearable
                            placeholder="Select make"
                            value={selectedMake}
                        />
                        <Select className='text-start mt-3'
                            options={optionsModel}
                            onChange={handleModelChange}
                            isSearchable
                            isClearable
                            placeholder="Select model"
                            value={selectedModel}
                            isDisabled={!selectedMake}
                        />

                        <Select className='text-start mt-3'
                            options={optionsGeneration}
                            onChange={handleGenerationChange}
                            isSearchable
                            isClearable
                            placeholder="Select generation"
                            isDisabled={!selectedModel}
                            value={selectedGeneration}
                        />

                        <Select className='text-start mt-3'
                            options={optionsFacelift}
                            onChange={handleFaceliftChange}
                            isSearchable
                            isClearable
                            placeholder="Select facelift"
                            isDisabled={!selectedGeneration}
                            value={selectedFacelift}
                        />

                        <Select className='text-start mt-3'
                            options={optionsBodystyle}
                            onChange={handleBodystyleChange}
                            isSearchable
                            isClearable
                            placeholder="Select bodystyle"
                            isDisabled={!selectedFacelift}
                            value={selectedBodystyle}
                        />

                        <Select className='text-start mt-3'
                            options={optionsTrim}
                            onChange={handleTrimChange}
                            isSearchable
                            isClearable
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
