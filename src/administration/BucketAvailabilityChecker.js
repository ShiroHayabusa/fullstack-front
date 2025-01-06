import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function BucketAvailabilityChecker() {
  const [availability, setAvailability] = useState('');
  const { user } = useAuth();

  const checkBucketAvailability = async () => {
    try {
      const response = await fetch('http://localhost:8080/check-bucket-availability', {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    });
      const data = await response.json();

      if (response.ok) {
        setAvailability(data.message);
      } else {
        setAvailability('Bucket status not available');
      }
    } catch (error) {
      setAvailability('An error occurred while checking bucket availability');
    }
  };

  return (
    <div className='mt-5'>
      <button onClick={checkBucketAvailability}>Check Bucket Availability</button>
      {availability && <p>{availability}</p>}
    </div>
  );
}

export default BucketAvailabilityChecker;
