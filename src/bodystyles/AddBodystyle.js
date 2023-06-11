import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function AddBodystyle() {

    let navigate = useNavigate();
    const { make, model, generation } = useParams();
    const [bsnameList, setBsnameList] = useState([]);
    const [faceliftList, setFaceliftList] = useState([]);
    const [bodystyle, setBodystyle] = useState({
        facelift: "",
        name: ""
    })

    const onChange = (e) => {
        setBodystyle({ ...bodystyle, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        await axios.post("http://localhost:8080/catalog/" + make + "/"
            + model + "/" + generation + "/addBodystyle", bodystyle);
        navigate('/catalog/' + make + "/" + model + "/" + generation);
    };

    const fetchBsnameData = () => {
        axios
            .get('http://localhost:8080/catalog/' + make + "/" + model + "/" + generation + '/bodystyleNameList')
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    //check the api call is success by stats code 200,201 ...etc
                    setBsnameList(data)
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

    useEffect(() => {
        fetchBsnameData();
        fetchFaceliftData();
    }, [])

    return (
        <div className='container'>
            <form onSubmit={(e) => onSubmit(e)}>
                <h2 className="mb-3">Add bodystyle</h2>

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

                <select onChange={onChange} name='name' className="form-select mt-5 mb-5">
                    <option defaultValue>
                        Select bodystyle
                    </option>
                    {bsnameList.map((item) => (
                        <option key={item.id} value={item} >
                            {item}
                        </option>
                    ))}
                </select>
                <button type='submit' className="btn btn-outline-primary">Submit</button>
                <Link className="btn btn-outline-danger mx-2"
                    to={`/catalog/${make}/${model}/${generation}`}>Cancel</Link>
            </form >
        </div>
    );
}
