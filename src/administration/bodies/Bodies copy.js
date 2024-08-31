import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';

export default function Bodies() {

    const [bodies, setBodies] = useState([]);

    useEffect(() => {
        loadBodies()
    }, []);

    const loadBodies = async () => {
        const result = await axios.get("http://localhost:8080/administration/bodies");
        setBodies(result.data);
    };

    const deleteBody = async (id) => {
        await axios.delete(`http://localhost:8080/administration/bodies/${id}`);
        loadBodies();
    }

    return (
        <div>
            <ul class="nav">
                <li class="nav-item">
                    <Link class="nav-link active" aria-current="page" to='/administration/bodies/addBody'>Add Body</Link>
                </li>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                        <li class="breadcrumb-item"><a href='/administration' className="text-decoration-none">Administration</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Bodies</li>
                    </ol>
                </nav>

                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col" className='text-start'>Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        {
                            bodies.map((body, index) => (
                                <tr>
                                    <th scope="row" key={index}>{body.id}</th>
                                    <td className='text-start'>{body.name}</td>
                                    <td>
                                        <Link className='btn btn-outline-primary mx-2'
                                            to={`/administration/bodies/editBody/${body.id}`}
                                        >Edit</Link>
                                        <button className='btn btn-danger mx-2'
                                            onClick={() => deleteBody(body.id)}
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