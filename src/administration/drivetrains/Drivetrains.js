import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Drivetrains() {

    const [drivetrains, setDrivetrains] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        loadDrivetrains()
    }, []);

    const loadDrivetrains = async () => {
        const result = await axios.get("http://localhost:8080/administration/drivetrains", {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });
        setDrivetrains(result.data);
    };

    const deleteDrivetrain = async (id) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this drivetrain? This action cannot be undone.'
        );
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8080/administration/drivetrains/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                alert('Drivetrain deleted successfully');
                window.location.href = '/administration/drivetrains';
                loadDrivetrains();
            } catch (error) {
                console.error('Failed to delete drivetrain:', error);
                alert('An error occurred while deleting the drivetrain.');
            }
        }
    }

    return (
        <div>
            <ul className="nav">
                <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to='/administration/drivetrains/addDrivetrain'>Add drivetrain</Link>
                </li>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item"><a href='/administration' className="text-decoration-none">Administration</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Drivetrains</li>
                    </ol>
                </nav>

                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col" className='text-start'>Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {
                            drivetrains.map((drivetrain, index) => (
                                <tr key={drivetrain.id || index}>
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