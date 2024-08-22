import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function AddMake() {

    let navigate = useNavigate();

    const [make, setMake] = useState({
        name: "",
        country: "",
        description: "",
        tuner: false
    });

    const [countryList, setCountryList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const { name, country, description, tuner } = make;

    const onInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setMake({
            ...make,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('country', country);
        formData.append('description', description);
        formData.append('photo', selectedFile);
        formData.append('tuner', tuner);

        try {
            const response = await axios.post('http://localhost:8080/catalog/addMake', formData);
            if (response.status === 200 || response.status === 201) {
                console.log('Make added successfully');
                navigate('/catalog');
            }
        } catch (error) {
            console.error('Error adding make: ', error);
        }
    };

    const fetchCountries = () => {
        axios
            .get('http://localhost:8080/administration/countries')
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    //check the api call is success by stats code 200,201 ...etc
                    setCountryList(data)
                } else {
                    //error handle section 
                }
            })
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        fetchCountries()
    }, [])



    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="/">Home</a></li>
                    <li class="breadcrumb-item"><a href="/catalog">Catalog</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Add make</li>

                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Add make</h2>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className='mb-3'>
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter make'
                                name='name'
                                value={name}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <select onChange={onInputChange} name="country" className="form-select mt-3 mb-3">
                            <option value={"default"}>
                                Select country
                            </option>
                            {countryList.map((country) => (
                                <option key={country.id} value={country.id} >
                                    {country.name}
                                </option>
                            ))}
                        </select>
                        <div className='mb-3'>
                            <textarea
                                type={'text'}
                                className='form-control'
                                placeholder='Enter description'
                                name='description'
                                value={description}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className='mb-3'>
                            <input
                                type="file"
                                className="form-control"
                                name='photo'
                                onChange={handleFileChange}
                            />
                        </div>

                        <div className="form-check form-switch mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="flexSwitchCheckDefault"
                                name="tuner"
                                checked={tuner}
                                onChange={onInputChange}
                            />
                            <label className="form-check-label" for="flexSwitchCheckDefault">Tuner</label>
                        </div>

                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to='/catalog'>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
