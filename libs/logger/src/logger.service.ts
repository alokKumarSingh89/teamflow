import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  logPrismaQuery(event: {
    query: string;
    params: string;
    duration: number;
  }): void {
    console.log('\n========== PRISMA QUERY ==========');
    console.log(`Duration: ${event.duration}ms`);
    console.log(`SQL:      ${event.query}`);
    console.log(`Params:   ${event.params}`);
    console.log('==================================\n');
  }
}
