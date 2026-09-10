import { Controller, Get } from '@nestjs/common';
import { ProjectSubgraphService } from './project-subgraph.service';

@Controller()
export class ProjectSubgraphController {
  constructor(private readonly projectSubgraphService: ProjectSubgraphService) {}

  @Get()
  getHello(): string {
    return this.projectSubgraphService.getHello();
  }
}
