import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Markets() {

    const [markets, setMarkets] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        loadMarkets()
    }, []);

    const loadMarkets = async () => {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/markets`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });
        setMarkets(result.data);
    };

    const deleteMarket = async (id) => {
            const confirmDelete = window.confirm(
                'Are you sure you want to delete this market? This action cannot be undone.'
            );
            if (confirmDelete) {
                try {
                    await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/markets/${id}`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    });
                    alert('Market deleted successfully');
                    window.location.href = '/admin/markets';
                    loadMarkets();
                } catch (error) {
                    console.error('Failed to delete market:', error);
                    alert('An error occurred while deleting the market.');
                }
            }
        }

    return (
        <div>
            <ul className="nav">
                <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to='/admin/markets/addMarket'>Add Market</Link>
                </li>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item"><a href='/admin' className="text-decoration-none">Administration</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Markets</li>
                    </ol>
                </nav>

                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col" className='text-start'>Name</th>
                            <th scope="col" className='text-start'>Country</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {
                            markets.map((market, index) => (
                                <tr key={market.id || index}>
                                    <th scope="row">{market.id}</th>
                                    <td className='text-start'>{market.name}</td>
                                    <td className='text-start'>{market.country.name}</td>
                                    <td>
                                        <Link className='btn btn-outline-primary mx-2'
                                            to={`/admin/markets/editMarket/${market.id}`}
                                        >Edit</Link>
                                        <button className='btn btn-danger mx-2'
                                            onClick={() => deleteMarket(market.id)}
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