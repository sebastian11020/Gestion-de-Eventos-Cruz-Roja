import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entity/person.entity';
import { EpsPersonModule } from '../eps-person/eps-person.module';
import { GroupStatusModule } from '../group-status/group-status.module';
import { ProgramStatusModule } from '../program-status/program-status.module';
import { EmailModule } from '../email/email.module';
import { PersonSkillModule } from '../person-skill/person-skill.module';
import { PersonRoleModule } from '../person-role/person-role.module';
import { SupabaseAuthModule } from '../../common/config/guards/supabase-auth.module';
import { SupabaseModule } from '../../common/config/supabase/supabase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Person]),
    EpsPersonModule,
    GroupStatusModule,
    ProgramStatusModule,
    EpsPersonModule,
    EmailModule,
    PersonSkillModule,
    PersonRoleModule,
    SupabaseModule,
    SupabaseAuthModule,
  ],
  providers: [PersonService],
  controllers: [PersonController],
  exports: [PersonService],
})
export class PersonModule {}
