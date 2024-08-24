import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import ColumnListMakes from '../components/ColumnListMakes';
import '../components/ColumnContainer.css'

export default function Makes() {

  const [makes, setMakes] = useState([])

  useEffect(() => {
    loadMakes()
  }, []);

  const loadMakes = async () => {
    const result = await axios.get("http://localhost:8080/catalog");
    setMakes(result.data);
  };

  const deleteMake = async (id) => {
    await axios.delete(`http://localhost:8080/make/${id}`);
    loadMakes();
  }

  const groupedList = makes.reduce((acc, obj) => {
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
      <ul class="nav">
        <li class="nav-item">
          <Link class="nav-link active" aria-current="page" to={"/catalog/addMake"}>Add Make</Link>
        </li>
      </ul>
      <div className='container'>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
            <li class="breadcrumb-item active" aria-current="page">Catalog</li>
          </ol>
        </nav>
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
                        <p >
                          {make.name}
                        </p>
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
