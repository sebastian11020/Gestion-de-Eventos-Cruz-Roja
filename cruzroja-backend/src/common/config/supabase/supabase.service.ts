import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  private readonly supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient<any>(
      <string>this.configService.get<string>('SUPABASE_URL'),
      <string>this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY'),
    );
  }

  getClient() {
    return this.supabase;
  }
}
