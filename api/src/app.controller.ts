import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('healthz')
  healthz(): string {
    return 'OK';
  }

  @Get('readinessz')
  readinessz(): string {
    return 'OK';
  }
}
