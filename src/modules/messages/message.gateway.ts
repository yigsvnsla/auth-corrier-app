import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(80, {})
export class MessageGateway implements OnModuleInit {
	@WebSocketServer()
	public server: Server;

	constructor() {}
	public onModuleInit() {
		this.server.on('connection', (socket: Socket) => {
			console.log('Cliente Conectado');
			socket.on('disconnect', () => console.log('Cliente Desconectado'));
		});
	}
}
