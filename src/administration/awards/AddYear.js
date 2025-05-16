import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { useAuth } from '../../context/AuthContext';

export default function AddAwardYear() {

    let navigate = useNavigate();

    const [year, setYear] = useState({
        year: null,
    });

    const [generations, setGenerations] = useState([]);
    const [selectedGeneration, setSelectedGeneration] = useState(null);
    const { award } = useParams();

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { user } = useAuth();

    const onInputChange = (e) => {
        setYear({ ...year, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (selectedOption) => {
        setSelectedGeneration(selectedOption);
    };

    useEffect(() => {
        const fetchGenerations = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/generations`);
                const formatted = res.data.map(g => ({
                    label: g.make.name + ' ' + g.model.name + ' ' + g.name + ' (' + g.years + ')',
                    value: g.id
                }));
                setGenerations(formatted);
            } catch (err) {
                console.error("Error loading generations", err);
            }
        };
        fetchGenerations();
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!year || !selectedGeneration) {
            setError('Please provide both year and generation');
            return;
        }
        try {
            const payload = {
                year: parseInt(year.year),
                generationId: selectedGeneration.value
            };
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/awards/${award}/addYear`, payload, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (response.status === 200 || response.status === 201) {
                setSuccess('Award added successfully');
                setError('');
                setYear({ year: null });
                setSelectedGeneration(null);
                navigate('/admin/awards/' + award);
            }
        } catch (error) {
            console.error('Error adding year: ', error.message);
            setError('Something went wrong');
        }
    };

    return (
        <div className='container'>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb mt-3">
                    <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                    <li className="breadcrumb-item"><a href='/admin' className="text-decoration-none">Administration</a></li>
                    <li className="breadcrumb-item"><a href='/admin/awards' className="text-decoration-none">Awards</a></li>
                    <li className="breadcrumb-item"><a href={`/admin/awards/${award}`} className="text-decoration-none">Award</a></li>
                    <li className="breadcrumb-item active" aria-current="page">Add year</li>
                </ol>
            </nav>
            <div className='row'>
                <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                    <h2 className='text-center m-4'>Add year</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className='mb-3'>
                            <input
                                type={'text'}
                                className='form-control mb-3'
                                placeholder='Enter year'
                                name='year'
                                value={year.year}
                                onChange={(e) => onInputChange(e)}
                            />
                            <Select
                                options={generations}
                                value={selectedGeneration}
                                onChange={handleSelectChange}
                                placeholder="Select generation"
                            />

                        </div>
                        <button type='submit' className="btn btn-outline-primary">Submit</button>
                        <Link className="btn btn-outline-danger mx-2" to={`/admin/awards/${award}`}>Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
