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
    const [isLoading, setIsLoading] = useState(false);

    const { caption } = spot;

    const { user } = useAuth();

    const [selectedCountry, setSelectedCountry] = useState(null);
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

        setIsExifProcessing(true);

        try {
            const { lat, lng } = await getExifData(files[0]);
            setLatitude(lat);
            setLongitude(lng);
            const location = await fetchLocationInfo(lat, lng);
            setLocationInfo(location);
            setCity(location.city);
            setCountry(location.country);
            setError(null);
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
            setIsExifProcessing(false);
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
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/places/reverse`, {
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
                `${process.env.REACT_APP_API_URL}/api/places/autocomplete`, {
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
                        label: prediction.description,
                        city: prediction.structured_formatting.main_text,
                        country: parts[parts.length - 1],
                    };
                });
                setCityOptions(suggestions);
            } else {
                console.error("Empty result from backend:", response.data);
                setCityOptions([]);
            }
        } catch (error) {
            console.error("Error loading cities:", error);
        }
    };

    const handleCitySelect = (selectedOption) => {
        if (selectedOption) {
            setSelectedCity(selectedOption);
            setCityInputValue(selectedOption.label);
            setLocationInfo({
                city: selectedOption.city,
                country: selectedOption.country,
            });

            getCityCoordinates(selectedOption.value).then(({ lat, lng }) => {
                setCity(selectedOption.city);
                setCountry(selectedOption.country);
                setLongitude(lng);
                setLatitude(lat);
            })
        } else {
            setSelectedCity(null);
            setCityInputValue('');
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
                `${process.env.REACT_APP_API_URL}/api/places/details`, {
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
            console.error("Error getting city coordinates:", error);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            const fetchMakes = async () => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog`, {
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
        value: make.name,
        label: make.name,
    }));

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            if (selectedMake) {
                const fetchModels = async () => {
                    try {
                        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${selectedMake.value}`, {
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
        value: model.name,
        label: model.name,
    }));

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            if (selectedModel) {
                const fetchGenerations = async () => {
                    try {
                        const response =
                            await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${selectedMake.value}/${selectedModel.value}`, {
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
        label: generation.name + ' (' + generation?.years + ')',
    }));

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            if (selectedGeneration) {
                const fetchFacelifts = async () => {
                    try {
                        const response =
                            await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${selectedMake.value}/${selectedModel.value}/${selectedGeneration.value}/faceliftList`, {
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
                            await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${selectedMake.value}/${selectedModel.value}/${selectedGeneration.value}/${selectedFacelift.value}/bodystyles`, {
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
                            await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${selectedMake.value}/${selectedModel.value}/${selectedGeneration.value}/${selectedBodystyle.value}/listTrim`, {
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
        label: trim.market?.name
            ? `${trim.name} (${trim.market.name})`
            : trim.name,
    }));

    const handleMakeChange = (selectedOption) => {
        setSelectedMake(selectedOption);
        setSelectedModel(null);
        setSelectedGeneration(null);
        setSelectedFacelift(null);
        setSelectedBodystyle(null);
        setSelectedTrim(null);
    };

    const handleModelChange = (selectedOption) => {
        setSelectedModel(selectedOption);
        setSelectedGeneration(null);
        setSelectedFacelift(null);
        setSelectedBodystyle(null);
        setSelectedTrim(null);
    };

    const handleGenerationChange = (selectedOption) => {
        setSelectedGeneration(selectedOption);
        setSelectedFacelift(null);
        setSelectedBodystyle(null);
        setSelectedTrim(null);
    };

    const handleFaceliftChange = (selectedOption) => {
        setSelectedFacelift(selectedOption);
        setSelectedBodystyle(null);
        setSelectedTrim(null);
    };

    const handleBodystyleChange = (selectedOption) => {
        setSelectedBodystyle(selectedOption);
        setSelectedTrim(null);
    };

    const handleTrimChange = (selectedOption) => {
        setSelectedTrim(selectedOption);
    };

    const handleCitySelection = (selectedOption) => {
        if (selectedOption) {
            handleCitySelect(selectedOption.description, selectedOption.placeId);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (isLoading) return;
        setIsLoading(true);

        if (latitude === null || longitude === null) {
            alert("Please indicate the location of the spot.");
            setIsLoading(false);
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
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/spots/addSpot`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (response.status === 200 || response.status === 201) {
                console.log("Spot added successfully");
                navigate(`/spots`);
            }
        } catch (error) {
            console.error("Error adding Spot:", error);
            alert("An error occurred while adding the spot. Please try again.");
        } finally {

            setIsLoading(false);
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
                                    {latitude && longitude ? (
                                        <>
                                            <p><strong>Country:</strong> {locationInfo.country || 'Not found'}</p>
                                            <p><strong>City:</strong> {locationInfo.city || 'Not found'}</p>
                                            <p><strong>Latitude:</strong> {latitude || 'Not found'}</p>
                                            <p><strong>Longitude:</strong> {longitude || 'Not found'}</p>
                                        </>
                                    ) : (
                                        <>
                                            {error && (
                                                <div className="alert alert-danger mt-3" role="alert">
                                                    {error}
                                                </div>
                                            )}

                                            <Select
                                                options={cityOptions}
                                                inputValue={cityInputValue}
                                                onInputChange={(value) => {
                                                    setCityInputValue(value);
                                                    handleCityInput(value);
                                                }}
                                                onChange={(selectedOption) => {
                                                    handleCitySelect(selectedOption);
                                                }}
                                                isSearchable
                                                placeholder="Enter city name..."
                                                isClearable
                                            />
                                        </>
                                    )}
                                </>
                            )}
                            {isExifProcessing && (
                                <p>Processing image data...</p>
                            )}
                        </div>

                    </div>
                    <div className="col">
                        <div className="form mb-3 text-start">
                            <label htmlFor="floatingTextarea2" className="form-label text-start">Caption:</label>
                            <textarea
                                className="form-control"
                                id="floatingTextarea2"
                                style={{ height: '310px' }}
                                name="caption"
                                value={caption}
                                onChange={onChange}
                            >
                            </textarea>
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
                {isLoading ? (
                    <button className="btn btn-outline-primary mt-3" type="button" disabled>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Loading...
                    </button>
                ) : (
                    <button className="btn btn-outline-primary mt-3" type="submit">
                        Add spot
                    </button>
                )}
                <Link className="btn btn-outline-danger mx-2 mt-3" to="/spots">Cancel</Link>
            </form>
        </div>

    );
}