import React, { useEffect } from "react";
import "./Toast.css";

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timeout = setTimeout(() => onClose(), 2500);
    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div className="toast-container">
      <div className="toast-box">
        {message}
      </div>
    </div>
  );
}
