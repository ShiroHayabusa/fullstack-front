import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function EditDrivetrain() {

    const { id } = useParams(); // Assuming the drivetrain ID is passed as a route parameter
    let navigate = useNavigate();

    const [drivetrain, setDrivetrain] = useState({
        name: ""
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        // Fetch the current details of the drivetrain
        const fetchDrivetrain = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/administration/drivetrains/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setDrivetrain({
                    name: response.data.name
                });
                console.log("drivetrain:", response.data)
            } catch (error) {
                setError('Error fetching drivetrain details: ' + error.message);
            }
        };

        fetchDrivetrain();
    }, [id]);

    const onInputChange = (e) => {
        setDrivetrain({ ...drivetrain, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!drivetrain.name) {
            setError('Please provide a drivetrain name.');
            return;
        }

        const formData = new FormData();
        formData.append('name', drivetrain.name);

        try {
            const response = await axios.put(`http://localhost:8080/administration/drivetrains/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (response.status === 200) {
                setSuccess('Drivetrain updated successfully');
                setError('');
                navigate('/administration/drivetrains');
            }
        } catch (error) {
            setError('Error updating drivetrain: ' + error.message);
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb mt-3">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item"><a href='/administration' className="text-decoration-none">Administration</a></li>
                    <li className="breadcrumb-item"><a href='/administration/drivetrains' className="text-decoration-none">Drivetrains</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Edit drivetrain</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Edit drivetrain</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={onSubmit}>
                        <div className='mb-3'>
                            <label htmlFor='Name' className='form-label'>Drivetrain</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Enter drivetrain name'
                                name='name'
                                value={drivetrain.name}
                                onChange={onInputChange}
                            />
                        </div>
                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/administration/drivetrains`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
