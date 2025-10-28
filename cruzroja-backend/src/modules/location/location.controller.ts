import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { SupabaseAuthGuard } from '../../common/config/guards/supabase-auth.guard';

@UseGuards(SupabaseAuthGuard)
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  getAll() {
    return this.locationService.getAllDto();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.getByIdDto(id);
  }

  @Get('/department/:id/municipalities')
  @HttpCode(HttpStatus.OK)
  getMunicipalitiesByDepartment(@Param('id', ParseIntPipe) id: number) {
    return this.locationService.getMunicipalitiesByDepartmentDto(id);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationService.update(id, updateLocationDto);
  }
}
