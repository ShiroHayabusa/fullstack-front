import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function EditTransmission() {

    const { make, transmissionId } = useParams(); // Assuming the engine ID is passed as a route parameter
    let navigate = useNavigate();

    const [transmission, setTransmission] = useState({
        name: '',
        description: '',
        transmissionType: ''
    });
    const [transmissionTypes, setTransmissionTypes] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Fetch the current details of the engine
        const fetchTransmission = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/administration/transmissions/${make}/${transmissionId}`);
                setTransmission({
                    name: response.data.name,
                    description: response.data.description,
                    transmissionType: response.data.transmissionType?.id,
                    photo: response.data.photo
                });
                console.log("transmission:", response)
            } catch (error) {
                setError('Error fetching transmission details: ' + error.message);
            }
        };

        fetchTransmission();
        fetchTransmissionTypes()
    }, []);

    const fetchTransmissionTypes = () => {
        axios
            .get('http://localhost:8080/administration/transmissionTypes')
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    //check the api call is success by stats code 200,201 ...etc
                    setTransmissionTypes(data)
                } else {
                    //error handle section 
                }
            })
            .catch((error) => console.log(error));
    };

    const onInputChange = (e) => {
        setTransmission({ ...transmission, [e.target.name]: e.target.value });
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!transmission.name) {
            setError('Please provide a transmission name.');
            return;
        }

        const formData = new FormData();
        Object.keys(transmission).forEach(key => {
            formData.append(key, transmission[key]);
        });

        if (selectedFile) {
            formData.append('photo', selectedFile);
        }

        if (transmission.transmissionType) {
            formData.append('transmissionTypeId', transmission.transmissionType);
        }

        try {
            const response = await axios.put(`http://localhost:8080/administration/transmissions/${make}/${transmissionId}`, formData);
            if (response.status === 200) {
                setSuccess('Transmission updated successfully');
                setError('');
                navigate(`/administration/transmissions/${make}/${transmissionId}`);
            }
        } catch (error) {
            setError('Error updating transmission: ' + error.message);
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="/">Home</a></li>
                    <li class="breadcrumb-item"><a href='/administration'>Administration</a></li>
                    <li class="breadcrumb-item"><a href='/administration/transmissions'>Transmissions</a></li>
                    <li class="breadcrumb-item"><a href={`/administration/transmissions/${make}`} className="text-decoration-none">{make}</a></li>
                    <li class="breadcrumb-item"><a href={`/administration/transmissions/${make}/${transmissionId}`} className="text-decoration-none">{transmission.name}</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Edit transmission</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Edit Transmission</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={onSubmit}>

                        <input
                            type='text'
                            className='form-control mt-3 mb-3'
                            placeholder='Enter transmission name'
                            name='name'
                            value={transmission.name}
                            onChange={onInputChange}
                        />

                        <select
                            onChange={onInputChange}
                            name='transmissionType'
                            className="form-select mt-3 mb-3"
                            value={transmission.transmissionType}
                        >
                            <option value={"default"}>
                                Select transmission type
                            </option>
                            {transmissionTypes.map((transmissionType) => (
                                <option key={transmissionType.id} value={transmissionType.id} >
                                    {transmissionType.name}
                                </option>
                            ))}
                        </select>

                        <textarea
                            type='text'
                            className='form-control mt-3 mb-3'
                            placeholder='Enter description'
                            name='description'
                            value={transmission.description}
                            onChange={onInputChange}
                        />

                        <img
                            style={{ width: '40px', height: 'auto' }}
                            src={`https://newloripinbucket.s3.amazonaws.com/image/transmissions/${make}/${transmission.name}/${transmission?.photo?.name || 'defaultImage.jpg'}`}
                            className="mb-3"
                            alt="...">
                        </img>

                        <input
                            type='file'
                            className='form-control mt-3 mb-3'
                            name='photo'
                            onChange={handleFileChange}
                        />

                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/administration/transmissions/${make}/${transmissionId}`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
