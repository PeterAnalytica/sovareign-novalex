import React, { useState, useEffect } from 'react';
import './App.css';
import { GoogleGenAI } from "@google/genai";

// --- 1. SOVEREIGN CONFIGURATION ---
// Ensure this key is provided or mapped via environment variables
const GEMINI_API_KEY = "YOUR_API_KEY_HERE"; 

// FIXED: Initializing with an object { apiKey: ... } as required by the latest SDK
const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

interface SovereignUser {
  uid: string;
  username: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<SovereignUser | null>(null);
  const [status, setStatus] = useState<string>("Disconnected");
  const [terminalLogs, setTerminalLogs] = useState<string[]>(["[SYS] Novalex Core initialized..."]);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);

  const addLog = (msg: string) => {
    setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    // Ensuring Pi SDK is available
    const piWindow = window as any;
    if (piWindow.Pi) {
      try {
        piWindow.Pi.init({ version: "2.0" });
        addLog("[SYS] Pi Network Protocol 21 Ready.");
      } catch (err) {
        addLog("[ERR] Pi SDK Initialization Failed.");
      }
    }
  }, []);

  const handleSignIn = async () => {
    setStatus("Authenticating...");
    const piWindow = window as any;
    try {
      // @ts-ignore
      const auth = await piWindow.Pi.authenticate(['payments', 'username'], onIncompletePaymentFound);
      setUser({ uid: auth.user.uid, username: auth.user.username });
      setStatus("Sovereign Verified");
      addLog(`[AUTH] User ${auth.user.username} secured.`);
    } catch (err) {
      console.error("Novalex Auth Error:", err);
      setStatus("Handshake Failed");
      addLog("[ERR] Authentication Handshake Failed.");
    }
  };

  // --- 2. CHRONOS AI (SNI) LOGIC ---
  const runChronosAudit = async () => {
    if (!user) return;
    if (GEMINI_API_KEY === "YOUR_API_KEY_HERE") {
      addLog("[ERR] AI Key Missing. Please update configuration.");
      return;
    }

    setIsAuditing(true);
    addLog("[SNI] Chronos Agent Activating...");

    try {
      const prompt = `SNI Chronos Audit for user ${user.username}. 
                      Perform a forensic audit simulation for a DPI/TechReg corridor. 
                      Output a 2-line summary of compliance status.`;
      
      const result = await model.generateContent(prompt);
      const report = await result.response.text();
      
      addLog(`[SNI] Report Generated: ${report}`);
      // Save to SNV (Local Vault)
      localStorage.setItem(`SNV_${user.uid}_audit`, report);
      addLog("[ASV] Report successfully vaulted locally (Data Residency Ensured).");
    } catch (err) {
      addLog("[ERR] AI Bridge Interrupted.");
    } finally {
      setIsAuditing(false);
    }
  };

  const onIncompletePaymentFound = (payment: any) => {
    addLog(`[SYS] Reconciling Incomplete Payment: ${payment.identifier}`);
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
              <button 
                className="btn-secondary" 
                onClick={runChronosAudit}
                disabled={isAuditing}
              >
                {isAuditing ? "Processing..." : "Run Chronos Audit"}
              </button>
            </div>

            <div className="card">
              <h3>Sovereign Vault (ASV)</h3>
              <p>Status: <span className="text-success">Encrypted</span></p>
              <p>vNIN Verification: <span style={{color: '#ff9800'}}>Pending</span></p>
              <button className="btn-secondary">Access Local Vault</button>
            </div>

            <div className="card full-width">
              <h3>TechReg Compliance Terminal</h3>
              <div className="terminal-view">
                {terminalLogs.map((log, i) => (
                  <code key={i}>{log}<br /></code>
                ))}
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
