import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Fuels() {

    const [fuels, setFuels] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        loadFuels()
    }, []);

    const loadFuels = async () => {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/fuels`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });
        setFuels(result.data);
    };

    const deleteFuel = async (id) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this fuel? This action cannot be undone.'
        );
        if (confirmDelete) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/fuels/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                alert('Fuel deleted successfully');
                window.location.href = '/admin/fuels';
                loadFuels();
            } catch (error) {
                console.error('Failed to delete fuel:', error);
                alert('An error occurred while deleting the fuel.');
            }
        }
    }

    return (
        <div>
            <ul className="nav">
                <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to='/admin/fuels/addFuel'>Add fuel</Link>
                </li>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item"><a href='/admin' className="text-decoration-none">Administration</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Fuels</li>
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
                            fuels.map((fuel, index) => (
                                <tr key={fuel.id || index}>
                                    <th scope="row">{fuel.id}</th>
                                    <td className='text-start'>{fuel.name}</td>
                                    <td>
                                        <Link className='btn btn-outline-primary mx-2'
                                            to={`/admin/fuels/editFuel/${fuel.id}`}
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