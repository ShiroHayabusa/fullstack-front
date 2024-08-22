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
        <div className='py-4'>
          {
            Object.values(groupedList).map((item, index) => {
              return (
                <ul className='list-group list-group-flush' key={index}>
                  <h3 className='border-bottom'>{item[0].name[0]}</h3>
                  {item.map((item, index) => (
                    <li className='list-group-item' key={index} data={item}>
                      <Link to={`/catalog/${item.name}`}>{item.name}</Link>
                    </li>
                  ))}
                </ul>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}
