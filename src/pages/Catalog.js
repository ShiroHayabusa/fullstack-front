import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../components/ColumnContainer.css'

export default function Catalog() {

  const [makes, setMakes] = useState([]);
  const [filteredMakes, setFilteredMakes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    loadMakes();
  }, []);

  const loadMakes = async () => {
    try {
      const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog`)
      setMakes(result.data);
      setFilteredMakes(result.data);
    } catch (error) {
      console.error('Error loading makes:', error);
    }
  };

  const deleteMake = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this make?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/deleteMake/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      loadMakes();
    } catch (error) {
      console.error("Error deleting make:", error);
    }
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = makes.filter(make =>
      make.name.toLowerCase().includes(query)
    );

    setFilteredMakes(filtered);
  };

  const groupedList = filteredMakes.reduce((acc, obj) => {
    const firstLetter = obj.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(obj);
    return acc;
  }, {});

  const sortedKeys = Object.keys(groupedList).sort();

  return (
    <div>
      {user?.roles.includes("ROLE_ADMIN") && (
        <ul className="nav">
          <li className="nav-item">
            <Link className="nav-link active" aria-current="page" to={"/catalog/addMake"}>Add Make</Link>
          </li>
        </ul>
      )}
      <div className='container'>
        <div className="pb-1 mb-3 mt-1 text-black border-bottom d-flex justify-content-between align-items-center">
          <nav aria-label="breadcrumb" className='mt-3'>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
              <li className="breadcrumb-item active" aria-current="page">Catalog</li>
            </ol>
          </nav>
          <div>
            <input
              type="text"
              className="form-control"
              placeholder="Search Makes"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <h2>Catalog</h2>

        <div className='py-4'>
          <div className="column-container">
            {sortedKeys.map((letter) => (
              <div key={letter} className="column-group">
                <h4>{letter}</h4>
                <ul className="list-group">
                  {groupedList[letter].map((make) => (
                    <li className="list-group-item border-0" key={make.id}>
                      <a href={`/catalog/${make.name}`} className="text-decoration-none">
                        <p>{make.name} {make.spotsCount > 0 && ` (${make.spotsCount})`}</p>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
