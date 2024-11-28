import React, { useState } from 'react';

function PhotoManagement({ trim, onUpdateTrim }) {
    const [newPhoto, setNewPhoto] = useState(null); // для нового фото
    const [photoToDelete, setPhotoToDelete] = useState(null); // для фото, которое нужно удалить

    // Обработчик для добавления нового фото
    const handleAddPhoto = () => {
        if (newPhoto) {
            const updatedPhotos = [...trim.photos, { name: newPhoto, isMain: false }];
            onUpdateTrim(trim.id, { photos: updatedPhotos });
            setNewPhoto(null); // Очистить поле ввода
        }
    };

    // Обработчик для удаления фото
    const handleDeletePhoto = (photoName) => {
        const updatedPhotos = trim.photos.filter((photo) => photo.name !== photoName);
        onUpdateTrim(trim.id, { photos: updatedPhotos });
    };

    // Обработчик для назначения основного фото
    const handleSetMainPhoto = (photoName) => {
        const updatedPhotos = trim.photos.map((photo) => 
            photo.name === photoName ? { ...photo, isMain: true } : { ...photo, isMain: false }
        );
        onUpdateTrim(trim.id, { photos: updatedPhotos });
    };

    return (
        <div>
            <h3>Управление фотографиями для {trim.name}</h3>
            
            {/* Добавить фото */}
            <div>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setNewPhoto(e.target.files[0]?.name)} 
                />
                <button onClick={handleAddPhoto}>Добавить фото</button>
            </div>

            {/* Список фотографий */}
            <ul>
                {trim.photos.map((photo, index) => (
                    <li key={index}>
                        <div>
                            <img 
                                src={`https://newloripinbucket.s3.amazonaws.com/path-to-your-images/${photo.name}`} 
                                alt={photo.name} 
                                width="100"
                            />
                            {photo.isMain && <strong> (Основное)</strong>}
                        </div>
                        <button onClick={() => handleSetMainPhoto(photo.name)}>Назначить основным</button>
                        <button onClick={() => handleDeletePhoto(photo.name)}>Удалить</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PhotoManagement;
