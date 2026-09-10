import { Injectable } from '@nestjs/common';

@Injectable()
export class UserSubgraphService {
  getHello(): string {
    return 'Hello World!';
  }
}
