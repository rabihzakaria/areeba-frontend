import React, { useEffect, useState } from 'react';
import './customerPage.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/css/solid.css';
import { useHistory } from "react-router-dom";

const CustomerPage = () => {
    const history = useHistory();
    const handleAddClick = () => {
        history.push(`/edit?mode=add`);
    };
    const handleEditClick = (customerId) => {
        history.push(`/edit?mode=edit&id=${customerId}`);
    };
    const handleDeleteRow = (customerId) => {
        //TODO add a message on GUI if the delete was successful
        fetch(`http://localhost:8081/customers/delete/${customerId}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Row deleted successfully');
                    // Update the state by removing the deleted row
                    setCustomers((prevCustomers) => prevCustomers.filter(row => row.id !== customerId));
                } else {
                    throw new Error('Failed to delete row');
                }
            })
            .catch((error) => {
                console.error('Error deleting row:', error);
            });
    };



    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        // Fetch data from backend api
        // TODO parametrize the URL
        fetch('http://localhost:8081/customers/all')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Data from API:', data);
                setCustomers(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setError('Error fetching data. Please try again.');
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <button className="btn-danger" onClick={handleAddClick}>Add Customer</button>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Operator</th>
                    <th>Country code</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {customers.map((row) => (
                    <tr key={row.id}>
                        <td>{row.id}</td>
                        <td>{row.name}</td>
                        <td>{row.lastName}</td>
                        <td>{row.email}</td>
                        <td>{row.phoneNumber}</td>
                        <td>{row.operator}</td>
                        <td>{row.countryCode}</td>
                        <td>
                                <span className="icon-container">
                                    <i className="fa fa-edit" aria-hidden="true" onClick={() => handleEditClick(row.id)}></i>
                                    <i className="fa fa-trash" aria-hidden="true" onClick={() => handleDeleteRow(row.id)}></i>
                                </span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default CustomerPage;
