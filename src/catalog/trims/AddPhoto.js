import React, { useState } from "react";
import axios from "axios";

const AddPhoto = ({ make, model, generationId, bodystyleId, trimId, trim, setTrim }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setError("");
        setSuccess("");
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError("Please select a file to upload.");
            return;
        }


        const formData = new FormData();
        formData.append("photo", selectedFile);

        try {
            const response = await axios.put(
                `http://localhost:8080/catalog/${make}/${model}/${generationId}/${bodystyleId}/${trimId}/addPhoto`,
                formData
            );

            if (response.status === 200 || response.status === 201) {
                const uploadedPhoto = response.data; // Backend returns the Photo object, including the name
                setTrim((prevTrim) => ({
                    ...prevTrim,
                    photos: [...prevTrim.photos, uploadedPhoto],
                }));
                setSuccess("Photo uploaded successfully!");
                setError("");
            }
        } catch (err) {
            console.error("Error uploading photo:", err.message);
            setError("Failed to upload photo. Please try again.");
        } finally {
            setSelectedFile(null); // Reset file input
        }
    };

    return (
        <div>
            <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                style={{ marginBottom: "10px" }}
            />
            <button onClick={handleUpload}>Upload Photo</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
        </div>
    );
};

export default AddPhoto;
