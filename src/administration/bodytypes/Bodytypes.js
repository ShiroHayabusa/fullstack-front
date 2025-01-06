import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Bodytypes() {

    const [bodytypes, setBodytypes] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        loadBodytypes()
    }, []);

    const loadBodytypes = async () => {
        const result = await axios.get("http://localhost:8080/administration/bodytypes", {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });
        setBodytypes(result.data);
    };

    const deleteBodytype = async (id) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this body type? This action cannot be undone.'
        );
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8080/administration/bodytypes/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                alert('Body type deleted successfully');
                window.location.href = '/administration/bodytypes';
                loadBodytypes();
            } catch (error) {
                console.error('Failed to delete body type:', error);
                alert('An error occurred while deleting the body type.');
            }
        }
    }

    return (
        <div>
            <ul className="nav">
                <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to='/administration/bodytypes/addBodytype'>Add bodytype</Link>
                </li>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item"><a href='/administration' className="text-decoration-none">Administration</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Bodytypes</li>
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
                            bodytypes.map((bodytype, index) => (
                                <tr key={bodytype.id || index}>
                                    <th scope="row">{bodytype.id}</th>
                                    <td className='text-start'>{bodytype.name}</td>
                                    <td>
                                        <Link className='btn btn-outline-primary mx-2'
                                            to={`/administration/bodytypes/editBodytype/${bodytype.id}`}
                                        >Edit</Link>
                                        <button className='btn btn-danger mx-2'
                                            onClick={() => deleteBodytype(bodytype.id)}
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