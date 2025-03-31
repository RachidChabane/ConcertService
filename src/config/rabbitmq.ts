import amqplib, { Connection, Channel } from 'amqplib';
import config from './config';

class RabbitMQConnection {
    private connection!: Connection;
    private channel!: Channel;
    private connected: boolean = false;

    async connect(): Promise<void> {
        if (this.connected && this.channel) return;
        this.connected = true;

        try {
            console.log(`⌛️ Connecting to Rabbit-MQ Server`);
            this.connection = await amqplib.connect({
                hostname: config.rabbitmq.host,
                port: config.rabbitmq.port,
                username: config.rabbitmq.user,
                password: config.rabbitmq.pass,
                // Erlang cookie can be used for advanced setups, e.g., clustering
                locale: config.rabbitmq.erlangCookie
            });

            console.log(`✅ Rabbit MQ Connection is ready`);
            
            this.channel = await this.connection.createChannel();
            console.log(`🛸 Created RabbitMQ Channel successfully`);
        } catch (error) {
            console.error(error);
            console.error(`Not connected to MQ Server`);
        }
    }

    async sendToQueue(queue: string, message: any): Promise<void> {
        try {
            if (!this.channel) {
                await this.connect();
            }

            this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

const mqConnection = new RabbitMQConnection();
export default mqConnection;


