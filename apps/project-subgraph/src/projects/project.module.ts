import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';

import { ProjectRepository } from './repositories/project.repository';
import { ProjectMemberRepository } from './repositories/project-member.repository';
import { LabelRepository } from './repositories/label.repository';

import { ProjectService } from './project.service';
import { ProjectMemberService } from './project-member.service';
import { LabelService } from './label.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ProjectRepository,
    ProjectMemberRepository,
    LabelRepository,

    ProjectService,
    ProjectMemberService,
    LabelService,
  ],
  exports: [ProjectService, ProjectMemberService, LabelService],
})
export class ProjectModule {}
