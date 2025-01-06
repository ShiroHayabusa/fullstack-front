import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>403 - Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
      <div>
        <Link to="/" style={{ marginRight: "15px" }} className="btn btn-primary">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
