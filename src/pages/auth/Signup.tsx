import React, { useState } from 'react';
import './Signup.css';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Email format is invalid');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError(null);
    console.log('Success:', formData);
  };

  return (
    <div className ="signup-container">
    <div className="signup-background">
      <div className="welcome-text">
        <h2>Welcome to the Website</h2>
        <p>RIKKEI EDUCATION</p>
      </div>
      <form className="signup-form" onSubmit={handleSubmit}>
       
        {error && <div className="error">{error}</div>}

        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="signup-btn">Sign Up</button>
        <p className="login-text">
          Already have an account? <a href="/">Login</a>
        </p>
        
      </form>
    </div>
    </div>
  );
};

export default Signup;
