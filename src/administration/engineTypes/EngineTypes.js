import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';

export default function EngineTypes() {

    const [engineTypes, setEngineTypes] = useState([]);

    useEffect(() => {
        loadEngineTypes()
    }, []);

    const loadEngineTypes = async () => {
        const result = await axios.get("http://localhost:8080/administration/engineTypes");
        setEngineTypes(result.data);
    };

    const deleteEngineType = async (id) => {
        await axios.delete(`http://localhost:8080/administration/engineTypes/${id}`);
        loadEngineTypes();
    }

    return (
        <div>
            <ul class="nav">
                <li class="nav-item">
                    <Link class="nav-link active" aria-current="page" to='/administration/engineTypes/addEngineType'>Add engine type</Link>
                </li>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/">Home</a></li>
                        <li class="breadcrumb-item"><a href='/administration'>Administration</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Engine types</li>
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
                            engineTypes.map((engineType, index) => (
                                <tr>
                                    <th scope="row" key={index}>{engineType.id}</th>
                                    <td className='text-start'>{engineType.name}</td>
                                    <td>
                                        <Link className='btn btn-outline-primary mx-2'
                                            to={`/administration/engineTypes/editEngineType/${engineType.id}`}
                                        >Edit</Link>
                                        <button className='btn btn-danger mx-2'
                                            onClick={() => deleteEngineType(engineType.id)}
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