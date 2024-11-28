import React, { useState } from "react";
import axios from "axios";

const SetMainPhoto = ({ make, model, generationId, bodystyleId, trimId, photoId, trim, setTrim }) => {

    const handleSetMain = async () => {
        try {
            const response = await axios.put(
                `http://localhost:8080/catalog/${make}/${model}/${generationId}/${bodystyleId}/${trimId}/setMainPhoto/${photoId}`,
            );

            if (response.status === 200) {
                // Update the photos in trim to reflect the new main photo
                const updatedPhotos = trim.photos.map((photo) =>
                    photo.id === photoId ? { ...photo, isMain: true } : { ...photo, isMain: false }
                );
                setTrim({ ...trim, photos: updatedPhotos });
            }
        } catch (err) {
            console.error("Error marking photo as main:", err.message);
        }
    };

    return (
        <button onClick={handleSetMain}>Set as Main Photo</button>
    );
};

export default SetMainPhoto;
