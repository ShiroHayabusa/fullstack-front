import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loader } from '@googlemaps/js-api-loader';
import { Modal, Button } from 'react-bootstrap';

const containerStyle = {
    width: '100%',
    height: '400px',
};

export default function ViewSpot() {
    const [spot, setSpot] = useState({ caption: '', photos: [], latitude: null, longitude: null });
    const { id } = useParams();
    const mapContainerRef = useRef(null); // Ссылка на контейнер карты

    useEffect(() => {
        loadSpot();
    }, []);

    useEffect(() => {
        if (spot.latitude && spot.longitude) {
            initializeMap();
        }
    }, [spot.latitude, spot.longitude]);

    const loadSpot = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/spots/${id}`);
            setSpot(result.data);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    };

    const [showModal, setShowModal] = useState(false); // Состояние для отображения модалки
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const handleOpenModal = (index) => {
        setCurrentPhotoIndex(index); // Устанавливаем индекс текущего фото
        setShowModal(true); // Открываем модалку
    };

    const handleCloseModal = () => {
        setShowModal(false); // Закрываем модалку
    };

    const handlePrevPhoto = () => {
        setCurrentPhotoIndex((prevIndex) =>
            prevIndex === 0 ? spot.photos.length - 1 : prevIndex - 1
        );
    };

    const handleNextPhoto = () => {
        setCurrentPhotoIndex((prevIndex) =>
            prevIndex === spot.photos.length - 1 ? 0 : prevIndex + 1
        );
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft") {
                handlePrevPhoto();
            } else if (e.key === "ArrowRight") {
                handleNextPhoto();
            } else if (e.key === "Escape") {
                handleCloseModal();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handlePrevPhoto, handleNextPhoto, handleCloseModal]);

    const initializeMap = async () => {
        const loader = new Loader({
            apiKey: "AIzaSyCAFPj_ck8L8ceN5wTWlyoWiLAutAxKJnI", // Замените на ваш API-ключ
            version: "weekly",
        });

        try {
            const google = await loader.importLibrary("maps"); // Загрузка библиотеки карт
            const googleMarker = await loader.importLibrary("marker"); // Загрузка библиотеки маркеров

            // Проверяем, что контейнер карты существует
            if (!mapContainerRef.current) {
                console.error("Контейнер карты не найден.");
                return;
            }

            // Инициализация карты
            const map = new google.Map(mapContainerRef.current, {
                center: { lat: spot.latitude, lng: spot.longitude },
                zoom: 13,
            });

            // Создание HTML-контента для маркера
            const markerElement = document.createElement('div');
            markerElement.innerHTML = `
                <div style="background-color: white; border: 1px solid black; border-radius: 8px; padding: 4px 8px; font-size: 14px; color: black;">
                    📍 ${spot.caption || 'Custom Marker'}
                </div>
            `;

            // Инициализация AdvancedMarkerElement
            new googleMarker.AdvancedMarkerElement({
                map: map,
                position: { lat: spot.latitude, lng: spot.longitude },
                content: markerElement,
            });
        } catch (error) {
            console.error("Ошибка загрузки Google Maps API:", error);
        }
    };

    const deleteSpot = async () => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this spot? This action cannot be undone.'
        );
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8080/spots/deleteSpot/${id}`);
                alert('Spot deleted successfully');
                window.location.href = '/spots';
            } catch (error) {
                console.error('Failed to delete spot:', error);
                alert('An error occurred while deleting the spot.');
            }
        }
    };

    return (
        <div>
            <ul className="nav mt-2 mb-2">
                <Link className="nav-link active" to={`/spots/editSpot/${id}`}>
                    Edit Spot
                </Link>
                <button className="btn btn-outline-danger" onClick={deleteSpot}>
                    Delete Spot
                </button>
            </ul>
            <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/" className="text-decoration-none">Home</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="/spots/" className="text-decoration-none">Spots</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">Spot {spot.id}</li>
                    </ol>
                </nav>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
                    <div className="col">
                        {spot.photos && spot.photos.length > 0 && (
                            <div>
                                {spot.photos.map((photo, index) => (
                                    <img
                                        key={index}
                                        src={`https://newloripinbucket.s3.amazonaws.com/image/spots/${photo.name}`}
                                        alt={photo.name}
                                        className="img-fluid mb-2"
                                        onClick={() => handleOpenModal(index)} // Открытие модального окна
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Bootstrap Modal */}
                    <Modal show={showModal} onHide={handleCloseModal} size="lg">
                        <Modal.Body>
                            <div className="d-flex justify-content-center">
                                <img
                                    src={`https://newloripinbucket.s3.amazonaws.com/image/spots/${spot.photos[currentPhotoIndex]?.name}`}
                                    className="img-fluid"
                                />
                            </div>
                        </Modal.Body>
                        <Modal.Footer className="d-flex justify-content-between">
                            <span>
                                Photo {currentPhotoIndex + 1} of {spot.photos.length}
                            </span>
                            <div>
                                <Button variant="outline-secondary btn-sm" onClick={handlePrevPhoto} className="me-2">
                                    ← Previous
                                </Button>
                                <Button variant="outline-secondary btn-sm" onClick={handleNextPhoto} className="me-2">
                                    Next →
                                </Button>
                                <Button variant="outline-primary btn-sm" onClick={handleCloseModal}>
                                    Close
                                </Button>
                            </div>
                        </Modal.Footer>
                    </Modal>
                    <div className="col">
                        <h5 className="pb-1 mb-4 text-black border-bottom text-start">Spotted by {spot.user?.name}</h5>
                        <p className='text-start'>{spot.caption}</p>
                        <div className="text-start">
                            <table class="table table-borderless">
                                <tbody>
                                    <tr>
                                        <th scope="row">Make:</th>
                                        <td className='text-start'>
                                            <Link to={`/catalog/${spot.make?.name}`} className="text-decoration-none">
                                                {spot.make?.name}
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Model:</th>
                                        <td>
                                            <Link to={`/catalog/${spot.make?.name}/${spot.model?.name}`} className="text-decoration-none">
                                                {spot.model?.name}
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Generation:</th>
                                        <td>
                                            <Link to={`/catalog/${spot.make?.name}/${spot.model?.name}/${spot.generation?.id}`} className="text-decoration-none">
                                                {spot.generation?.name}
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Facelift:</th>
                                        <td>
                                            <Link to={`/catalog/${spot.make?.name}/${spot.model?.name}/${spot.generation?.id}`} className="text-decoration-none">
                                                {spot.facelift?.name}
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Bodystyle:</th>
                                        <td>
                                            <Link to={`/catalog/${spot.make?.name}/${spot.model?.name}/${spot.generation?.id}/${spot.bodystyle?.id}`} className="text-decoration-none">
                                                {spot.bodystyle?.bodytype?.name}
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Trim:</th>
                                        <td>
                                            <Link to={`/catalog/${spot.make?.name}/${spot.model?.name}/${spot.generation?.id}/${spot.bodystyle?.id}/${spot.trim?.id}`} className="text-decoration-none">
                                                {spot.trim?.name}
                                            </Link>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col">
                        <div className="container">
                            <div>
                                <h4 className='text-start'>Map:</h4>
                                <div ref={mapContainerRef} style={containerStyle}></div>
                            </div>
                        </div>
                        <div>
                            <h4 >Coordinates:</h4>
                            <p>
                                {spot.latitude && spot.longitude
                                    ? `${spot.latitude}, ${spot.longitude}`
                                    : 'Coordinates not available'}
                            </p>
                        </div>
                        <div className="col border">
                            <div className="mb-3">
                                <label for="exampleFormControlTextarea1" className="form-label">Comments</label>
                                <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
