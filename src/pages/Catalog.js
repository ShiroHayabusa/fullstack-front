import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';

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

  return (
    <div>
      <ul class="nav">
        <li class="nav-item">
          <Link class="nav-link active" aria-current="page" to={"/catalog/addMake"}>Add Make</Link>
        </li>
      </ul>
      <div className='container'>
        <div className='py-4'>
        

          {makes.map((make, index) => (
            <ul className="list-group list-group-flush" key={index}>
              <Link className="list-group-item" to={`/catalog/${make.name}`}>{make.name}</Link>
            </ul>
          ))
          }
        </div>
      </div>
    </div>
  )
}
