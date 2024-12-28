import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Modal, Button } from 'react-bootstrap';

export default function ViewTrim() {
    const [showModal, setShowModal] = useState(false); // Состояние для отображения модалки
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const handleOpenModal = (index) => {
        setCurrentPhotoIndex(index); // Устанавливаем индекс текущего фото
        setShowModal(true); // Открываем модалку
    };

    const handleCloseModal = () => {
        setShowModal(false); // Закрываем модалку
    };

    const handleNextPhoto = () => {
        setCurrentPhotoIndex((prevIndex) =>
            prevIndex === trim.photos.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePrevPhoto = () => {
        setCurrentPhotoIndex((prevIndex) =>
            prevIndex === 0 ? trim.photos.length - 1 : prevIndex - 1
        );
    };

    const [trim, setTrim] = useState({
        name: '',
        bodystyle: '',
        description: '',
        engine: '',
        transmission: '',
        body: '',
        drivetrain: '',
        years: '',
        tuner: '',
        amount: '',
        maxSpeed: '',
        acceleration: '',
        weight: '',
        uniq: '',
        electric: '',
        hybrid: '',
        battery: '',
        range: '',
        market: ''
    });

    const { make, model, generationId, bodystyleId, trimId } = useParams();

    useEffect(() => {
        loadTrim()
    }, []);

    const loadTrim = async () => {
        const result = await axios.get(
            `http://localhost:8080/catalog/${make}/${model}/${generationId}/${bodystyleId}/${trimId}`);
        setTrim(result.data);
    }

    if (!trim.photos || trim.photos.length === 0) {
        return <div>Нет фотографий для отображения.</div>;
    }

    return (

        <div>
            <ul className="nav">
                <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to={`/catalog/${make}/${model}/${generationId}/${bodystyleId}/${trim.id}/editTrim`}
                    >Edit Trim</Link>
                </li>
            </ul>

            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item"><a href="/catalog" className="text-decoration-none">Catalog</a></li>
                        <li className="breadcrumb-item"><a href={`/catalog/${make}`} className="text-decoration-none">{make}</a></li>
                        <li className="breadcrumb-item"><a href={`/catalog/${make}/${model}`} className="text-decoration-none">{model}</a></li>
                        <li className="breadcrumb-item"><a href={`/catalog/${make}/${model}/${generationId}`} className="text-decoration-none">{trim.bodystyle.generation?.name}</a></li>
                        <li className="breadcrumb-item"><a href={`/catalog/${make}/${model}/${generationId}/${bodystyleId}`} className="text-decoration-none">{trim.bodystyle.bodytype?.name}</a></li>
                        <li className="breadcrumb-item active" aria-current="page">{trim.name}</li>
                    </ol>
                </nav>

                <div className="h5 pb-1 mb-4 text-black border-bottom border-black text-start">
                    {make + ' ' + model + ' ' + trim.name}
                </div>

                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
                    <div className="col">
                        <ul className="list-group list-group-flush">

                            <li className="list-group-item text-start">
                                Years of production: {trim.years}
                            </li>

                            <li className="list-group-item text-start">
                                Market: {trim.market?.name}
                            </li>

                            <li className="list-group-item text-start">
                                Amount: {trim.amount}
                            </li>

                            <li className="list-group-item text-start">
                                {trim.description}
                            </li>

                            <li className="list-group-item text-start">
                                Engine: <Link to={`/administration/engines/${make}/${trim.engine?.id}`} className="text-decoration-none">{trim.engine?.name}</Link>
                                {trim.engine && (
                                    <p>{trim.engine?.displacement} l, {trim.engine?.power} hp, {trim.engine?.torque} Nm</p>
                                )}
                            </li>

                            <li className="list-group-item text-start">
                                Transmission: <Link to={`/administration/transmissions/${make}/${trim.transmission?.id}`} className="text-decoration-none">{trim.transmission?.name}</Link>
                                <p>{trim.transmission?.transmissionType?.name}</p>
                            </li>

                            <li className="list-group-item text-start">
                                Body: <Link to={`/administration/bodies/${make}/${trim.body?.id}`} className="text-decoration-none">{trim.body?.name}</Link>
                            </li>

                            <li className="list-group-item text-start">
                                Drivetrain: {trim.drivetrain?.name}
                            </li>

                        </ul>
                    </div>

                    <div className="col">
                        <ul className="list-group list-group-flush">
                            {trim.maxSpeed && (
                                <li className="list-group-item text-start">
                                    Max speed: {trim.maxSpeed} km/h
                                </li>
                            )}
                            {trim.acceleration && (
                                <li className="list-group-item text-start">
                                    Acceleration (0-100 km/h): {trim.acceleration} s
                                </li>
                            )}
                            {trim.weight && (
                                <li className="list-group-item text-start">
                                    Weight: {trim.weight} kg
                                </li>
                            )}
                            {trim.bodystyle.length && (
                                <li className="list-group-item text-start">
                                    Length: {trim.bodystyle.length} mm
                                </li>
                            )}
                            {trim.bodystyle.width && (
                                <li className="list-group-item text-start">
                                    Width: {trim.bodystyle.width} mm
                                </li>
                            )}
                            {trim.bodystyle.height && (
                                <li className="list-group-item text-start">
                                    Height: {trim.bodystyle.height} mm
                                </li>
                            )}
                            {trim.bodystyle.base && (
                                <li className="list-group-item text-start">
                                    Wheelbase: {trim.bodystyle.base} mm
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="col">
                        {trim.photos && trim.photos.length > 0 && (
                            <div>
                                {trim.photos.map((photo, index) => (
                                    <img
                                        key={index}
                                        src={`https://newloripinbucket.s3.amazonaws.com/image/catalog/${make}/${model}/${trim.bodystyle.generation?.name}/${trim.bodystyle.facelift?.name}/${trim.bodystyle.bodytype?.name}/${trim.name}/${photo.name}`}
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
                                    src={`https://newloripinbucket.s3.amazonaws.com/image/catalog/${make}/${model}/${trim.bodystyle.generation?.name}/${trim.bodystyle.facelift?.name}/${trim.bodystyle.bodytype?.name}/${trim.name}/${trim.photos[currentPhotoIndex].name}`}
                                    className="img-fluid"
                                />
                            </div>
                        </Modal.Body>
                        <Modal.Footer className="d-flex justify-content-between">
                            <span>
                                Photo {currentPhotoIndex + 1} of {trim.photos.length}
                            </span>
                            <div>
                                <Button variant="secondary" onClick={handlePrevPhoto} className="me-2">
                                    ← Previous
                                </Button>
                                <Button variant="secondary" onClick={handleNextPhoto} className="me-2">
                                    Next →
                                </Button>
                                <Button variant="primary" onClick={handleCloseModal}>
                                    Close
                                </Button>
                            </div>
                        </Modal.Footer>
                    </Modal>
                </div>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2">
                    <div className="col border">
                        <div className="mb-3">
                            <label for="exampleFormControlTextarea1" className="form-label">Comments</label>
                            <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
