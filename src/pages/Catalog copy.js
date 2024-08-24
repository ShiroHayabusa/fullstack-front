import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import ColumnListMakes from '../components/ColumnListMakes';

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
    const k = obj.name.charAt(0).toUpperCase();
    acc[k] = acc[k] || [];
    acc[k].push(obj);
    return acc;
  }, {})

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
            <li class="breadcrumb-item"><a href="/">Home</a></li>
            <li class="breadcrumb-item active" aria-current="page">Catalog</li>
          </ol>
        </nav>
        <h2>Catalog</h2>
        <div className='py-4'>
          <ColumnListMakes groupedItems={groupedList} itemsPerColumn={6} />
        </div>
      </div>
    </div>
  )
}
