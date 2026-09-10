import { Test, TestingModule } from '@nestjs/testing';
import { UserSubgraphController } from './user-subgraph.controller';
import { UserSubgraphService } from './user-subgraph.service';

describe('UserSubgraphController', () => {
  let userSubgraphController: UserSubgraphController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserSubgraphController],
      providers: [UserSubgraphService],
    }).compile();

    userSubgraphController = app.get<UserSubgraphController>(UserSubgraphController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(userSubgraphController.getHello()).toBe('Hello World!');
    });
  });
});
