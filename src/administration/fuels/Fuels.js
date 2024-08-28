import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';

export default function Fuels() {

    const [fuels, setFuels] = useState([]);

    useEffect(() => {
        loadFuels()
    }, []);

    const loadFuels = async () => {
        const result = await axios.get("http://localhost:8080/administration/fuels");
        setFuels(result.data);
    };

    const deleteFuel = async (id) => {
        await axios.delete(`http://localhost:8080/administration/fuels/${id}`);
        loadFuels();
    }

    return (
        <div>
            <ul class="nav">
                <li class="nav-item">
                    <Link class="nav-link active" aria-current="page" to='/administration/fuels/addFuel'>Add fuel</Link>
                </li>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/">Home</a></li>
                        <li class="breadcrumb-item"><a href='/administration'>Administration</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Fuels</li>
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
                            fuels.map((fuel, index) => (
                                <tr>
                                    <th scope="row" key={index}>{fuel.id}</th>
                                    <td className='text-start'>{fuel.name}</td>
                                    <td>
                                        <Link className='btn btn-outline-primary mx-2'
                                            to={`/administration/fuels/editFuel/${fuel.id}`}
                                        >Edit</Link>
                                        <button className='btn btn-danger mx-2'
                                            onClick={() => deleteFuel(fuel.id)}
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