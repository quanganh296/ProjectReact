import React, { useState } from 'react';
import { Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

const { Text } = Typography;

interface SignupFormType {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SignupFormType>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    avatar?: string;
  }

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword } = formData;

    // Validate
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Invalid email format');
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

    // ✅ Get current users list from localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // ✅ Check if email already exists
    const existUser = (users as User[]).find((u) => u.email === email);

    if (existUser) {
      setError("Email already exists!");
      return;
    }

    // ✅ New User object
    const newUser = {
      id: Date.now(),
      name: `${firstName} ${lastName}`,
      email,
      password,
      role: "user",
      avatar: "https://via.placeholder.com/40"
    };

    // ✅ Save to localStorage
    const updatedUsers = [...users, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    message.success("Registration successful!");
    setError(null);

    // ✅ Redirect to login
    navigate("/login");
  };

  return (
    <div className="signup-container">
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
              <input type="text" name="firstName" placeholder="Enter your first name" value={formData.firstName} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input type="text" name="lastName" placeholder="Enter your last name" value={formData.lastName} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} />
          </div>

          <button type="submit" className="signup-btn">Sign Up</button>

          <div className="Signin-link">
            <Text>
              Already have an account?{" "}
              <Link style={{ textDecoration: 'underline', color: '#ff4d4f' }} to="/login">
                Login
              </Link>
            </Text>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
