import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AddGeneration() {

    let navigate = useNavigate();

    const [generation, setGeneration] = useState({
        name: "",
        years: "",
        description: "",
        body: ""
    });
    const [bodyList, setBodyList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const { name, years, description } = generation;
    const { make, model } = useParams();
    const { user } = useAuth(); // Получаем пользователя из AuthContext

    const onInputChange = (e) => {
        setGeneration({ ...generation, [e.target.name]: e.target.value });
    };

    const fetchBodies = () => {
        axios
            .get(`http://localhost:8080/administration/bodies/${make}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    //check the api call is success by stats code 200,201 ...etc
                    setBodyList(data)
                } else {
                    //error handle section 
                }
            })
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        fetchBodies()
    }, [])

    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', generation.name);
        formData.append('years', generation.years);
        formData.append('description', generation.description);
        formData.append('body', generation.body);
        formData.append('photo', selectedFile);
        try {
            const response = await axios.post(`http://localhost:8080/catalog/${make}/${model}/addGeneration`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (response.status === 200 || response.status === 201) {
                console.log('Generation added successfully');
                navigate(`/catalog/${make}/${model}`);
            }
        } catch (error) {
            console.error('Error adding generation: ', error);
        }
    };


    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    return (
        <div className='container'>
            <nav className='mt-2' aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item"><a href="/catalog" className="text-decoration-none">Catalog</a></li>
                    <li className="breadcrumb-item"><Link to={`/catalog/${make}`} className="text-decoration-none">{make}</Link></li>
                    <li className="breadcrumb-item"><Link to={`/catalog/${make}/${model}`} className="text-decoration-none">{model}</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Add generation</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Add generation</h2>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Generation</label>
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter generation'
                                name='name'
                                value={name}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className='mb-3'>
                            <input
                                type={'text'}
                                className='form-control'
                                placeholder='Enter years'
                                name='years'
                                value={years}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <div className='mb-3'>
                            <textarea
                                className='form-control'
                                placeholder='Enter description'
                                style={{ height: '310px' }}
                                name='description'
                                value={description}
                                onChange={(e) => onInputChange(e)}
                            />
                        </div>
                        <select onChange={onInputChange} name="body" className="form-select mt-3 mb-3">
                            <option value={"default"}>
                                Select body
                            </option>
                            {bodyList.map((body) => (
                                <option key={body.id} value={body.id} >
                                    {body.name}
                                </option>
                            ))}
                        </select>
                        <div className='mt-3 mb-3'>
                            <input
                                type="file"
                                className="form-control"
                                name='photo'
                                onChange={handleFileChange}
                            />
                        </div>

                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/catalog/${make}/${model}`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
