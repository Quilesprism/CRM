// src/components/forms/Input.js
import React from "react";

function Input({
  label,
  name,
  type = "text",
  placeholder = "",
  maxLength,
  min,
  max,
  readOnly = false,
  required = false,
  value,
  onChange,
}) {
  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label-separated">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className="form-control-separated"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        min={min}
        max={max}
        readOnly={readOnly}
        required={required}
      />
    </div>
  );
}

export default Input;