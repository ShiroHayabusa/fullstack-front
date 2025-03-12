import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import Masonry from 'react-masonry-css';

const Home = () => {

  const { user } = useAuth();
  const [spots, setSpots] = useState([]);
  const [trims, setTrims] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  const breakpointColumnsObj = {
    default: 2,
    1100: 2,
    700: 1,
    500: 1
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
        <div className="col-md-9">
          <h5 className="text-start">Latest spots:</h5>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {spots.map((spot) => (
              <Link to={`/spots/${spot.id}`} key={spot.id}>
                <figure className="figure">
                  <img
                    src={`https://newloripinbucket.s3.amazonaws.com/image/spots/${spot.user?.username}/${spot.id}/${spot.photos?.find(photo => photo.isMain)?.name}`}
                    alt={spot.photos?.find(photo => photo.isMain).name}
                    className="figure-img img-fluid"
                  />
                  <figcaption className="figure-caption text-start">Added by {spot.user.username} {formatDistanceToNow(new Date(spot.createdAt)).replace('about ', '')} ago</figcaption>
                </figure>
              </Link>
            ))}
          </Masonry>
          <Link to={`/spots`} className="text-decoration-none ms-2">
            More spots...
          </Link>
        </div>

        <div className="col-md-3 border-start text-start">
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
