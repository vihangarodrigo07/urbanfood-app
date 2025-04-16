import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const services = [
    { 
      title: "Products", 
      path: "/products", 
      icon: "📦", 
      desc: "Manage inventory",
      color: "#4CAF50" // Green
    },
    { 
      title: "Orders", 
      path: "/orders", 
      icon: "📝", 
      desc: "Track customer orders",
      color: "#2196F3" // Blue
    },
    { 
      title: "Customers", 
      path: "/customers", 
      icon: "👥", 
      desc: "View client data",
      color: "#9C27B0" // Purple
    },
    { 
      title: "Payments", 
      path: "/payments", 
      icon: "💳", 
      desc: "Process transactions",
      color: "#FF9800" // Orange
    },
    { 
      title: "Delivery", 
      path: "/delivery", 
      icon: "🚚", 
      desc: "Monitor shipments",
      color: "#607D8B" // Blue Grey
    },
    { 
      title: "Reviews", 
      path: "/reviews", 
      icon: "⭐", 
      desc: "Customer feedback",
      color: "#FFEB3B", // Yellow
      textColor: "#333" // Dark text for better contrast
    },
    {
      title: "Suppliers",
      path: "/suppliers",
      icon: "🏭", // Factory emoji
      desc: "Vendor management",
      color: "#FFCDD2",
      textColor: "#333" // White text for better contrast on green
    }
  ];

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>UrbanFood Dashboard</h1>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <Link 
            to={service.path} 
            key={service.title} 
            className="service-card"
            style={{ 
              '--card-color': service.color,
              color: service.textColor || '#fff'
            }}
          >
            <span className="service-icon">{service.icon}</span>
            <h3>{service.title}</h3>
            <p>{service.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}