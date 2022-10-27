import React from "react";
import loader from "../assets/loader.svg";

export const Loader = () => {
    return (
        <div style={{ marginTop: '3rem' }}>
            <img src={loader} alt="loader" width='10%' />
        </div>
    );
};
