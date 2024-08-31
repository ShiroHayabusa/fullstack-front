import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';

export default function TransmissionTypes() {

    const [transmissionTypes, setTransmissionTypes] = useState([]);

    useEffect(() => {
        loadTransmissionTypes()
    }, []);

    const loadTransmissionTypes = async () => {
        const result = await axios.get("http://localhost:8080/administration/transmissionTypes");
        setTransmissionTypes(result.data);
    };

    const deleteTransmissionType = async (id) => {
        await axios.delete(`http://localhost:8080/administration/transmissionTypes/${id}`);
        loadTransmissionTypes();
    }

    return (
        <div>
            <ul class="nav">
                <li class="nav-item">
                    <Link class="nav-link active" aria-current="page" to='/administration/transmissionTypes/addTransmissionType'>Add transmission type</Link>
                </li>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/">Home</a></li>
                        <li class="breadcrumb-item"><a href='/administration'>Administration</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Transmission types</li>
                    </ol>
                </nav>

                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col" className='text-start'>Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        {
                            transmissionTypes.map((transmissionType, index) => (
                                <tr>
                                    <th scope="row" key={index}>{transmissionType.id}</th>
                                    <td className='text-start'>{transmissionType.name}</td>
                                    <td>
                                        <Link className='btn btn-outline-primary mx-2'
                                            to={`/administration/transmissionTypes/editTransmissionType/${transmissionType.id}`}
                                        >Edit</Link>
                                        <button className='btn btn-danger mx-2'
                                            onClick={() => deleteTransmissionType(transmissionType.id)}
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