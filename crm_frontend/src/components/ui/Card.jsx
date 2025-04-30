// src/components/ui/Card.js
import React from "react";

function Card({ title, children }) {
  return (
    <div className="card mb-3">
      <div className="card-header">
        <h6 className="card-title m-0">
          {title} <strong className="text-danger">*</strong>
        </h6>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}

export default Card;