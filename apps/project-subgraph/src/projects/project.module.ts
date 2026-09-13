import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';

import { ProjectRepository } from './repositories/project.repository';
import { ProjectMemberRepository } from './repositories/project-member.repository';
import { LabelRepository } from './repositories/label.repository';

import { ProjectService } from './project.service';
import { ProjectMemberService } from './project-member.service';
import { LabelService } from './label.service';
import { ProjectResolver } from './project.resolver';
import { ProjectOwnerResolver } from './project-owner.resolver';

@Module({
  imports: [DatabaseModule],
  providers: [
    ProjectRepository,
    ProjectMemberRepository,
    LabelRepository,

    ProjectService,
    ProjectMemberService,
    LabelService,
    ProjectResolver,
    ProjectOwnerResolver,
  ],
  exports: [ProjectService, ProjectMemberService, LabelService],
})
export class ProjectModule {}
