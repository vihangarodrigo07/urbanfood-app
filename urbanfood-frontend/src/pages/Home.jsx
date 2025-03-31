import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const services = [
    { title: "Products", path: "/products", icon: "📦", desc: "Manage inventory" },
    { title: "Orders", path: "/orders", icon: "📝", desc: "Track customer orders" },
    { title: "Customers", path: "/customers", icon: "👥", desc: "View client data" },
    { title: "Payments", path: "/payments", icon: "💳", desc: "Process transactions" },
    { title: "Delivery", path: "/delivery", icon: "🚚", desc: "Monitor shipments" },
    { title: "Reviews", path: "/reviews", icon: "⭐", desc: "Customer feedback" }
  ];

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>UrbanFood Dashboard</h1>
        <p>Manage your business operations seamlessly</p>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <Link to={service.path} key={service.title} className="service-card">
            <span className="service-icon">{service.icon}</span>
            <h3>{service.title}</h3>
            <p>{service.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}