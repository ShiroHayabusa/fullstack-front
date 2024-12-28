import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

    const { caption } = spot;

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

    const clearPreviews = () => {
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        setPreviewUrls([]);
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("caption", caption);
        if (latitude !== null) {
            formData.append("latitude", latitude);
        }
        if (longitude !== null) {
            formData.append("longitude", longitude);
        }
        formData.append("mainPhotoIndex", mainPhotoIndex);

        selectedFiles.forEach((file) => formData.append("photos", file));

        try {
            const response = await axios.post(`http://localhost:8080/spots/addSpot`, formData);

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
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Add Spot</h2>
                    <form onSubmit={onSubmit}>
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

                        <button type="submit" className="btn btn-outline-primary mt-3">Add Spot</button>
                        <Link className="btn btn-outline-danger mx-2 mt-3" to="/spots">Cancel</Link>
                    </form>
                </div>
            </div>
        </div>

    );
}
