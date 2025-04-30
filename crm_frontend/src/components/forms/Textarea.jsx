// src/components/forms/Textarea.js
import React from "react";

function Textarea({ label, name, value, onChange, rows = 4, required = false }) {
  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label-separated">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      <textarea
        id={name}
        name={name}
        className="form-control-separated"
        rows={rows}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

export default Textarea;