const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('Cliente conectado.');

    ws.on('message', (message) => {
        // console.log(`Mensaje recibido: ${message}`);

        // Parsear el mensaje JSON recibido
        const data = JSON.parse(message);

        // Manejar diferentes tipos de mensajes
        console.log({ data })
        switch (data.type) {
            case 'chat':
                // Enviar el mensaje a todos los clientes conectados
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: 'chat',
                            username: data.username,
                            message: data.message,
                        }));
                    }
                });
                break;
            case 'typing':
                // Enviar un mensaje a todos los clientes, indicando que un usuario está escribiendo
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: 'typing',
                            username: data.username,
                        }));
                    }
                });
                break;
            default:
                console.log('');
        }
    });

    ws.on('close', () => {
        console.log('Cliente desconectado.');
    });
});




