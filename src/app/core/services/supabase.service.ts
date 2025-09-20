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
          persistSession: false, // evita locks en desarrollo
          autoRefreshToken: true,
        }
      }
    );
  }

  get client() {
    return this.supabase;
  }

  /** Obtiene el ID del usuario autenticado en Supabase o lanza error */
  async getSupabaseUserIdOrThrow() {
    const { data: { user }, error } = await this.supabase.auth.getUser();
    if (error || !user) {
      console.error('❌ No hay sesión activa en Supabase:', error?.message);
      throw new Error('No hay sesión en Supabase');
    }
    return user.id;
  }

  /** Sube un archivo al bucket wallpapers en la carpeta del usuario */
 async uploadWallpaper(file: File) {
  const userId = await this.getSupabaseUserIdOrThrow();

  const safeName = file.name
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '');

  const filePath = `${userId}/${Date.now()}-${safeName}`;

  console.log(`🔹 Subiendo archivo a Supabase: ${filePath}`);

  const { error } = await this.supabase
    .storage
    .from('wallpapers')
    .upload(filePath, file, { upsert: false });

  if (error) {
    console.error('❌ Error al subir a Supabase:', error.message);
    throw error;
  }

  console.log('✅ Archivo subido correctamente');

  // 🔹 Generar URL firmada inmediatamente
  const { data: signedData, error: signedErr } = await this.supabase
    .storage
    .from('wallpapers')
    .createSignedUrl(filePath, 60 * 60); // 1 hora

  if (signedErr) {
    console.error('❌ Error al generar URL firmada:', signedErr.message);
    throw signedErr;
  }

  return signedData.signedUrl; // devolvemos la URL lista para <img>
}

  /** Obtiene una URL firmada para un archivo */
  async getSignedUrl(filePath: string) {
    const { data, error } = await this.supabase
      .storage
      .from('wallpapers')
      .createSignedUrl(filePath, 60 * 60); // 1 hora

    if (error) {
      console.error('❌ Error al generar URL firmada:', error.message);
      throw error;
    }

    return data.signedUrl;
  }

  /** Lista los archivos del usuario con sus URLs firmadas */
  async listMyWallpapersWithUrls() {
    const userId = await this.getSupabaseUserIdOrThrow();

    const { data, error } = await this.supabase
      .storage
      .from('wallpapers')
      .list(userId, { sortBy: { column: 'created_at', order: 'desc' } });

    if (error) {
      console.error('❌ Error al listar wallpapers:', error.message);
      throw error;
    }

    return Promise.all(
      (data ?? []).map(async (file) => {
        const filePath = `${userId}/${file.name}`;
        const signedUrl = await this.getSignedUrl(filePath);
        return { name: file.name, url: signedUrl };
      })
    );
  }
}