import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
    cors: {
        origin: '*'
    }
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('ChatGateway');

    @SubscribeMessage('enter')
    handleEnter(@MessageBody() data: string, @ConnectedSocket() client: Socket): void {
        this.logger.log(`Client ${client.id} entered with data: ${data}`);
        client.emit('enterResponse', `Welcome ${data}`)
    }

    private broadcast(event: string, client: Socket, message: any): void {
        this.logger.log(`Broadcasting event: ${event}, from client: ${client.id}`)
        client.broadcast.emit(event,message)
    }

    @SubscribeMessage('newMessage')
    sendMessage(@MessageBody() data: { room: string, nickname: string, message: string }, @ConnectedSocket() client: Socket): void {
        const { room, nickname, message } = data
        this.logger.log(`Client ${client.id} sent message: ${message} in room: ${room}`);

        this.server.to(room).emit('newMessage', { nickname, message })
        this.broadcast('newMessage', client, { nickname, message })
    }

    afterInit(server: Server): void {
    this.logger.log('WebSocket Server Initialized');
    }

    handleDisconnect(client: Socket): void {
        this.logger.log(`Client Disconnected: ${client.id}`);
    }

    handleConnection(client: Socket, ...args: any[]): void {
        this.logger.log(`Client Connected: ${client.id}`);
        client.emit('connected', `Hello ${client.id}`);
    }

}