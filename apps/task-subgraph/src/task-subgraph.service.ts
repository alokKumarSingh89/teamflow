import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskSubgraphService {
  getHello(): string {
    return 'Hello World!';
  }
}
