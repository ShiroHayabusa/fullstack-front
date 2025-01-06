import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function TransmissionTypes() {

    const [transmissionTypes, setTransmissionTypes] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        loadTransmissionTypes()
    }, []);

    const loadTransmissionTypes = async () => {
        const result = await axios.get("http://localhost:8080/administration/transmissionTypes", {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });
        setTransmissionTypes(result.data);
    };

    const deleteTransmissionType = async (id) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this transmission type? This action cannot be undone.'
        );
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8080/administration/transmissionTypes/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                alert('Transmission type deleted successfully');
                window.location.href = '/administration/transmissionTypes';
                loadTransmissionTypes();
            } catch (error) {
                console.error('Failed to delete transmission type:', error);
                alert('An error occurred while deleting the transmission type.');
            }
        }
    }


    return (
        <div>
            <ul className="nav">
                <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to='/administration/transmissionTypes/addTransmissionType'>Add transmission type</Link>
                </li>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item"><a href='/administration' className="text-decoration-none">Administration</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Transmission types</li>
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
                            transmissionTypes.map((transmissionType, index) => (
                                <tr key={transmissionType.id || index}>
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