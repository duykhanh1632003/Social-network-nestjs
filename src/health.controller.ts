import { Controller, Get } from "@nestjs/common";

@Controller('health')
export class HealthController {
    @Get()
    checkHealth() {
        return { status: 'Ok' , message : 'The application is running smoothly.'}
    }
}