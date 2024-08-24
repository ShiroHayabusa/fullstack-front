import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';

export default function Bodytypes() {

    const [bodytypes, setBodytypes] = useState([]);

    useEffect(() => {
        loadBodytypes()
    }, []);

    const loadBodytypes = async () => {
        const result = await axios.get("http://localhost:8080/administration/bodytypes");
        setBodytypes(result.data);
    };

    const deleteBodytype = async (id) => {
        await axios.delete(`http://localhost:8080/administration/bodytypes/${id}`);
        loadBodytypes();
    }

    return (
        <div>
            <ul class="nav">
                <li class="nav-item">
                    <Link class="nav-link active" aria-current="page" to='/administration/bodytypes/addBodytype'>Add bodytype</Link>
                </li>
            </ul>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/">Home</a></li>
                        <li class="breadcrumb-item"><a href='/administration'>Administration</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Bodytypes</li>
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
                            bodytypes.map((bodytype, index) => (
                                <tr>
                                    <th scope="row" key={index}>{bodytype.id}</th>
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