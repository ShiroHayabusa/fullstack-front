import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';

export default function Markets() {

    const [markets, setMarkets] = useState([]);

    useEffect(() => {
        loadMarkets()
    }, []);

    const loadMarkets = async () => {
        const result = await axios.get("http://localhost:8080/administration/markets");
        setMarkets(result.data);
        console.log("markets:",result.data);
    };

    const deleteMarket = async (id) => {
        await axios.delete(`http://localhost:8080/administration/markets/${id}`);
        loadMarkets();
    }

    return (
        <div>
            <ul class="nav">
                <li class="nav-item">
                    <Link class="nav-link active" aria-current="page" to='/administration/markets/addMarket'>Add Market</Link>
                </li>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/">Home</a></li>
                        <li class="breadcrumb-item"><a href='/administration'>Administration</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Markets</li>
                    </ol>
                </nav>

                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col" className='text-start'>Name</th>
                            <th scope="col" className='text-start'>Country</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        {
                            markets.map((market, index) => (
                                <tr>
                                    <th scope="row" key={index}>{market.id}</th>
                                    <td className='text-start'>{market.name}</td>
                                    <td className='text-start'>{market.country.name}</td>
                                    <td>
                                        <Link className='btn btn-outline-primary mx-2'
                                            to={`/administration/markets/editMarket/${market.id}`}
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