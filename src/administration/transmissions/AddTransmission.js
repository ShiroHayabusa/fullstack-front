import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function AddTransmission() {

    let navigate = useNavigate();

    const [transmission, setTransmission] = useState({
        name: "",
        description: "",
        transmissionType: ""
    });

    const { make } = useParams();

    const [transmissionTypes, setTransmissionTypes] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { name, description, transmissionType } = transmission;

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

    useEffect(() => {
        fetchTransmissionTypes()
    }, [])

    const onInputChange = (e) => {
        setTransmission({ ...transmission, [e.target.name]: e.target.value });
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!name) {
            setError('Please provide an transmission name and upload photo.');
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

        if (transmission.make) {
            formData.append('makeId', transmission.make);
        }

        try {
            const response = await axios.post(`http://localhost:8080/administration/transmissions/${make}/addTransmission`, formData);
            if (response.status === 200 || response.status === 201) {
                setSuccess('Transmission added successfully');
                setError('');
                setTransmission({ name: "" });
                setSelectedFile(null);
                navigate(`/administration/transmissions/${make}`);
            }
        } catch (error) {
            console.error('Error adding transmission: ', error.message);
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li class="breadcrumb-item"><a href='/administration' className="text-decoration-none">Administration</a></li>
                    <li class="breadcrumb-item"><a href='/administration/transmissions' className="text-decoration-none">Transmissions</a></li>
                    <li class="breadcrumb-item"><a href={`/administration/transmissions/${make}`} className="text-decoration-none">{make}</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Add transmission</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Add transmission</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={(e) => onSubmit(e)}>

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter transmission name'
                            name='name'
                            value={name}
                            onChange={(e) => onInputChange(e)}
                        />

                        <select onChange={onInputChange} name="transmissionType" className="form-select mt-3 mb-3">
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
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter description'
                            name='description'
                            value={description}
                            onChange={(e) => onInputChange(e)}
                        />

                        <input
                            type="file"
                            className="form-control mt-3 mb-3"
                            name='photo'
                            onChange={handleFileChange}
                        />

                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/administration/transmissions/${make}`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
