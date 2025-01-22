import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const Home = () => {

  const { user } = useAuth();
  const [spots, setSpots] = useState([]);
  const [trims, setTrims] = useState([]);

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

  useEffect(() => {
    loadLatestSpots();
    loadLatestTrims();
  }, []);


  return (
    <div className="container mt-5">


      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
        <div className="col-md-9">
          <div className=" pb-1 mb-3 text-black border-bottom border-black text-start">
            <p className="text-start">Welcome to our platform, created by car enthusiasts for car enthusiasts! ! We hope you enjoy your experience on our website.

              It still under development, and many exciting new features are on the way, However, the core functionality is already in place.
              Right now, you can register and start adding your own car spots.

              If you have any questions or need assistance, feel free to contact us at info@loripin.com.
              <br /><br />

              Best regards,<br />
              The Loripin Team.
              <p>Drive the Passion, Spot the Cars!</p>

            </p>
          </div>
        </div>
      </div>
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
      </div>
    </div >
  );
};

export default Home;
