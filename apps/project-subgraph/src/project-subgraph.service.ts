import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectSubgraphService {
  getHello(): string {
    return 'Hello World!';
  }
}
