import React from "react";

const Statistics = ({ good, neutral, bad, all, average, positive }) => (
    <div>
        <h1>statistics</h1>
        {all === 0 ? (
            <p>No feedback given</p>
        ) : (
            <table>
                <tbody>
                    <tr><td>good</td><td>{good}</td></tr>
                    <tr><td>neutral</td><td>{neutral}</td></tr>
                    <tr><td>bad</td><td>{bad}</td></tr>
                    <tr><td>all</td><td>{all}</td></tr>
                    <tr><td>average</td><td>{average}</td></tr>
                    <tr><td>positive</td><td>{positive} %</td></tr>
                </tbody>
            </table>
        )}
    </div>
);

export default Statistics;