import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const Home = () => {

  const { user } = useAuth();
  const [spots, setSpots] = useState([]);
  const [trims, setTrims] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  const breakpointColumnsObj = {
    default: 5,
    1100: 4,
    700: 3,
    500: 2
  };

  const loadLatestSpots = async () => {
    try {
      const headers = user?.token
        ? { Authorization: `Bearer ${user.token}` }
        : {};
      const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/spots/latest`, {
        headers,
      });
      setSpots(result.data);
      console.log("Spot data:", spots);
    } catch (error) {
      console.error("Failed to fetch spots", error);
    }
  };

  const loadLatestTrims = async () => {
    try {
      const headers = user?.token
        ? { Authorization: `Bearer ${user.token}` }
        : {};
      const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/catalog/latest`, {
        headers,
      });
      setTrims(result.data);
      console.log("Trim data:", trims);
    } catch (error) {
      console.error("Failed to fetch trims", error);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const result = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/leaderboard`);
      setLeaderboard(result.data);
    } catch (error) {
      console.error("Failed to fetch leaderboard", error);
    }
  };

  useEffect(() => {
    loadLatestSpots();
    loadLatestTrims();
    loadLeaderboard();
  }, []);


  return (
    <div className="container mt-5">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
        <div className="col-md-4 me-5 mb-3 border-end">
          <h5 className="text-start">Latest spots:</h5>
          {spots.map((spot) => (
            <Link to={`/spots/${spot.id}`} key={spot.id}>
              <figure class="figure">
                <img
                  src={`https://newloripinbucket.s3.amazonaws.com/image/spots/${spot.user?.username}/${spot.id}/${spot.photos?.find(photo => photo.isMain)?.name}`}
                  alt={spot.photos?.find(photo => photo.isMain).name}
                  className="figure-img img-fluid mb-2"
                />
                <figcaption class="figure-caption text-start">Added by {spot.user.username} {formatDistanceToNow(new Date(spot.createdAt)).replace('about ', '')} ago</figcaption>
              </figure>
            </Link>
          ))}
        </div>
        <div className="col-md-4 border-start text-start mb-3">
          <h5 className="text-start">Latest in catalog:</h5>
          {trims.map((trim) => (
            <Link to={`/catalog/${trim?.make}/${trim?.model}/${trim?.generation}/${trim?.bodystyle}/${trim?.id}`} key={trim.id}>
              <figure class="figure">
                <img
                  src={`https://newloripinbucket.s3.amazonaws.com/image/catalog/${trim.make}/${trim?.model}/${trim?.generationName}/${trim?.faceliftName}/${trim?.bodytypeName}/${trim.name}/${trim?.photos?.find(photo => photo.isMain)?.name}`}
                  alt={trim.photos?.find(photo => photo.isMain)?.name}
                  className="figure-img img-fluid mb-2"
                />
                <figcaption class="figure-caption text-start">{trim.make} {trim.model} {trim.name}</figcaption>
              </figure>
            </Link>
          ))}
        </div>
        <div className="col-md-3 border-start text-start mb-3">
          <h5 className="text-start">🏆 Leaderboard</h5>
          <ul className="list-group list-group-flush">
            {leaderboard.map((user, index) => (
              <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  {index + 1}.
                  <Link to={`/users/${user.id}`} className="text-decoration-none ms-2">
                    {user.username}
                  </Link>
                </div>
                <span>{user.rating} pts</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div >
  );
};

export default Home;
