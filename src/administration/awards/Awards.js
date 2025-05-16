import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Awards() {

    const [awards, setAwards] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        loadAwards()
    }, []);

    const loadAwards = async () => {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/awards`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });
        setAwards(result.data);
    };

    const deleteAward = async (id) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this award? This action cannot be undone.'
        );
        if (confirmDelete) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/awards/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                alert('Award deleted successfully');
                window.location.href = '/admin/awards';
                loadAwards();
            } catch (error) {
                console.error('Failed to delete award:', error);
                alert('An error occurred while deleting the award.');
            }
        }
    }

    return (
        <div>
            <ul className="nav">
                <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to='/admin/awards/addAward'>Add award</Link>
                </li>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item"><a href='/admin' className="text-decoration-none">Administration</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Awards</li>
                    </ol>
                </nav>

                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col" className='text-start'>Name</th>
                            <th scope="col" className='text-start'>Logo</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {
                            awards.map((award, index) => (
                                <tr key={award.id || index}>
                                    <th scope="row">{award.id}</th>
                                    <td className='text-start'>
                                        <Link
                                            to={`/admin/awards/${award.id}`}
                                            className='text-decoration-none'>
                                            {award.name}
                                        </Link>
                                    </td>
                                    <td className='text-start'>
                                        <img
                                            style={{ width: '40px', height: 'auto' }}
                                            src={`https://newloripinbucket.s3.amazonaws.com/image/awards/${award?.logo?.name}`}
                                            className="card-img-top"
                                            alt="...">
                                        </img>
                                    </td>
                                    <td>
                                        <Link className='btn btn-outline-primary mx-2'
                                            to={`/admin/awards/editAward/${award.id}`}
                                        >Edit</Link>
                                        <button className='btn btn-danger mx-2'
                                            onClick={() => deleteAward(award.id)}
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