// src/app/core/services/auth.ts
import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  user as userObservable
} from '@angular/fire/auth';
import {
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword
} from 'firebase/auth';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user$: Observable<any>;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private supabase: SupabaseService,
  ) {
    this.user$ = userObservable(this.auth);
  }

  /** Alias para compatibilidad */
  public get currentUser$(): Observable<any> {
    return this.user$;
  }

  // ----------------------
  // Registro de usuario
  // ----------------------
  async register(email: string, password: string, name: string, lastname: string) {
  console.log('🔹 [AuthService] Registrando en Firebase...');
  const cred = await createUserWithEmailAndPassword(this.auth, email, password);
  console.log('✅ Firebase OK', cred.user.uid);

  if (cred.user) {
    const uid = cred.user.uid;

    console.log('🔹 Guardando perfil en Firestore...');
    await setDoc(doc(this.firestore, 'users', uid), {
      uid,
      email,
      name,
      lastname,
      createdAt: serverTimestamp()
    });

    console.log('🔹 Actualizando displayName en Firebase Auth...');
    await updateProfile(cred.user, { displayName: `${name} ${lastname}` });

    // 🔹 Espera breve para evitar lock de Supabase
    await new Promise(res => setTimeout(res, 300));

    console.log('🔹 Registrando en Supabase...');
    const { data: signUpData, error: signUpErr } = await this.supabase.client.auth.signUp({ email, password });
    console.log('📄 Respuesta signUp Supabase:', signUpData, signUpErr);

    if (signUpErr) {
      if (/already/i.test(signUpErr.message)) {
        console.warn('⚠️ Usuario ya existe en Supabase, intentando login...');
      } else {
        throw signUpErr;
      }
    }

    console.log('🔹 Iniciando sesión en Supabase...');
    const { data: signInData, error: signInErr } = await this.supabase.client.auth.signInWithPassword({ email, password });
    console.log('📄 Respuesta signIn Supabase:', signInData, signInErr);

    if (signInErr) {
      throw signInErr;
    }

    console.log('✅ Registro completo en Firebase y Supabase');
  }

  return cred;
}


  // ----------------------
  // Login / Logout
  // ----------------------
  async login(email: string, password: string) {
    // 1) Firebase
    await signInWithEmailAndPassword(this.auth, email, password);

    // 2) Supabase
    const { error } = await this.supabase.client.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }

    
  // 3) Cargar wallpapers del usuario
  const wallpapers = await this.supabase.listMyWallpapersWithUrls();
  console.log('🖼 Wallpapers del usuario:', wallpapers);
  return wallpapers; // ya los puedes devolver al componente
  }


  async logout() {
    // 1) Firebase
    await signOut(this.auth);

    // 2) Supabase
    const { error } = await this.supabase.client.auth.signOut();
    if (error) {
      throw error;
    }
  }

  // ----------------------
  // Firestore helpers
  // ----------------------
  async getUserDocOnce(uid: string) {
    const snap = await getDoc(doc(this.firestore, 'users', uid));
    return snap.exists() ? snap.data() : null;
  }

  // ----------------------
  // Actualizaciones seguras
  // ----------------------
  async updateDisplayName(name: string): Promise<void> {
    const current = this.auth.currentUser;
    if (!current) {
      throw new Error('No hay usuario autenticado');
    }

    // Firebase Auth
    await updateProfile(current, { displayName: name });

    // Firestore
    await updateDoc(doc(this.firestore, 'users', current.uid), { name });
  }

  async reauthenticate(currentPassword: string): Promise<void> {
    const current = this.auth.currentUser;
    if (!current || !current.email) {
      throw new Error('No hay usuario autenticado');
    }

    const credential = EmailAuthProvider.credential(current.email, currentPassword);
    await reauthenticateWithCredential(current, credential);
  }

  async updateUserPassword(newPassword: string): Promise<void> {
    const current = this.auth.currentUser;
    if (!current) {
      throw new Error('No hay usuario autenticado');
    }
    await updatePassword(current, newPassword);
  }

    // ----------------------
  // Wallpapers
  // ----------------------
  async getMyWallpapers() {
    return this.supabase.listMyWallpapersWithUrls();
  }
  
}