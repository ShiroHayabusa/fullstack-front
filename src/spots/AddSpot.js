import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select from "react-select";
import { useAuth } from '../context/AuthContext';
import './AddSpot.css';
import EXIF from 'exif-js';

export default function AddSpot() {

    const navigate = useNavigate();

    const [spot, setSpot] = useState({
        city: '',
        country: '',
        latitude: null,
        longitude: null,
        caption: ""
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [mainPhotoIndex, setMainPhotoIndex] = useState(0);
    const [error, setError] = useState('');

    const [citySuggestions, setCitySuggestions] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [cityInputValue, setCityInputValue] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');

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

    const [locationInfo, setLocationInfo] = useState({ city: '', country: '' });

    const { caption } = spot;

    const { user } = useAuth();

    const [selectedCountry, setSelectedCountry] = useState(null);
    const [countryOptions, setCountryOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [isExifProcessing, setIsExifProcessing] = useState(false);

    const onChange = (e) => {
        setSpot({ ...spot, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (event) => {
        const files = Array.from(event.target.files);
        const previewUrls = files.map(file => URL.createObjectURL(file));
        setSelectedFiles(files);
        setPreviewUrls(previewUrls);
        setMainPhotoIndex(0);

        setIsExifProcessing(true); // Начинаем обработку EXIF

        try {
            const { lat, lng } = await getExifData(files[0]); // Используем обертку
            setLatitude(lat);
            setLongitude(lng);
            const location = await fetchLocationInfo(lat, lng);
            setLocationInfo(location);
            setCity(location.city);
            setCountry(location.country);
            setError(null); // Убираем сообщение об ошибке
        } catch (error) {
            console.error("Error processing file:", error.message);
            setError(error.message);
            setSelectedCountry(null);
            setSelectedCity(null);
            setCityOptions([]);
            setLatitude(null);
            setLongitude(null);
            setLocationInfo({ city: '', country: '' });
        } finally {
            setIsExifProcessing(false); // Завершаем обработку EXIF
        }
    };



    const getExifData = (file) => {
        return new Promise((resolve, reject) => {
            EXIF.getData(file, function () {
                const exifData = EXIF.getAllTags(this);
                if (exifData.GPSLatitude && exifData.GPSLongitude && exifData.GPSLatitudeRef && exifData.GPSLongitudeRef) {
                    const lat = convertDMSToDD(exifData.GPSLatitude, exifData.GPSLatitudeRef);
                    const lng = convertDMSToDD(exifData.GPSLongitude, exifData.GPSLongitudeRef);
                    resolve({ lat, lng });
                } else {
                    reject(new Error("No GPS data found in the image."));
                }
            });
        });
    }

    const convertDMSToDD = (dms, ref) => {
        const degrees = dms[0];
        const minutes = dms[1];
        const seconds = dms[2];

        let dd = degrees + minutes / 60 + seconds / 3600;
        if (ref === 'S' || ref === 'W') {
            dd = dd * -1;
        }
        return dd;
    };

    const fetchLocationInfo = async (lat, lng) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/places/reverse`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                params: { lat, lng },
            });

            if (response.data) {
                return { city: response.data.city, country: response.data.country };
            } else {
                throw new Error('Could not retrieve location info from coordinates.');
            }
        } catch (error) {
            console.error("Error fetching reverse geocode data:", error);
            throw new Error('Failed to retrieve location information.');
        }
    };

    const clearPreviews = () => {
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        setPreviewUrls([]);
    };

    const handleCityInput = async (inputValue) => {
        if (!inputValue || inputValue.length <= 2) {
            setCityOptions([]);
            return;
        }
        try {
            const response = await axios.get(
                `http://localhost:8080/api/places/autocomplete`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                params: {
                    input: inputValue,
                    types: "(cities)",
                },
            });
            if (response.data && response.data.predictions) {
                const suggestions = response.data.predictions.map(prediction => {
                    const parts = prediction.structured_formatting.secondary_text.split(', ');
                    return {
                        value: prediction.place_id,
                        label: prediction.description, // Город + Страна
                        city: prediction.structured_formatting.main_text, // Город
                        country: parts[parts.length - 1], // Страна
                    };
                });
                setCityOptions(suggestions);
            } else {
                console.error("Пустой результат от бэкенда:", response.data);
                setCityOptions([]);
            }
        } catch (error) {
            console.error("Ошибка загрузки городов:", error);
        }
    };

    // Обработка выбора города
    const handleCitySelect = (selectedOption) => {
        if (selectedOption) {
            setSelectedCity(selectedOption);
            setCityInputValue(selectedOption.label);
            setLocationInfo({
                city: selectedOption.city,
                country: selectedOption.country,
            });

            // Получение координат для города
            getCityCoordinates(selectedOption.value).then(({ lat, lng }) => {
                setCity(selectedOption.city);
                setCountry(selectedOption.country);
                setLongitude(lng);
                setLatitude(lat);
            })
        } else {
            // Если пользователь очистил выбор
            setSelectedCity(null);
            setCityInputValue(''); // Очищаем поле ввода
            setLocationInfo({ city: '', country: '' });
            setCity('');
            setCountry('');
            setLongitude(null);
            setLatitude(null);
        }
    };

    const getCityCoordinates = async (placeId) => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/places/details`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                params: {
                    place_id: placeId,
                },
            }
            );

            const location = response.data.result.geometry.location;
            setLatitude(location.lat);
            setLongitude(location.lng);
            return { lat: location.lat, lng: location.lng };
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

    // Обработка выбора города из дропдауна
    const handleCitySelection = (selectedOption) => {
        if (selectedOption) {
            handleCitySelect(selectedOption.description, selectedOption.placeId);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        // Проверяем, есть ли координаты
        if (latitude === null || longitude === null) {
            alert("Пожалуйста, укажите местоположение спота.");
            return;
        }

        const formData = new FormData();
        formData.append("caption", caption);
        formData.append("mainPhotoIndex", mainPhotoIndex);
        formData.append("city", city);
        formData.append("country", country);
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);
        selectedFiles.forEach((file) => formData.append("photos", file));


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

                        <div className='text-start mt-3'>
                            {selectedFiles.length > 0 && !isExifProcessing && (
                                <>
                                    {/* Отображение страны и города, если координаты найдены */}
                                    {latitude && longitude && (
                                        <>
                                            <p><strong>Country:</strong> {locationInfo.country || 'Не найдена'}</p>
                                            <p><strong>City:</strong> {locationInfo.city || 'Не найден'}</p>
                                            <p><strong>City:</strong> {latitude || 'Не найден'}</p>
                                            <p><strong>City:</strong> {longitude || 'Не найден'}</p>
                                        </>
                                    )}

                                    {/* Отображение ошибки, если данные отсутствуют */}
                                    {error && !latitude && !longitude && (
                                        <div className="alert alert-danger mt-3" role="alert">
                                            {error}
                                        </div>
                                    )}

                                    {/* Поле Select всегда доступно */}
                                    <Select
                                        options={cityOptions}
                                        inputValue={cityInputValue} // Управляемое состояние для текста ввода
                                        onInputChange={(value) => {
                                            setCityInputValue(value); // Обновляем текст
                                            handleCityInput(value);  // Загружаем автозаполнение
                                        }}
                                        onChange={(selectedOption) => {
                                            handleCitySelect(selectedOption); // Обрабатываем выбор города
                                        }}
                                        isSearchable
                                        placeholder="Enter city name..."
                                        isClearable
                                    />
                                </>
                            )}
                            {isExifProcessing && (
                                <p>Обрабатываются данные изображения...</p>
                            )}
                        </div>

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

                    <div className="col mt-3">
                        {/* Дропдаун для выбора города, отображается только если выбрана страна */}
                        {selectedCountry && (
                            <div className="col mt-3">
                                <label><strong>City</strong></label>
                                <Select
                                    options={cityOptions.map(city => ({
                                        value: city.placeId,
                                        label: city.description,
                                        description: city.description,
                                        placeId: city.placeId,
                                    }))}
                                    onInputChange={handleCityInput}
                                    onChange={handleCitySelection}
                                    isSearchable
                                    placeholder="Select city"
                                    value={selectedCity ? {
                                        value: selectedCity.placeId,
                                        label: selectedCity.description,
                                        description: selectedCity.description,
                                        placeId: selectedCity.placeId,
                                    } : null}
                                    isClearable
                                />
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