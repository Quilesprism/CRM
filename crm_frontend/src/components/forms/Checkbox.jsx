import React from "react";

function Checkbox({ label, name, value, checked, onChange }) {
  return (
    <div className="form-check form-check-inline">
      <input
        className="form-check-input"
        type="checkbox"
        id={`${name}-${value}`}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <label className="form-check-label" htmlFor={`${name}-${value}`}>
        {label}
      </label>
    </div>
  );
}
//create a checklist for aditional services
export default Checkbox;