import React from "react";
import { FaTwitter, FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa";
import "../styles/Footer.css";

const Footer: React.FC = () => (
  <footer className="custom-footer">
    <div className="footer-content">

      {/* Cột 1 - Logo */}
      <div className="footer-brand">
        <h2>MY BLOG</h2>
        <p>© 2025 RikkeiEdu Blog. All rights reserved.</p>
      </div>

      {/* Cột 2 - About */}
      <div className="footer-col">
        <h4>About Rareblocks</h4>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam dictum
          aliquet accumsan porta lectus ridiculus in mattis. Netus sodales in
          volutpat ullamcorper amet adipiscing fermentum.
        </p>
      </div>

      {/* Cột 3 - Company */}
      <div className="footer-col">
        <h4>Company</h4>
        <ul>
          <li>About</li>
          <li>Features</li>
          <li>Works</li>
          <li>Career</li>
        </ul>
      </div>

      {/* Cột 4 - Help */}
      <div className="footer-col">
        <h4>Help</h4>
        <ul>
          <li>Customer Support</li>
          <li>Delivery Details</li>
          <li>Terms & Conditions</li>
          <li>Privacy Policy</li>
        </ul>
      </div>

      {/* Cột 5 - Resources */}
      <div className="footer-col">
        <h4>Resources</h4>
        <ul>
          <li>Free eBooks</li>
          <li>Development Tutorial</li>
          <li>How to - Blog</li>
          <li>Youtube Playlist</li>
        </ul>
      </div>
    </div>

    {/* Social icons */}
    <div className="footer-social">
      <FaTwitter />
      <FaFacebookF />
      <FaInstagram />
      <FaGithub />
    </div>
  </footer>
);

export default Footer;
