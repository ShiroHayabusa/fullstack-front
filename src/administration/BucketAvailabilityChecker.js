import React, { useState } from 'react';

function BucketAvailabilityChecker() {
  const [availability, setAvailability] = useState('');

  const checkBucketAvailability = async () => {
    try {
      const response = await fetch('http://localhost:8080/check-bucket-availability');
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
    <div>
      <button onClick={checkBucketAvailability}>Check Bucket Availability</button>
      {availability && <p>{availability}</p>}
    </div>
  );
}

export default BucketAvailabilityChecker;
