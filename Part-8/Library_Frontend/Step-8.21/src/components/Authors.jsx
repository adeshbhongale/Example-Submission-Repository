import React from 'react';
import { useQuery } from '@apollo/client';
import { ALL_AUTHORS } from '../queries';

const Authors = ({ show }) => {
  const { loading, error, data } = useQuery(ALL_AUTHORS);

  if (!show) return null;
  if (loading) return <p>Loading authors...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Authors</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th>Name</th>
            <th>Born</th>
          </tr>
        </thead>
        <tbody>
          {data.allAuthors.map(a => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Authors;
