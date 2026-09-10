import { Test, TestingModule } from '@nestjs/testing';
import { ProjectSubgraphController } from './project-subgraph.controller';
import { ProjectSubgraphService } from './project-subgraph.service';

describe('ProjectSubgraphController', () => {
  let projectSubgraphController: ProjectSubgraphController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProjectSubgraphController],
      providers: [ProjectSubgraphService],
    }).compile();

    projectSubgraphController = app.get<ProjectSubgraphController>(ProjectSubgraphController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(projectSubgraphController.getHello()).toBe('Hello World!');
    });
  });
});
