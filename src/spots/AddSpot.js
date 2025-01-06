import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select from "react-select";
import { useAuth } from '../context/AuthContext';
import './AddSpot.css';

export default function AddSpot() {

    const navigate = useNavigate();

    const [spot, setSpot] = useState({ caption: "" });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [mainPhotoIndex, setMainPhotoIndex] = useState(0);

    const [citySuggestions, setCitySuggestions] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

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

    const { caption } = spot;

    const { user } = useAuth(); // Получаем пользователя из AuthContext

    const onChange = (e) => {
        setSpot({ ...spot, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (event) => {
        const files = Array.from(event.target.files);
        const previewUrls = files.map(file => URL.createObjectURL(file));
        setSelectedFiles(files);
        setPreviewUrls(previewUrls);
        setMainPhotoIndex(0);
    };

    const clearPreviews = () => {
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        setPreviewUrls([]);
    };

    const handleCityInput = async (e) => {
        const query = e.target.value;
        setSelectedCity(query);

        if (query.length > 2) {
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/places/autocomplete`,
                    {
                        params: {
                            input: query,
                            types: "(cities)",
                            key: "AIzaSyCAFPj_ck8L8ceN5wTWlyoWiLAutAxKJnI",
                        },
                    }
                );
                const suggestions = response.data.predictions.map((prediction) => ({
                    description: prediction.description,
                    placeId: prediction.place_id,
                }));
                setCitySuggestions(suggestions);
            } catch (error) {
                console.error("Ошибка загрузки предложений города:", error);
            }
        }
    };

    const handleCitySelect = async (cityDescription, placeId) => {
        setSelectedCity(cityDescription);
        setCitySuggestions([]);

        try {
            const response = await axios.get(
                `http://localhost:8080/places/details`,
                {
                    params: {
                        place_id: placeId,
                        key: "AIzaSyCAFPj_ck8L8ceN5wTWlyoWiLAutAxKJnI",
                    },
                }
            );
            console.log("Response from Google Places API:", response.data);

            const location = response.data.result.geometry.location;
            if (location) {
                setLatitude(location.lat);
                setLongitude(location.lng);
                console.log("Location:", location);
            } else {
                console.error("Location not found in response:", response.data);
                alert("Не удалось получить координаты для выбранного города.");
            }
        } catch (error) {
            console.error("Ошибка получения координат города:", error);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
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
        }
    }, [user]);

    const optionsMake = makes.map((make) => ({
        value: make.name, // Приводим к нижнему регистру для value
        label: make.name, // Оригинальное имя для отображения
    }));

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
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
        }
    }, [selectedMake, user]);

    const optionsModel = models.map((model) => ({
        value: model.name, // Приводим к нижнему регистру для value
        label: model.name, // Оригинальное имя для отображения
    }));

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
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
        }
    }, [selectedModel, user]);

    const optionsGeneration = generations.map((generation) => ({
        value: generation.id,
        label: generation.name,
    }));

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
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
        }
    }, [selectedGeneration, user]);

    const optionsFacelift = facelifts.map((facelift) => ({
        value: facelift.id,
        label: facelift.name,
    }));

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
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
        }
    }, [selectedFacelift, user]);

    const optionsBodystyle = bodystyles.map((bodystyle) => ({
        value: bodystyle.id,
        label: bodystyle.bodytype?.name,
    }));

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
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
        }
    }, [selectedBodystyle, user]);

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

    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("caption", caption);
        formData.append("mainPhotoIndex", mainPhotoIndex);
        selectedFiles.forEach((file) => formData.append("photos", file));

        if (latitude !== null) {
            formData.append("latitude", latitude);
        }
        if (longitude !== null) {
            formData.append("longitude", longitude);
        }

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
            const response = await axios.post(`http://localhost:8080/spots/addSpot`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (response.status === 200 || response.status === 201) {
                console.log("Spot added successfully");
                navigate(`/spots`);
            }
        } catch (error) {
            console.error("Ошибка добавления Spot:", error);
        }
        clearPreviews();
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
                    <li className="breadcrumb-item active" aria-current="page">Add Spot</li>
                </ol>
            </nav>
            <form onSubmit={onSubmit}>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
                    <div className="col">
                        <input
                            type="file"
                            className="form-control mt-3 mb-3"
                            name="photos"
                            onChange={handleFileChange}
                            multiple
                            required
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
                    </div>
                    <div className="col">
                        <div className="form-floating mb-3">
                            <textarea
                                className="form-control"
                                id="floatingTextarea2"
                                style={{ height: '310px' }}
                                name="caption"
                                value={caption}
                                onChange={onChange}
                                required>
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

                    <div className="mt-3">
                        <label>City</label>
                        <input
                            list="citySuggestions"
                            className="form-control"
                            placeholder="Enter city"
                            value={selectedCity}
                            onChange={handleCityInput}
                            required
                        />
                        <datalist id="citySuggestions">
                            {citySuggestions.map((suggestion, index) => (
                                <option
                                    key={index}
                                    value={suggestion.description}
                                    onClick={() => handleCitySelect(suggestion.description, suggestion.placeId)}
                                >
                                    {suggestion.description}
                                </option>
                            ))}
                        </datalist>

                        {latitude && longitude && (
                            <div className="mt-3">
                                <p>Координаты:</p>
                                <p>Широта: {latitude}</p>
                                <p>Долгота: {longitude}</p>
                            </div>
                        )}
                    </div>




                </div>
                <button type="submit" className="btn btn-outline-primary mt-3">Add Spot</button>
                <Link className="btn btn-outline-danger mx-2 mt-3" to="/spots">Cancel</Link>
            </form>
        </div>

    );
}
