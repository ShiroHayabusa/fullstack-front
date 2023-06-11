import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function AddBodystyle() {

    let navigate = useNavigate();

    const [values, setValues] = useState([])
    const [values1, setValues1] = useState([])
    const [bodystyle, setBodystyle] = useState({
        name: "",
        facelift: ""
    })

    const { name, facelift } = bodystyle;
    const { make, model, generation } = useParams();


    const onChange = (e) => {
        setBodystyle({ ...bodystyle, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        await axios.post("http://localhost:8080/catalog/" + make + "/" + model + "/" + generation + "/addBodystyle", bodystyle);
        navigate('/catalog/' + make + "/" + model + "/" + generation);
    };

    useEffect(() => {
        fetch("http://localhost:8080/catalog/" + make + "/" + model + "/" + generation + "/bodystyleNameList")
            .then((data) => data.json())
            .then((val) => setValues(val))
    }, [])

    useEffect(() => {
        fetch("http://localhost:8080/catalog/" + make + "/" + model + "/" + generation + "/faceliftList")
            .then((data) => data.json())
            .then((val) => setValues1(val))
    }, [])


    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Add bodystyle</h2>
                    <form onSubmit={(e) => onSubmit(e)}>

                        <select className="form-select mt-5 mb-5" aria-label="Default select example"
                            onChange={(e) => onChange(e)}>
                            {
                                values1.map((opts, key) => <option key={key}>{opts.name}</option>)
                            }
                        </select>

                        <select className="form-select mt-5 mb-5" aria-label="Default select example"
                            onChange={(e) => onChange(e)}>
                            {
                                values.map((opts, key) => <option key={key}>{opts}</option>)
                            }
                        </select>

                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/catalog/${make}/${model}/${generation}`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
