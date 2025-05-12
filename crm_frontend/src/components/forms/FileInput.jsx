import React, { useRef } from "react";

function FileInput({ label, name, accept = "image/*", required = false, onChange }) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="form-group file-input-wrapper">
      <label className="form-label-separated">{label}{required && <span className="text-danger"> *</span>}</label>

      <div className="custom-file-input" onClick={handleClick}>
        <span>📁 Seleccionar archivo</span>
      </div>

      <input
        type="file"
        id={name}
        name={name}
        ref={fileInputRef}
        className="hidden-file-input"
        accept={accept}
        required={required}
        onChange={onChange}
      />
    </div>
  );
}

export default FileInput;
