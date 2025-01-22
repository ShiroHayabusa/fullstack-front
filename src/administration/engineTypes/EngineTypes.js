import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function EngineTypes() {

    const [engineTypes, setEngineTypes] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        loadEngineTypes()
    }, []);

    const loadEngineTypes = async () => {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/engineTypes`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });
        setEngineTypes(result.data);
    };

    const deleteEngineType = async (id) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this engine type? This action cannot be undone.'
        );
        if (confirmDelete) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/engineTypes/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                alert('Engine type deleted successfully');
                window.location.href = '/admin/engineTypes';
                loadEngineTypes();
            } catch (error) {
                console.error('Failed to delete engine type:', error);
                alert('An error occurred while deleting the engine type.');
            }
        }
    }

    return (
        <div>
            <ul className="nav">
                <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to='/admin/engineTypes/addEngineType'>Add engine type</Link>
                </li>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item"><a href='/admin' className="text-decoration-none">Administration</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Engine types</li>
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
                            engineTypes.map((engineType, index) => (
                                <tr key={engineType.id || index}>
                                    <th scope="row" key={index}>{engineType.id}</th>
                                    <td className='text-start'>{engineType.name}</td>
                                    <td>
                                        <Link className='btn btn-outline-primary mx-2'
                                            to={`/admin/engineTypes/editEngineType/${engineType.id}`}
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