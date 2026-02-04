import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../pages/styles/Home.css';


export default function DeprecatedPersonal() {
  const { user } = useContext(AuthContext);

  if (!user || (user.role !== 'BRANCH_MANAGER' && user.role !== 'GENERAL_MANAGER')) {
    // Not allowed: show nothing or a message
    return (
      <div className="container">
        <h1>Personal</h1>
        <div>Du har inte behörighet att visa denna sida.</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Personal</h1>
      <div>Den här sidan har flyttats. Gå till <b>Personal</b> via menyn.</div>
    </div>
  );
}