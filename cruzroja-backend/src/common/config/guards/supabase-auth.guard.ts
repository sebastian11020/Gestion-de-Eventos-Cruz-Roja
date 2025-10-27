import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { user?: User }>();

    if (req.method === 'OPTIONS') return true;

    const authHeader: string | string[] | undefined =
      req.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Token no enviado');
    }

    const token: string = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : authHeader.trim();

    if (!token) {
      throw new UnauthorizedException('Token vacío');
    }

    const supabase: SupabaseClient<any> = this.supabaseService.getClient();

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      throw new UnauthorizedException('Token inválido');
    }

    req.user = data.user;

    return true;
  }
}
