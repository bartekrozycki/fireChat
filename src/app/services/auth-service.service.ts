import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {User} from '../interfaces/user';
import {Observable, of} from 'rxjs';
import {first, switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  user$: Observable<any>;

  public user: User; // Save logged in user data

  constructor(private afs: AngularFirestore,
              private afAuth: AngularFireAuth,
              private router: Router) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  getUser(): Promise<any>{
    return this.user$.pipe(first()).toPromise();
  }

  signInWithEmail(email: string, password: string): Promise<void> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        this.updateUserData(userCredential.user);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  signUpWithEmail(email: string, password: string): Promise<void> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        this.updateUserData(userCredential.user);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  signOut(): void {
    this.afAuth.signOut();
    this.router.navigate(['/sign']);
  }

  private updateUserData({uid, email}: User): Promise<void> {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${uid}`);

    const data = { // might be a problem
      uid,
      email,
    };

    return userRef.set(data, {merge: true});
  }


}
