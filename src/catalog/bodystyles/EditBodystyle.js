import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function EditBodystyle() {

    const { make, model, generationId, bodystyleId } = useParams();
    let navigate = useNavigate();

    const [bodystyleEntity, setBodystyleEntity] = useState({
        bodytype: "",
        facelift: "",
        years: "",
        market: "",
        description: "",
        length: "",
        width: "",
        height: "",
        base: ""
    });

    const [faceliftList, setFaceliftList] = useState([]);
    const [marketList, setMarketList] = useState([]);
    const [bodytypeList, setBodytypeList] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchBodystyleEntity = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}/${generationId}/${bodystyleId}/editBodystyle`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setBodystyleEntity({
                    bodytype: response.data.bodytype?.id || "",
                    bodytypeName: response.data.bodytype?.name,
                    generation: response.data.generation,
                    facelift: response.data.facelift?.id || "",
                    faceliftName: response.data.facelift?.name,
                    years: response.data.years,
                    market: response.data.market?.id || "",
                    description: response.data.description,
                    photo: response.data.photo,
                    length: response.data.length,
                    width: response.data.width,
                    height: response.data.height,
                    base: response.data.base
                });
            } catch (error) {
                setError('Error fetching bodystyle details: ' + error.message);
            }
        };

        const fetchFaceliftList = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}/${generationId}/faceliftList`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setFaceliftList(response.data);
            } catch (error) {
                console.log('Error fetching facelifts:', error);
            }
        };

        const fetchMarketList = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/markets`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setMarketList(response.data);
            } catch (error) {
                console.log('Error fetching markets:', error);
            }
        }

        const fetchBodytypeList = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/bodytypes`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setBodytypeList(response.data);
            } catch (error) {
                console.log('Error fetching bodystylenames:', error);
            }
        }

        fetchBodystyleEntity();
        fetchBodytypeList();
        fetchFaceliftList();
        fetchMarketList();
    }, [make, model, generationId, bodystyleId]);

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setBodystyleEntity({
            ...bodystyleEntity,
            [name]: value
        });
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!bodystyleEntity.bodytype || !bodystyleEntity.facelift) {
            setError('Please provide both a bodytype and a facelift.');
            return;
        }

        const formData = new FormData();

        Object.keys(bodystyleEntity).forEach(key => {
            formData.append(key, bodystyleEntity[key]);
        });

        if (selectedFile) {
            formData.append('photo', selectedFile);
        }

        if (bodystyleEntity.bodytype) {
            formData.append('bodytypeId', bodystyleEntity.bodytype);
        }

        if (bodystyleEntity.facelift) {
            formData.append('faceliftId', bodystyleEntity.facelift);
        }

        if (bodystyleEntity.market && bodystyleEntity.market !== "default") {
            formData.append('marketId', bodystyleEntity.market);
        }

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/catalog/${make}/${model}/${generationId}/${bodystyleId}/editBodystyle`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (response.status === 200) {
                setSuccess('Make updated successfully');
                setError('');
                navigate(`/catalog/${make}/${model}/${generationId}/${bodystyleId}`);
            }
        } catch (error) {
            setError('Error updating bodystyle: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item"><a href='/catalog' className="text-decoration-none">Catalog</a></li>
                    <li className="breadcrumb-item"><a href={`/catalog/${make}`} className="text-decoration-none">{make}</a></li>
                    <li className="breadcrumb-item"><a href={`/catalog/${make}/${model}`} className="text-decoration-none">{model}</a></li>
                    <li className="breadcrumb-item"><a href={`/catalog/${make}/${model}/${generationId}`} className="text-decoration-none">{bodystyleEntity.generation?.name}</a></li>
                    <li className="breadcrumb-item"><a href={`/catalog/${make}/${model}/${generationId}/${bodystyleId}`} className="text-decoration-none">{bodystyleEntity.bodytypeName}</a></li>

                    <li className="breadcrumb-item active" aria-current="page">Edit bodystyle</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Edit Bodystyle</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={onSubmit}>

                        <select
                            onChange={onInputChange}
                            name='bodytype'
                            className="form-select mt-3 mb-3"
                            value={bodystyleEntity.bodytype}
                        >
                            <option value={"default"}>
                                Select bodystyle
                            </option>
                            {bodytypeList.map((bodytype) => (
                                <option key={bodytype.id} value={bodytype.id} >
                                    {bodytype.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type='text'
                            className='form-control'
                            placeholder='Enter years'
                            name='years'
                            value={bodystyleEntity.years}
                            onChange={onInputChange}
                        />

                        <select
                            onChange={onInputChange}
                            name="facelift"
                            className="form-select mt-3 mb-3"
                            value={bodystyleEntity.facelift}
                        >
                            <option value={"default"}>
                                Select facelift
                            </option>
                            {faceliftList.map((facelift) => (
                                <option key={facelift.id} value={facelift.id}>
                                    {facelift.name}
                                </option>
                            ))}
                        </select>

                        <select
                            onChange={onInputChange}
                            name="market"
                            className="form-select mt-3 mb-3"
                            value={bodystyleEntity.market}
                        >
                            <option value={"default"}>
                                Select market
                            </option>
                            {marketList.map((market) => (
                                <option key={market.id} value={market.id}>
                                    {market.name}
                                </option>
                            ))}
                        </select>

                        <textarea
                            type='text'
                            className='form-control mt-3 mb-3'
                            placeholder='Enter description'
                            style={{ height: '310px' }}
                            name='description'
                            value={bodystyleEntity.description}
                            onChange={onInputChange}
                        />

                        <input
                            type='text'
                            className='form-control mt-3 mb-3'
                            placeholder='Enter length'
                            name='length'
                            value={bodystyleEntity.length}
                            onChange={onInputChange}
                        />

                        <input
                            type='text'
                            className='form-control mt-3 mb-3'
                            placeholder='Enter wifth'
                            name='width'
                            value={bodystyleEntity.width}
                            onChange={onInputChange}
                        />

                        <input
                            type='text'
                            className='form-control mt-3 mb-3'
                            placeholder='Enter height'
                            name='height'
                            value={bodystyleEntity.height}
                            onChange={onInputChange}
                        />

                        <input
                            type='text'
                            className='form-control mt-3 mb-3'
                            placeholder='Enter base'
                            name='base'
                            value={bodystyleEntity.base}
                            onChange={onInputChange}
                        />

                        <img
                            style={{ width: '40px', height: 'auto' }}
                            src={`https://newloripinbucket.s3.amazonaws.com/image/catalog/${make}/${model}/${bodystyleEntity.generation?.name}/${bodystyleEntity.faceliftName}/${bodystyleEntity.bodytypeName}/${bodystyleEntity?.photo?.name}`}
                            className="mt-3 mb-3"
                            alt="...">
                        </img>

                        <input
                            type='file'
                            className='form-control mt-3 mb-3'
                            name='photo'
                            onChange={handleFileChange}
                        />
                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/catalog/${make}/${model}/${generationId}/${bodystyleId}`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
