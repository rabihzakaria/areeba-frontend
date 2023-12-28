import React, { useState, useEffect } from 'react';
import './addCustomer.css';
import {useHistory, useLocation} from 'react-router-dom';


const AddCustomer = () => {
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get('mode');
  const customerId = searchParams.get('id');
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(null);

  const [customerData, setCustomerData] = useState({
    name: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    operator: '',
    countryCode: '',
  });

  useEffect(() => {
    // Check if customerId is provided (indicating edit mode)
    if (customerId) {
      // Fetch customer data based on customerId and update the form fields
      fetch(`http://localhost:8081/customers/${customerId}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            // Update form fields with fetched data
            setCustomerData({
              name: data.name,
              lastName: data.lastName,
              email: data.email,
              phoneNumber: data.phoneNumber,
              operator: data.operator,
              countryCode: data.countryCode,
            });
          })
          .catch((error) => {
            console.error('Error fetching customer data:', error);
          });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleCheckPhoneNumberValidity  =  () => {

      const response =  fetch(`http://localhost:8085/validate/${customerData.phoneNumber}`)
         .then((response) => response.json())
        .then((data) => {
          setIsPhoneNumberValid(data != null);
        })
        .catch((error) => {
          setIsPhoneNumberValid(false)
          console.error('Error checking phone number validity:', error);
        });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Handle form submission based on mode (add or edit)
    if (mode === 'add') {
      fetch('http://localhost:8081/customers/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      })
          .then((response) => {
            if (response.ok) {
              console.log('Customer added successfully');
              history.push('/');
            } else {
              throw new Error('Failed to add customer');
            }
          })
          .catch((error) => {
            console.error('Error adding customer:', error);
          });

    } else {
      console.log('Editing customer:', customerData);
      fetch('http://localhost:8081/customers/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      })
          .then((response) => {
            if (response.ok) {
              console.log('Customer editing successfully');
              //TODO Update the existing row in the state

              history.push('/');
            } else {
              throw new Error('Failed to edit customer');
            }
          })
          .catch((error) => {
            console.error('Error edit customer:', error);
          });
    }
  };

  return (
      <div className="add-customer-container">
        <form className="my-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>{mode === 'add' ? 'Add New Customer' : 'Edit Customer'}</legend>

            <div className="form-group">
              <label htmlFor="name">First Name:</label>
              <input
                  type="text"
                  id="name"
                  name="name"
                  value={customerData.name}
                  onChange={handleChange}
                  required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name:</label>
              <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={customerData.lastName}
                  onChange={handleChange}
                  required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                  type="email"
                  id="email"
                  name="email"
                  value={customerData.email}
                  onChange={handleChange}
                  required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number:</label>
              <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={customerData.phoneNumber}
                  onChange={handleChange}
                  required
              />


              <button type="button" onClick={handleCheckPhoneNumberValidity}>
                Check Validity
              </button>


              {isPhoneNumberValid !== null && (
                  <span className={isPhoneNumberValid ? 'valid' : 'invalid'}>
              {isPhoneNumberValid ? 'Valid Phone Number' : 'Invalid Phone Number'}
            </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="operator">Operator:</label>
              <input
                  type="text"
                  id="operator"
                  name="operator"
                  value={customerData.operator}
                  onChange={handleChange}
                  required
              />
            </div>

            <div className="form-group">
              <label htmlFor="countryCode">Country code:</label>
              <input
                  type="text"
                  id="countryCode"
                  name="countryCode"
                  value={customerData.countryCode}
                  onChange={handleChange}
                  required
              />
            </div>

            <button type="submit" className="submit-btn">
              {mode === 'add' ? 'Add Customer' : 'Save Changes'}
            </button>
          </fieldset>
        </form>
      </div>
  );
};

export default AddCustomer;
