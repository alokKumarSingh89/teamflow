import { Test, TestingModule } from '@nestjs/testing';
import { TaskSubgraphController } from './task-subgraph.controller';
import { TaskSubgraphService } from './task-subgraph.service';

describe('TaskSubgraphController', () => {
  let taskSubgraphController: TaskSubgraphController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TaskSubgraphController],
      providers: [TaskSubgraphService],
    }).compile();

    taskSubgraphController = app.get<TaskSubgraphController>(TaskSubgraphController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(taskSubgraphController.getHello()).toBe('Hello World!');
    });
  });
});
