import React, { useState, useEffect } from 'react';
import './App.css';

// Define the User Structure for Novalex Probity
interface SovereignUser {
  uid: string;
  username: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<SovereignUser | null>(null);
  const [status, setStatus] = useState<string>("Disconnected");

  // Initial Handshake with Pi SDK
  const handleSignIn = async () => {
    setStatus("Authenticating...");
    try {
      // @ts-ignore - Pi is defined in index.html globally
      const auth = await window.Pi.authenticate(['payments', 'username'], onIncompletePaymentFound);
      setUser({
        uid: auth.user.uid,
        username: auth.user.username
      });
      setStatus("Sovereign Verified");
    } catch (err) {
      console.error("Novalex Auth Error:", err);
      setStatus("Handshake Failed");
    }
  };

  // Logic for unfinished transactions (Regulatory Requirement)
  const onIncompletePaymentFound = (payment: any) => {
    console.warn("Incomplete Transaction Found:", payment);
    // Chronos AI will handle the reconciliation here
  };

  return (
    <div className="novalex-container">
      <header className="novalex-header">
        <div className="logo-section">
          <h1>SOVEREIGN NOVALEX</h1>
          <span className="subtitle">Digital Public Infrastructure | SIL Ltd</span>
        </div>
        <div className="auth-badge">
          Status: <span className={`status-${status.toLowerCase().replace(' ', '-')}`}>{status}</span>
        </div>
      </header>

      <main className="novalex-main">
        {!user ? (
          <div className="onboarding-gate">
            <h2>Welcome, Pioneer</h2>
            <p>Access the Sovereign Intelligence (ASI) and Vault (ASV) systems by verifying your identity.</p>
            <button className="btn-primary" onClick={handleSignIn}>
              Enter Novalex Gateway
            </button>
          </div>
        ) : (
          <div className="dashboard-grid">
            <div className="card">
              <h3>Sovereign Intelligence (ASI)</h3>
              <p>User: <strong>{user.username}</strong></p>
              <p>Node: Lagos-NG-Main</p>
              <button className="btn-secondary">Run Chronos Audit</button>
            </div>

            <div className="card">
              <h3>Sovereign Vault (ASV)</h3>
              <p>Status: <span className="text-success">Encrypted</span></p>
              <p>vNIN Verification: Pending</p>
              <button className="btn-secondary">Manage Assets</button>
            </div>

            <div className="card full-width">
              <h3>TechReg Compliance Terminal</h3>
              <div className="terminal-view">
                <code>[SYS] Novalex Core initialized...</code><br />
                <code>[SYS] Awaiting payment enrouting via Pi Network...</code>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="novalex-footer">
        <p>&copy; 2026 SIL Ltd | North Star of African TechReg</p>
      </footer>
    </div>
  );
};

export default App;
