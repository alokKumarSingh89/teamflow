import { Controller, Get } from '@nestjs/common';
import { UserSubgraphService } from './user-subgraph.service';

@Controller()
export class UserSubgraphController {
  constructor(private readonly userSubgraphService: UserSubgraphService) {}

  @Get()
  getHello(): string {
    return this.userSubgraphService.getHello();
  }
}
