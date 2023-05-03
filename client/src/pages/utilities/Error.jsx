import React from "react";

export const ErrorBox = (props) => {
    return (
        <div className="error-box">{props.error}</div>
    );
}