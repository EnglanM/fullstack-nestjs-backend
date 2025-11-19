import { Transport } from "@nestjs/microservices"
export const microservicesConfig = {
    authentication: {
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_HOST || 'localhost',
          port: parseInt(process.env.AUTH_TCP_PORT || '3001', 10),
        },
    },
    gateway: {
        port: parseInt(process.env.PORT || '3000', 10),
    },
}