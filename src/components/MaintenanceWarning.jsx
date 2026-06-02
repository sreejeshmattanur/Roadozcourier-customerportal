// src/components/MaintenanceWarning.jsx
import React, { useState, useEffect } from 'react';

const MaintenanceWarning = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkMaintenanceTime = () => {
      const currentHour = new Date().getHours();
      console.log("Current System Hour:", currentHour); // Check your console (F12) to see this

      // LOGIC: 
      // If you want to show the warning BEFORE 4 PM to tell people it's coming:
      // Change to: currentHour < 16
      
      // If you want to show it ONLY when it's 4 PM or later:
      // Keep it as: currentHour >= 16

      // FOR TESTING: Let's set it to true manually or check if it's before 4 PM
      if (currentHour < 16) { 
        setIsVisible(true); 
      } else {
        setIsVisible(true); // Always true for now just so you can see it's working!
      }
    };

    checkMaintenanceTime();
    const timer = setInterval(checkMaintenanceTime, 30000);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div style={styles.banner}>
      <div style={styles.content}>
        <span style={styles.icon}>⚠️</span>
        <p style={styles.text}>
          <strong>Scheduled Maintenance:</strong> The site will undergo maintenance today after 4:00 PM. Some features may be limited.
        </p>
      </div>
    </div>
  );
};

const styles = {
  banner: {
    backgroundColor: '#fff3cd', 
    color: '#856404',           
    padding: '12px 20px',
    borderBottom: '2px solid #ffeeba',
    textAlign: 'center',
    width: '100%',
    position: 'relative', // Changed from sticky to relative to ensure it pushes content down
    zIndex: 99999,
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  icon: {
    fontSize: '20px',
  },
  text: {
    margin: 0,
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: 'sans-serif',
  }
};

export default MaintenanceWarning;