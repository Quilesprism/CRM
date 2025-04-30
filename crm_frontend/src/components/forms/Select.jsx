// src/components/forms/Select.js
import React from "react";

function Select({ label, name, options = [], value, onChange, required = false }) {
  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label-separated">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      <select
        id={name}
        name={name}
        className="form-control-separated"
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="">Seleccione una opción</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value} disabled={opt.disabled || false}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;