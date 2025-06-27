import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select from "react-select";
import { useAuth } from '../context/AuthContext';
import './AddSpot.css';
import AchievementModal from './../components/AchievementModal';
import EXIF from 'exif-js';

export default function AddSpot() {

    const navigate = useNavigate();
    const { user } = useAuth();

    const [spot, setSpot] = useState({
        city: '',
        region: '',
        country: '',
        latitude: null,
        longitude: null,
        caption: ""
    });

    const [suggestions, setSuggestions] = useState([]);
    const [suggestionIndex, setSuggestionIndex] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [query, setQuery] = useState('');
    const textareaRef = useRef(null);

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [mainPhotoIndex, setMainPhotoIndex] = useState(0);
    const [error, setError] = useState('');

    const [selectedCity, setSelectedCity] = useState("");
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [cityInputValue, setCityInputValue] = useState('');
    const [city, setCity] = useState('');
    const [region, setRegion] = useState('');
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

    const [locationInfo, setLocationInfo] = useState({ city: '', region: '', country: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isExifProcessing, setIsExifProcessing] = useState(false);
    const [cityOptions, setCityOptions] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [isManualLocation, setIsManualLocation] = useState(false);

    const [achievement, setAchievement] = useState(null);

    const handleCaptionChange = (e) => {
        const newValue = e.target.value;
        setSpot({ ...spot, caption: newValue });

        const lastHashIndex = newValue.lastIndexOf('#');
        if (lastHashIndex !== -1) {
            const queryText = newValue.slice(lastHashIndex + 1);
            if (!queryText.includes(' ')) {
                setQuery(queryText);
                fetchSuggestions(queryText);
                setShowSuggestions(true);
            } else {
                setShowSuggestions(false);
                setSuggestions([]);
                setQuery('');
            }
        } else {
            setShowSuggestions(false);
            setSuggestions([]);
            setQuery('');
        }
    };

    const fetchSuggestions = (query) => {
        if (!query) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        fetch(`${process.env.REACT_APP_API_URL}/api/tags/search?prefix=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => {
                if (!res.ok) throw new Error(`Network error: ${res.status}`);
                return res.json();
            })
            .then(data => {
                console.log('API response:', data);
                const formattedSuggestions = data.map(tag => ({
                    name: tag,
                    id: tag,
                }));
                setSuggestions(formattedSuggestions);
                setShowSuggestions(formattedSuggestions.length > 0);
            })
            .catch(err => {
                console.error('Fetch error:', err);
                setSuggestions([]);
                setShowSuggestions(false);
            });
    };

    const selectSuggestion = (suggestion) => {
        const lastHashIndex = spot.caption.lastIndexOf('#');
        const newCaption = spot.caption.slice(0, lastHashIndex) + `#${suggestion.name} `;
        setSpot({ ...spot, caption: newCaption });
        setShowSuggestions(false);
        setSuggestions([]);
        setQuery('');
        setSuggestionIndex(-1);
        textareaRef.current.focus();
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSuggestionIndex(prev => (prev + 1) % suggestions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        } else if (e.key === 'Enter' && suggestionIndex >= 0) {
            e.preventDefault();
            selectSuggestion(suggestions[suggestionIndex]);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
            setSuggestions([]);
            setQuery('');
            setSuggestionIndex(-1);
        }
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
            setRegion(location.region || '');
            setCountry(location.country);
            setError(null);
            setIsManualLocation(false);
        } catch (error) {
            console.error("Error processing file:", error.message);
            setError(error.message);
            setSelectedCountry(null);
            setSelectedCity(null);
            setCityOptions([]);
            setLatitude(null);
            setLongitude(null);
            setLocationInfo({ city: '', region: '', country: '' });
            setIsManualLocation(true);
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
                return {
                    city: response.data.city,
                    region: response.data.region,
                    country: response.data.country
                };
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
                    const terms = prediction.terms || [];

                    const city = terms[0]?.value;
                    const region = terms.length > 2 ? terms[terms.length - 2]?.value : '';
                    const country = terms[terms.length - 1]?.value;

                    return {
                        value: prediction.place_id,
                        label: prediction.description,
                        city,
                        region,
                        country,
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

    const handleCitySelect = async (selectedOption) => {
        console.log('Selected option:', selectedOption);
        setError(null);
        if (selectedOption) {
            setIsManualLocation(true);
            setLocationInfo({
                city: selectedOption.city,
                region: selectedOption.region,
                country: selectedOption.country,
            });
            setSelectedCity(selectedOption);
            setCityInputValue(selectedOption.label);

            try {
                const { lat, lng } = await getCityCoordinates(selectedOption.value);
                setCity(selectedOption.city);
                setRegion(selectedOption.region || '');
                setCountry(selectedOption.country);
                setLatitude(lat);
                setLongitude(lng);
                setLocationInfo({
                    city: selectedOption.city,
                    region: selectedOption.region,
                    country: selectedOption.country,
                });
                console.log('Updated locationInfo:', {
                    city: selectedOption.city,
                    region: selectedOption.region,
                    country: selectedOption.country,
                    lat,
                    lng
                });
            } catch (err) {
                console.error('Error fetching coordinates:', err);
                setError('Failed to fetch city coordinates');
            }
        } else {
            setIsManualLocation(false);
            setSelectedCity(null);
            setCityInputValue('');
            setLocationInfo({ city: '', region: '', country: '' });
            setCity('');
            setRegion('');
            setCountry('');
            setLatitude(null);
            setLongitude(null);
            console.log('Cleared locationInfo');
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
        value: model.id,
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
                            await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${selectedMake.value}/${selectedModel.value}/generations`, {
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
        formData.append("caption", spot.caption);
        formData.append("mainPhotoIndex", mainPhotoIndex);
        formData.append("city", city);
        formData.append("region", region);
        console.log('region:', region);
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
                const newAchievements = response.data.newAchievements;
                if (newAchievements && newAchievements.length > 0) {
                    setAchievement(newAchievements);
                } else {
                    navigate(`/`);
                }
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
                                    <p><strong>Country:</strong> {locationInfo.country || 'Not found'}</p>
                                    <p><strong>Region:</strong> {locationInfo.region || 'Not found'}</p>
                                    <p><strong>City:</strong> {locationInfo.city || 'Not found'}</p>
                                    {error && (
                                        <div className="alert alert-danger mt-3" role="alert">
                                            {error}
                                        </div>
                                    )}
                                    {(!latitude || !longitude || isManualLocation) && (
                                        <Select
                                            options={cityOptions}
                                            inputValue={cityInputValue}
                                            onInputChange={(value) => {
                                                console.log('Input changed:', value);
                                                setCityInputValue(value);
                                                handleCityInput(value);
                                            }}
                                            onChange={handleCitySelect}
                                            isSearchable
                                            placeholder="Enter city name..."
                                            isClearable
                                        />
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
                            <label htmlFor="floatingTextarea2" className="form-label text-start">
                                Caption:
                            </label>
                            <div style={{ position: 'relative' }}>
                                <textarea
                                    className="form-control"
                                    id="captionInput"
                                    name="caption"
                                    style={{ height: '310px' }}
                                    value={spot.caption}
                                    onChange={handleCaptionChange}
                                    onKeyDown={handleKeyDown}
                                    ref={textareaRef}
                                    placeholder="Write a caption with #tag (optional)"
                                />
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="suggestions-container mt-3">
                                        {suggestions.map((suggestion, index) => (
                                            <div
                                                key={suggestion.id}
                                                className={`suggestion-item ${index === suggestionIndex ? 'suggestion-item--highlighted' : ''}`}
                                                onClick={() => selectSuggestion(suggestion)}
                                                onMouseEnter={() => setSuggestionIndex(index)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <span class="badge rounded-pill bg-light text-dark border">{suggestion.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
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
                            isDisabled={isLoading}
                        />
                        <Select className='text-start mt-3'
                            options={optionsModel}
                            onChange={handleModelChange}
                            isSearchable
                            isClearable
                            placeholder="Select model"
                            value={selectedModel}
                            isDisabled={isLoading || !selectedMake}
                        />

                        <Select className='text-start mt-3'
                            options={optionsGeneration}
                            onChange={handleGenerationChange}
                            isSearchable
                            isClearable
                            placeholder="Select generation"
                            isDisabled={isLoading || !selectedModel}
                            value={selectedGeneration}
                        />

                        <Select className='text-start mt-3'
                            options={optionsFacelift}
                            onChange={handleFaceliftChange}
                            isSearchable
                            isClearable
                            placeholder="Select facelift"
                            isDisabled={isLoading || !selectedGeneration}
                            value={selectedFacelift}
                        />

                        <Select className='text-start mt-3'
                            options={optionsBodystyle}
                            onChange={handleBodystyleChange}
                            isSearchable
                            isClearable
                            placeholder="Select bodystyle"
                            isDisabled={isLoading || !selectedFacelift}
                            value={selectedBodystyle}
                        />

                        <Select className='text-start mt-3'
                            options={optionsTrim}
                            onChange={handleTrimChange}
                            isSearchable
                            isClearable
                            placeholder="Select trim"
                            isDisabled={isLoading || !selectedBodystyle}
                            value={selectedTrim}
                        />
                    </div>
                </div>
                {isLoading ? (
                    <button className="btn btn-outline-primary mt-3" type="button" disabled>
                        <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                            style={{ marginRight: "8px" }}></span>
                        Loading...
                    </button>
                ) : (
                    <button className="btn btn-outline-primary mt-3" type="submit">
                        Add spot
                    </button>

                )}
                <AchievementModal
                    achievement={achievement}
                    onClose={() => {
                        setAchievement(null);
                        navigate("/");
                    }}
                />
                <Link className="btn btn-outline-danger mx-2 mt-3" to="/">Cancel</Link>
            </form>
        </div>

    );
}