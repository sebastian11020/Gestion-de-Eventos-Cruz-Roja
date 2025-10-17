import { Module } from '@nestjs/common';
import { PersonSkillController } from './person-skill.controller';
import { PersonSkillService } from './person-skill.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonSkill } from './entity/person-skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PersonSkill])],
  controllers: [PersonSkillController],
  providers: [PersonSkillService],
  exports: [PersonSkillService],
})
export class PersonSkillModule {}
