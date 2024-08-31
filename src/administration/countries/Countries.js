import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';

export default function Countries() {

    const [countries, setCountries] = useState([]);

    useEffect(() => {
        loadCountries()
    }, []);

    const loadCountries = async () => {
        const result = await axios.get("http://localhost:8080/administration/countries");
        setCountries(result.data);
    };

    const deleteCountry = async (id) => {
        await axios.delete(`http://localhost:8080/administration/countries/${id}`);
        loadCountries();
    }

    return (
        <div>
            <ul class="nav">
                <li class="nav-item">
                    <Link class="nav-link active" aria-current="page" to='/administration/countries/addCountry'>Add Country</Link>
                </li>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li class="breadcrumb-item"><a href="/administration" className="text-decoration-none">Administration</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Countries</li>
                    </ol>
                </nav>

                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col" className='text-start'>Name</th>
                            <th scope="col" className='text-start'>Flag</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        {
                            countries.map((country, index) => (
                                <tr>
                                    <th scope="row" key={index}>{country.id}</th>
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
                                            to={`/administration/countries/editCountry/${country.id}`}
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