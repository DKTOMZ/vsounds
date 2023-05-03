import React from "react";

export const NotFound = () => {
    return (
        <div className="not-found">
            <h1><span><i className="fa-solid fa-triangle-exclamation fa-lg"></i></span>There's nothing here: 404!</h1>
            <h5>This path is does not exist</h5>
        </div>
    );
}