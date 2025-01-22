import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Countries() {

    const [countries, setCountries] = useState([]);
    const { user } = useAuth(); 

    useEffect(() => {
        loadCountries()
    }, []);

    const loadCountries = async () => {
        const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/countries`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });
        setCountries(result.data);
    };

    const deleteCountry = async (id) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this country? This action cannot be undone.'
        );
        if (confirmDelete) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/countries/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                alert('Country deleted successfully');
                window.location.href = '/admin/countries';
                loadCountries();
            } catch (error) {
                console.error('Failed to delete country:', error);
                alert('An error occurred while deleting the country.');
            }
        }
    }

    return (
        <div>
            <ul className="nav">
                <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to='/admin/countries/addCountry'>Add Country</Link>
                </li>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li className="breadcrumb-item"><a href="/admin" className="text-decoration-none">Administration</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Countries</li>
                    </ol>
                </nav>

                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col" className='text-start'>Name</th>
                            <th scope="col" className='text-start'>Flag</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {
                            countries.map((country, index) => (
                                <tr key={country.id || index}>
                                    <th scope="row">{country.id}</th>
                                    <td className='text-start'>{country.name}</td>
                                    <td className='text-start'>
                                        <img
                                            style={{ width: '40px', height: 'auto' }}
                                            src={`https://newloripinbucket.s3.amazonaws.com/image/countries/${country.name || 'defaultMake'}/${country?.flag?.name || 'defaultImage.jpg'}`}
                                            className="card-img-top"
                                            alt="...">
                                        </img>
                                    </td>
                                    <td>
                                        <Link className='btn btn-outline-primary mx-2'
                                            to={`/admin/countries/editCountry/${country.id}`}
                                        >Edit</Link>
                                        <button className='btn btn-danger mx-2'
                                            onClick={() => deleteCountry(country.id)}
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