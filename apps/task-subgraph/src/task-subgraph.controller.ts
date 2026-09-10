import { Controller, Get } from '@nestjs/common';
import { TaskSubgraphService } from './task-subgraph.service';

@Controller()
export class TaskSubgraphController {
  constructor(private readonly taskSubgraphService: TaskSubgraphService) {}

  @Get()
  getHello(): string {
    return this.taskSubgraphService.getHello();
  }
}
