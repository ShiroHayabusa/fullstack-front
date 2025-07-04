import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AddBodystyle() {

    let navigate = useNavigate();
    const { make, model, generation } = useParams();
    const [bodytypeList, setBodytypeList] = useState([]);
    const [faceliftList, setFaceliftList] = useState([]);
    const [marketList, setMarketList] = useState([]);

    const [bodystyle, setBodystyle] = useState({
        facelift: "",
        bodytype: "",
        market: "",
        years: "",
        description: "",
        length: "",
        width: "",
        height: "",
        base: ""
    });

    const { facelift, bodytype, market, years, description, length, width, height, base } = bodystyle;
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const [generationEntity, setGenerationEntity] = useState({
        name: ''
    });
    const [modelDetails, setModelDetails] = useState(null);

    const { user } = useAuth();

    const loadModelDetails = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}`);
            setModelDetails(result.data);
        } catch (error) {
            console.error('Error loading model details:', error);
        }
    };

    useEffect(() => {
        fetchBodytypeData();
        fetchFaceliftData();
        fetchMarketData();
        loadGenerationEntity();
        loadModelDetails();
    }, [])

    const loadGenerationEntity = async () => {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}/${generation}/editGeneration`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });
        setGenerationEntity(result.data);
    }


    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };
    const onChange = (e) => {
        setBodystyle({ ...bodystyle, [e.target.name]: e.target.value });
    };

    const fetchBodytypeData = () => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/api/admin/bodytypes`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    setBodytypeList(data)
                }
            })
            .catch((error) => console.log(error));
    };

    const fetchFaceliftData = () => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/api/catalog/` + make + "/" + model + "/" + generation + '/faceliftList', {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {

                    setFaceliftList(data)
                }
            })
            .catch((error) => console.log(error));
    };

    const fetchMarketData = () => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/api/admin/markets`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    setMarketList(data)
                }
            })
            .catch((error) => console.log(error));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!bodystyle.facelift || !bodystyle.bodytype) {
            setError('Please provide facelift and bodystyle');
            return;
        }

        const formData = new FormData();

        Object.keys(bodystyle).forEach(key => {
            formData.append(key, bodystyle[key]);
        });

        if (selectedFile) {
            formData.append('photo', selectedFile);
        }


        if (facelift === "default") {
            setError("Please select a facelift option.");
            return;
        }

        if (bodystyle.facelift) {
            formData.append('faceliftId', bodystyle.facelift);
        }

        if (bodystyle.bodytype) {
            formData.append('bodytypeId', bodystyle.bodytype);
        }

        if (bodystyle.market) {
            formData.append('marketId', bodystyle.market);
        }

        try {
            const response =
                await axios.post(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}/${generation}/addBodystyle`, formData, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
            if (response.status === 200 || response.status === 201) {
                console.log('Bodystyle added successfully');
                navigate(`/catalog/${make}/${model}/${generation}`);
            }
        } catch (error) {
            console.error('Error adding bodystyle: ', error);
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb mt-2">
                    <li class="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li class="breadcrumb-item"><a href="/catalog" className="text-decoration-none">Catalog</a></li>
                    <li class="breadcrumb-item"><Link to={`/catalog/${make}`} className="text-decoration-none">{make}</Link></li>
                    <li class="breadcrumb-item"><Link to={`/catalog/${make}/${model}`} className="text-decoration-none">{modelDetails?.name}</Link></li>
                    <li class="breadcrumb-item"><Link to={`/catalog/${make}/${model}/${generation}`} className="text-decoration-none">{generationEntity.name}</Link></li>
                    <li class="breadcrumb-item active" aria-current="page">Add bodystyle</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Add bodystyle</h2>
                    <form onSubmit={(e) => onSubmit(e)}>
                        {error && <div className="alert alert-danger">{error}</div>}

                        <select onChange={onChange} name='facelift' className="form-select mt-3 mb-3">
                            <option value={"default"}>
                                Select facelift
                            </option>
                            {faceliftList.map((item) => (
                                <option key={item.id} value={item.id} >
                                    {item.name}
                                </option>
                            ))}
                        </select>
                        {error && <div className="text-danger">{error}</div>}
                        <select onChange={onChange} name='bodytype' className="form-select mt-3 mb-3">
                            <option defaultValue>
                                Select bodytype
                            </option>
                            {bodytypeList.map((item) => (
                                <option className='text-capitalize' key={item.id} value={item.id} >
                                    {item.name}
                                </option>
                            ))}
                        </select>

                        <select onChange={onChange} name='market' className="form-select mt-3 mb-3">
                            <option defaultValue>
                                Select market
                            </option>
                            {marketList.map((item) => (
                                <option className='text-capitalize' key={item.id} value={item.id} >
                                    {item.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter years of production'
                            name='years'
                            value={years}
                            onChange={(e) => onChange(e)}
                        />

                        <textarea
                            type='text'
                            className='form-control mt-3 mb-3'
                            placeholder='Enter description'
                            name='description'
                            value={description}
                            onChange={(e) => onChange(e)}
                        />

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter length'
                            name='length'
                            value={length}
                            onChange={(e) => onChange(e)}
                        />

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter wifth'
                            name='width'
                            value={width}
                            onChange={(e) => onChange(e)}
                        />

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter height'
                            name='height'
                            value={height}
                            onChange={(e) => onChange(e)}
                        />

                        <input
                            type={'text'}
                            className='form-control mt-3 mb-3'
                            placeholder='Enter base'
                            name='base'
                            value={base}
                            onChange={(e) => onChange(e)}
                        />

                        <input
                            type="file"
                            className="form-control mt-3 mb-3"
                            name='photo'
                            onChange={handleFileChange}
                        />

                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2"
                            to={`/catalog/${make}/${model}/${generation}`}>Cancel</Link>
                    </form >
                </div>
            </div>
        </div>
    );
}
