import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';

export default function Transmissions() {

    const [transmissions, setTransmissions] = useState([]);

    useEffect(() => {
        loadTransmissions()
    }, []);

    const loadTransmissions = async () => {
        const result = await axios.get("http://localhost:8080/administration/transmissions");
        setTransmissions(result.data);
    };

    const deleteTransmission = async (id) => {
        await axios.delete(`http://localhost:8080/administration/transmissions/${id}`);
        loadTransmissions();
    }

    return (
        <div>
            <ul class="nav">
                <li class="nav-item">
                    <Link class="nav-link active" aria-current="page" to='/administration/transmissions/addTransmission'>Add Transmission</Link>
                </li>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/">Home</a></li>
                        <li class="breadcrumb-item"><a href='/administration'>Administration</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Transmissions</li>
                    </ol>
                </nav>

                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col" className='text-start'>Name</th>
                            <th scope="col" className='text-start'>Photo</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        {
                            transmissions.map((transmission, index) => (
                                <tr>
                                    <th scope="row" key={index}>{transmission.id}</th>
                                    <td className='text-start'>{transmission.name}</td>
                                    <td className='text-start'>
                                        <img
                                            style={{ width: '40px', height: 'auto' }}
                                            src={`https://newloripinbucket.s3.amazonaws.com/image/${transmission.name || 'defaultTransmission'}/${transmission?.photo?.name || 'defaultImage.jpg'}`}
                                            className="card-img-top"
                                            alt="...">
                                        </img>
                                    </td>
                                    <td>
                                        <Link className='btn btn-outline-primary mx-2'
                                            to={`/administration/transmissions/editTransmission/${transmission.id}`}
                                        >Edit</Link>
                                        <button className='btn btn-danger mx-2'
                                            onClick={() => deleteTransmission(transmission.id)}
                                        >Delete</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}