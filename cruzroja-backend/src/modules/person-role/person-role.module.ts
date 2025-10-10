import { Module } from '@nestjs/common';
import { PersonRoleService } from './person-role.service';
import { PersonRoleController } from './person-role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonRole } from './entity/person-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PersonRole])],
  providers: [PersonRoleService],
  controllers: [PersonRoleController],
  exports: [PersonRoleService],
})
export class PersonRoleModule {}
