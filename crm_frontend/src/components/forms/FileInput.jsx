
import React from "react";

function FileInput({ label, name, accept = "image/*", required = false, onChange }) {
  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label-separated">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      <input
        type="file"
        id={name}
        name={name}
        className="form-control-separated"
        accept={accept}
        required={required}
        onChange={onChange}
      />
    </div>
  );
}

export default FileInput;