import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';

const PORT = 3001;

const server = http.createServer((req, res) => {
	fs.readFile('./public/index.html', (error, html) => {
		if (error) {
			res.writeHead(500);
			res.end('Unable to load chat app');
			return;
		}

		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(html);
	});
});

const wss = new WebSocketServer({ server });

const broadcast = (message) => {
	const serializedMessage = JSON.stringify(message);
	wss.clients.forEach((client) => {
		if (client.readyState === 1) {
			client.send(serializedMessage);
		}
	});
};

wss.on('connection', (socket, req) => {
	const username = new URL(req.url, 'http://localhost').searchParams.get(
		'username',
	);

	broadcast({ type: 'system', text: `${username} joined` });

	socket.on('message', (message) => {
		const { username: messageUsername, text } = JSON.parse(message);
		broadcast({ type: 'chat', username: messageUsername, text });
	});

	socket.on('close', () => {
		broadcast({ type: 'system', text: `${username} left` });
	});
});

server.listen(PORT, () => {
	console.log(`Chat server running at http://localhost:${PORT}`);
});
