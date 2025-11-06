import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as process from 'node:process';
import { LocationModule } from './modules/location/location.module';
import { HeadquartersModule } from './modules/headquarters/headquarters.module';
import { GroupModule } from './modules/group/group.module';
import { ProgramModule } from './modules/program/program.module';
import { ProgramHeadquartersModule } from './modules/program-headquarters/program-headquarters.module';
import { GroupHeadquartersModule } from './modules/group-headquarters/group-headquarters.module';
import { EpsModule } from './modules/eps/eps.module';
import { PersonModule } from './modules/person/person.module';
import { EpsPersonModule } from './modules/eps-person/eps-person.module';
import { RoleModule } from './modules/role/role.module';
import { PersonRoleModule } from './modules/person-role/person-role.module';
import { StateModule } from './modules/state/state.module';
import { PersonStatusModule } from './modules/person-status/person-status.module';
import { HeadquartersStatusModule } from './modules/headquarters-status/headquarters-status.module';
import { GroupStatusModule } from './modules/group-status/group-status.module';
import { ProgramStatusModule } from './modules/program-status/program-status.module';
import { EmailModule } from './modules/email/email.module';
import { SkillModule } from './modules/skill/skill.module';
import { PersonSkillModule } from './modules/person-skill/person-skill.module';
import { ScopeModule } from './modules/scope/scope.module';
import { EventFrameModule } from './modules/event-frame/event-frame.module';
import { ClassificationEventModule } from './modules/classification_event/classification_event.module';
import { EventModule } from './modules/event/event.module';
import { EventStatusModule } from './modules/event-status/event-status.module';
import { EventQuotaModule } from './modules/event-quota/event-quota.module';
import { EventEnrollmentModule } from './modules/event-enrollment/event-enrollment.module';
import configuration from './common/config/configuration';
import { SupabaseModule } from './common/config/supabase/supabase.module';
import { SupabaseAuthModule } from './common/config/guards/supabase-auth.module';
import { EventAttendanceModule } from './modules/event_attendance/event_attendance.module';
import { NotificationModule } from './modules/notification/notification.module';
import { NotificationPersonModule } from './modules/notification-person/notification-person.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL,
      autoLoadEntities: true,
    }),
    SupabaseModule,
    SupabaseAuthModule,
    PersonModule,
    LocationModule,
    HeadquartersModule,
    GroupModule,
    ProgramModule,
    HeadquartersModule,
    GroupHeadquartersModule,
    ProgramHeadquartersModule,
    EpsModule,
    EpsPersonModule,
    RoleModule,
    PersonRoleModule,
    StateModule,
    PersonStatusModule,
    HeadquartersStatusModule,
    GroupStatusModule,
    ProgramStatusModule,
    EmailModule,
    SkillModule,
    PersonSkillModule,
    ScopeModule,
    EventFrameModule,
    ClassificationEventModule,
    EventModule,
    EventStatusModule,
    EventQuotaModule,
    EventEnrollmentModule,
    EventAttendanceModule,
    NotificationModule,
    NotificationPersonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
