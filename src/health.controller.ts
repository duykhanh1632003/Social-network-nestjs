import { Controller, Get } from "@nestjs/common";
import {  ApiBearerAuth, ApiHeader, ApiTags } from "@nestjs/swagger";

@Controller('health')
@ApiTags('health')
@ApiBearerAuth('access-token')

@ApiBearerAuth()
export class HealthController {
    @Get()
    checkHealth() {
        return { status: 'Ok' , message : 'The application is running smoothly.'}
    }   
}