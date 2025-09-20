import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabase.supabaseUrl,
      environment.supabase.supabaseKey,
        {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      
    }
  }

    );
  }

  get client() {
    return this.supabase;
  }

  async getSupabaseUserIdOrThrow() {
    const { data: { user }, error } = await this.supabase.auth.getUser();
    if (error || !user) throw new Error('No hay sesión en Supabase');
    return user.id;
  }

  async uploadWallpaper(file: File) {
    const userId = await this.getSupabaseUserIdOrThrow();

    const safeName = file.name
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9._-]/g, '');
    const filePath = `${userId}/${Date.now()}-${safeName}`;

    const { error } = await this.supabase
      .storage
      .from('wallpapers')
      .upload(filePath, file, { upsert: false });

    if (error) throw error;
    return filePath;
  }

  async getSignedUrl(filePath: string) {
    const { data, error } = await this.supabase
      .storage
      .from('wallpapers')
      .createSignedUrl(filePath, 60 * 60);
    if (error) throw error;
    return data.signedUrl;
  }

  async listMyWallpapersWithUrls() {
    const userId = await this.getSupabaseUserIdOrThrow();

    const { data, error } = await this.supabase
      .storage
      .from('wallpapers')
      .list(userId, { sortBy: { column: 'created_at', order: 'desc' } });

    if (error) throw error;

    return Promise.all(
      (data ?? []).map(async (file) => {
        const filePath = `${userId}/${file.name}`;
        const signedUrl = await this.getSignedUrl(filePath);
        return { name: file.name, url: signedUrl };
      })
    );
  }
}