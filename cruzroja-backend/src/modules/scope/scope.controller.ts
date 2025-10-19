import { Body, Controller, Get, Post } from '@nestjs/common';
import { ScopeService } from './scope.service';
import { CreateScopeDto } from './dto/create-scope.dto';

@Controller('scope')
export class ScopeController {
  constructor(private readonly scopeService: ScopeService) {}

  @Post('/create')
  async create(@Body() createScopeDto: CreateScopeDto) {
    return this.scopeService.create(createScopeDto);
  }

  @Get('/all')
  async getAll() {
    return this.scopeService.getAll();
  }
}
