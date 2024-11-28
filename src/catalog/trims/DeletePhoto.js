import React, { useState } from "react";
import axios from "axios";

const DeletePhoto = ({ make, model, generationId, bodystyleId, trimId, photoId, trim, setTrim }) => {
    const handleDelete = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:8080/catalog/${make}/${model}/${generationId}/${bodystyleId}/${trimId}/deletePhoto/${photoId}`
            );

            if (response.status === 200) {
                // Update the photos in trim locally
                const updatedPhotos = trim.photos.filter((photo) => photo.id !== photoId);
                setTrim({ ...trim, photos: updatedPhotos });
            }
        } catch (err) {
            console.error("Error deleting photo:", err.message);
        }
    };

    return (
        <button onClick={handleDelete}>
            Delete Photo
        </button>
    );
};

export default DeletePhoto;
