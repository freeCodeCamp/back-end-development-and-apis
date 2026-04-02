const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status');
const messages = document.getElementById('messages');
const usernameInput = document.getElementById('username-input');
const messageInput = document.getElementById('message-input');
const connectBtn = document.getElementById('connect-btn');
const sendBtn = document.getElementById('send-btn');

let socket = null;

function appendMessage({ type, username, text }) {
  const el = document.createElement('div');
  el.classList.add('msg', type);
  if (type === 'chat') {
    el.innerHTML = `<span class="username">${escapeHtml(username)}:</span>${escapeHtml(text)}`;
  } else {
    el.textContent = text;
  }
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function setConnected(connected) {
  statusDot.className = connected ? 'connected' : 'disconnected';
  statusText.textContent = connected ? 'Connected' : 'Disconnected';
  messageInput.disabled = !connected;
  sendBtn.disabled = !connected;
  connectBtn.textContent = connected ? 'Disconnect' : 'Connect';
  usernameInput.disabled = connected;
}

connectBtn.addEventListener('click', () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
    return;
  }
  const username = usernameInput.value.trim() || 'Anonymous';
  socket = new WebSocket(`ws://localhost:3001?username=${encodeURIComponent(username)}`);

  socket.onopen = () => setConnected(true);

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      appendMessage(data);
    } catch {
      // ignore malformed messages
    }
  };

  socket.onclose = () => {
    setConnected(false);
    socket = null;
  };

  socket.onerror = () => {
    setConnected(false);
  };
});

function sendMessage() {
  const text = messageInput.value.trim();
  const username = usernameInput.value.trim() || 'Anonymous';
  if (!text || !socket || socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify({ username, text }));
  messageInput.value = '';
}

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});
