import React, { useState } from 'react';
import '../pages/styles/Home.css';

const initialOrders = [
  { id: 1, dish: 'Entrecôte', table: 3, status: 'Pending' },
  { id: 2, dish: 'Oxfilé', table: 1, status: 'Cooking' },
];

const KitchenView: React.FC = () => {
  const [orders, setOrders] = useState(initialOrders);

  const handleReady = (id: number) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'Ready' } : o));
  };

  return (
    <div className="container">
      <h1>Kitchen View</h1>
      <table style={{ width: '100%', marginTop: 24 }}>
        <thead>
          <tr>
            <th>Order-ID</th>
            <th>Dish</th>
            <th>Table</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.dish}</td>
              <td>{order.table}</td>
              <td>{order.status}</td>
              <td>
                {order.status !== 'Ready' && (
                  <button onClick={() => handleReady(order.id)}>Mark as ready</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KitchenView;