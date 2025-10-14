import React from 'react';

const Buttoon = ({ onClick, text }) => (
    <button onClick={onClick}>
        {text}
    </button>
);

export default Buttoon;