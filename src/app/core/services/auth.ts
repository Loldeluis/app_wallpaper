import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // 👇 Observable del usuario autenticado
  public user$: Observable<firebase.User | null>;

  constructor(private afAuth: AngularFireAuth) {
        this.user$ = this.afAuth.authState;
  }

  // Registro
  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  // Login
  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Logout
  logout() {
    return this.afAuth.signOut();
  }

  // Usuario actual como observable
  get currentUser$(): Observable<any> {
    return this.afAuth.authState;
  }

    // 🔹 Actualizar nombre (displayName)
  async updateDisplayName(name: string): Promise<void> {
    const user = await this.afAuth.currentUser;
    if (user) {
      await user.updateProfile({ displayName: name });
    } else {
      throw new Error('No hay usuario autenticado');
    }
  }

    // 🔹 Actualizar contraseña
  async updatePassword(newPassword: string): Promise<void> {
    const user = await this.afAuth.currentUser;
    if (user) {
      await user.updatePassword(newPassword);
    } else {
      throw new Error('No hay usuario autenticado');
    }
  }
  
}
