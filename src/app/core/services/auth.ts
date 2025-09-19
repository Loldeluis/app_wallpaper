// src/app/core/services/auth.ts
import { Injectable } from '@angular/core';

// modular auth functions
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  user as userObservable
} from '@angular/fire/auth';

// functions from firebase/auth for updates/reauth
import {
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword
} from 'firebase/auth';

// modular firestore functions
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user$: Observable<any>;

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {
    // helper that returns Observable<User | null>
    this.user$ = userObservable(this.auth);
  }

  // Alias por compatibilidad (opcional)
  public get currentUser$() {
    return this.user$;
  }

  // ----------------------
  // Registro (Auth + Firestore)
  // ----------------------
  async register(email: string, password: string, name: string, lastname: string) {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);

    if (cred.user) {
      const uid = cred.user.uid;

      // Guardar perfil en Firestore (modular)
      await setDoc(doc(this.firestore, 'users', uid), {
        uid,
        email,
        name,
        lastname,
        createdAt: serverTimestamp()
      });

      // Actualizar displayName en Auth
      await updateProfile(cred.user, { displayName: `${name} ${lastname}` });
    }

    return cred;
  }

  // ----------------------
  // Login / Logout
  // ----------------------
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  // ----------------------
  // Firestore helpers
  // ----------------------
  // Obtener documento del usuario (una sola vez)
  async getUserDocOnce(uid: string) {
    const snap = await getDoc(doc(this.firestore, 'users', uid));
    return snap.exists() ? snap.data() : null;
  }

  // ----------------------
  // Actualizaciones seguras
  // ----------------------
  // Actualizar displayName en Auth y tambien en Firestore
  async updateDisplayName(name: string): Promise<void> {
    const current = await this.auth.currentUser;
    if (!current) throw new Error('No hay usuario autenticado');
    await updateProfile(current, { displayName: name });

    // actualizar campo name en Firestore (opcional)
    await updateDoc(doc(this.firestore, 'users', current.uid), { name });
  }

  // Reautenticación: requiere contraseña actual
  async reauthenticate(currentPassword: string): Promise<void> {
    const current = await this.auth.currentUser;
    if (!current || !current.email) throw new Error('No hay usuario autenticado');
    const credential = EmailAuthProvider.credential(current.email, currentPassword);
    await reauthenticateWithCredential(current, credential);
  }

  // Actualizar contraseña (debe reautenticarse si Firebase lo exige)
  async updateUserPassword(newPassword: string): Promise<void> {
    const current = await this.auth.currentUser;
    if (!current) throw new Error('No hay usuario autenticado');
    await updatePassword(current, newPassword);
  }
}
