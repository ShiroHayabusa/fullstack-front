import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';

export default function Drivetrains() {

    const [drivetrains, setDrivetrains] = useState([]);

    useEffect(() => {
        loadDrivetrains()
    }, []);

    const loadDrivetrains = async () => {
        const result = await axios.get("http://localhost:8080/administration/drivetrains");
        setDrivetrains(result.data);
    };

    const deleteDrivetrain = async (id) => {
        await axios.delete(`http://localhost:8080/administration/drivetrains/${id}`);
        loadDrivetrains();
    }

    return (
        <div>
            <ul class="nav">
                <li class="nav-item">
                    <Link class="nav-link active" aria-current="page" to='/administration/drivetrains/addDrivetrain'>Add drivetrain</Link>
                </li>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/">Home</a></li>
                        <li class="breadcrumb-item"><a href='/administration'>Administration</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Drivetrains</li>
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
                            drivetrains.map((drivetrain, index) => (
                                <tr>
                                    <th scope="row" key={index}>{drivetrain.id}</th>
                                    <td className='text-start'>{drivetrain.name}</td>
                                    <td>
                                        <Link className='btn btn-outline-primary mx-2'
                                            to={`/administration/drivetrains/editDrivetrain/${drivetrain.id}`}
                                        >Edit</Link>
                                        <button className='btn btn-danger mx-2'
                                            onClick={() => deleteDrivetrain(drivetrain.id)}
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