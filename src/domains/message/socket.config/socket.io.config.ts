import { io } from "@server";

io.on('connection', (socket) => {
    const userId = socket.handshake.auth.token;
    console.log('User connected:', socket.id);
})

