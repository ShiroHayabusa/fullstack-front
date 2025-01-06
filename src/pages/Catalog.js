import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../components/ColumnContainer.css'

export default function Catalog() {

  const [makes, setMakes] = useState([])
  const navigate = useNavigate();
  const { user } = useAuth(); // Получаем пользователя из AuthContext

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      loadMakes();
    }
  }, [user, navigate]);

  const loadMakes = async () => {
    try {
      const result = await axios.get("http://localhost:8080/catalog", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      setMakes(result.data);
    } catch (error) {
      console.error('Error loading makes:', error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        navigate("/login"); // Перенаправляем на страницу логина при ошибке доступа
      }
    }
  };

  const deleteMake = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/make/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`, // Используем токен для авторизации
        },
      });
      loadMakes();
    } catch (error) {
      console.error("Error deleting make:", error);
    }
  };

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
      {/* Кнопка Add Make отображается только для ROLE_ADMIN */}
      {user?.roles.includes("ROLE_ADMIN") && (
        <ul className="nav">
          <li className="nav-item">
            <Link className="nav-link active" aria-current="page" to={"/catalog/addMake"}>Add Make</Link>
          </li>
        </ul>
      )}
      <div className='container'>
        <nav aria-label="breadcrumb" className='mt-3'>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
            <li className="breadcrumb-item active" aria-current="page">Catalog</li>
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
