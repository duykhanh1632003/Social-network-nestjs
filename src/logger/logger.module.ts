import { Global, MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { LoggerService } from "./logger.service";
import { LoggerMiddleware } from "src/Middlewares/logger.middleware";

@Global()
@Module({
    providers: [LoggerService],
    exports: [LoggerService]
})

export class LoggerModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });

    }
}