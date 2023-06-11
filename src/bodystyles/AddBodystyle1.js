import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function AddBodystyle() {

    let navigate = useNavigate();

    const [bodystyle, setBodystyle] = useState({
        facelift: "",
        name:""
    })

    const { facelift, name } = bodystyle;
    const { make, model, generation } = useParams();

    const onSubmit = async (e) => {
        e.preventDefault();
        await axios.post("http://localhost:8080/catalog/" + make + "/" + model + "/" + generation + "/addBodystyle", bodystyle)
        .then((response)=>{}).catch(({response})=>{console.log(response.data);
        console.log(response.status);
    console.log(response.headers);});
        navigate('/catalog/' + make + "/" + model + "/" + generation);
    };


    const [select1, setSelected1] = useState('');
    const [select2, setSelected2] = useState('');
    const [faceliftList, setFaceliftList] = useState([]);
    const [bsnameList, setBsnameList] = useState([]);
    
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

    useEffect(() => {
        fetchFaceliftData();
        fetchBsnameData();
    }, [])


    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Add bodystyle</h2>
                    <form onSubmit={(e) => onSubmit(e)}>
                        
                        <select className="form-select mt-5 mb-5"
                            disabled={false}
                            value={select1}
                            onChange={(e) => setSelected1(e.currentTarget.value)}
                        >
                            {faceliftList.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>

                        <select className="form-select mt-5 mb-5"
                            disabled={false}
                            value={select2}
                            
                            onChange={(e) => setSelected2(e.currentTarget.value)}
                        >
                            {bsnameList.map((item) => (
                                <option key={item.id} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/catalog/${make}/${model}/${generation}`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
