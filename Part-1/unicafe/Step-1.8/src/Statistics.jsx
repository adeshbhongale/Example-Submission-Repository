import React from "react";

const Statistics = ({ good, neutral, bad, all, average, positive }) => (
    <div>
        <h1>statistics</h1>
            <div>
                <p>good {good}</p>
                <p>neutral {neutral}</p>
                <p>bad {bad}</p>
                <p>all {all}</p>
                <p>average {average}</p>
                <p>positive {positive} %</p>
            </div>
    </div>
);

export default Statistics;