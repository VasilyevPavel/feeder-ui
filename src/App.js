import React, { useEffect, useRef, useState } from 'react';

function App() {
  const [wsStatus, setWsStatus] = useState('Disconnected'); // <-- статус WebSocket
  const [feederState, setFeederState] = useState('Закрыто'); // <-- открыто/закрыто
  const ws = useRef(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.host;
    const socket = new WebSocket(`${protocol}://${host}/ws`);

    socket.onopen = () => {
      setWsStatus('Connected');
      console.log('✅ WebSocket connected');
    };

    socket.onclose = () => {
      setWsStatus('Disconnected');
      console.log('❌ WebSocket disconnected');
    };

    socket.onerror = (err) => console.error('WebSocket error:', err);

    socket.onmessage = (event) => {
      console.log('📨 Message from server:', event.data);
      if (event.data === 'open') setFeederState('Открыто');
      if (event.data === 'close') setFeederState('Закрыто');
    };

    ws.current = socket;
    return () => socket.close();
  }, []);

  const sendCommand = (cmd) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(cmd);
      console.log('➡️ Sent:', cmd);
    } else {
      console.warn('WebSocket not connected');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>🐱 Кормушка</h1>
      <p>WebSocket status: {wsStatus}</p>
      <p>Состояние кормушки: {feederState}</p>

      <button
        onClick={() => sendCommand('open')}
        style={{
          background: 'green',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          margin: '10px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Открыть
      </button>

      <button
        onClick={() => sendCommand('close')}
        style={{
          background: 'red',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          margin: '10px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Закрыть
      </button>
    </div>
  );
}

export default App;
