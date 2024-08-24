import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function AddBodystyle() {

    let navigate = useNavigate();
    const { make, model, generation } = useParams();
    const [bodytypeList, setBodytypeList] = useState([]);
    const [faceliftList, setFaceliftList] = useState([]);
    const [marketList, setMarketList] = useState([]);
    const [bodystyle, setBodystyle] = useState({
        facelift: "",
        bodytype: "",
        years: "",
        description: ""
    });
    const { facelift, bodytype, years, description } = bodystyle;
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const [generationEntity, setGenerationEntity] = useState({
        name: ''
    });

    useEffect(() => {
        fetchBodytypeData();
        fetchFaceliftData();
        fetchMarketData();
        loadGenerationEntity();
    }, [])

    const loadGenerationEntity = async () => {
        const result = await axios.get(`http://localhost:8080/catalog/${make}/${model}/${generation}`);
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
            .get('http://localhost:8080/administration/bodytypes')
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    //check the api call is success by stats code 200,201 ...etc
                    setBodytypeList(data)
                } else {
                    //error handle section 
                }
            })
            .catch((error) => console.log(error));
    };

    const fetchFaceliftData = () => {
        axios
            .get('http://localhost:8080/catalog/' + make + "/" + model + "/" + generation + '/faceliftList')
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    //check the api call is success by stats code 200,201 ...etc
                    setFaceliftList(data)

                } else {
                    //error handle section 
                }
            })
            .catch((error) => console.log(error));
    };

    const fetchMarketData = () => {
        axios
            .get('http://localhost:8080/administration/markets')
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    //check the api call is success by stats code 200,201 ...etc
                    setMarketList(data)
                } else {
                    //error handle section 
                }
            })
            .catch((error) => console.log(error));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!bodystyle.facelift || !bodystyle.bodytype || !selectedFile) {
            setError('Please provide facelift, bodystyle and upload an image.');
            return;
        }
        const formData = new FormData();
        formData.append('name', bodystyle.name);
        formData.append('facelift', bodystyle.facelift);
        formData.append('bodytype', bodystyle.bodytype);
        formData.append('photo', selectedFile);
        formData.append('years', bodystyle.years);
        formData.append('description', bodystyle.description);
        try {
            const response =
                await axios.post(`http://localhost:8080/catalog/${make}/${model}/${generation}/addBodystyle`, formData);
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
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="/">Home</a></li>
                    <li class="breadcrumb-item"><a href="/catalog">Catalog</a></li>
                    <li class="breadcrumb-item"><Link to={`/catalog/${make}`}>{make}</Link></li>
                    <li class="breadcrumb-item"><Link to={`/catalog/${make}/${model}`}>{model}</Link></li>
                    <li class="breadcrumb-item"><Link to={`/catalog/${make}/${model}/${generation}`}>{generationEntity.name}</Link></li>
                    <li class="breadcrumb-item active" aria-current="page">Add bodystyle</li>
                </ol>
            </nav>
            <form onSubmit={(e) => onSubmit(e)}>
                <h2 className="mb-3">Add bodystyle</h2>
                {error && <div className="alert alert-danger">{error}</div>}

                <select onChange={onChange} name='facelift' className="form-select mt-5 mb-5">
                    <option value={"default"}>
                        Select facelift
                    </option>
                    {faceliftList.map((item) => (
                        <option key={item.id} value={item.id} >
                            {item.name}
                        </option>
                    ))}
                </select>

                <select onChange={onChange} name='bodytype' className="form-select mt-5 mb-5">
                    <option defaultValue>
                        Select bodytype
                    </option>
                    {bodytypeList.map((item) => (
                        <option className='text-capitalize' key={item.id} value={item.id} >
                            {item.name}
                        </option>
                    ))}
                </select>

                <select onChange={onChange} name='market' className="form-select mt-5 mb-5">
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
                    className='form-control'
                    placeholder='Enter years of production'
                    name='years'
                    value={years}
                    onChange={(e) => onChange(e)}
                />
                <div>
                    <p></p>
                </div>
                <input
                    type={'text'}
                    className='form-control'
                    placeholder='Enter description'
                    name='description'
                    value={description}
                    onChange={(e) => onChange(e)}
                />
                <div className='mt-3 mb-3'>
                    <input
                        type="file"
                        className="form-control"
                        name='photo'
                        onChange={handleFileChange}
                    />
                </div>

                <button type='submit' className="btn btn-outline-primary">Submit</button>
                <Link className="btn btn-outline-danger mx-2"
                    to={`/catalog/${make}/${model}/${generation}`}>Cancel</Link>
            </form >
        </div>
    );
}
