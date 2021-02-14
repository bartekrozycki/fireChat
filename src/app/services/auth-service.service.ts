import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {User} from '../interfaces/user';
import {first, switchMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import firebase from 'firebase';
import Persistence = firebase.auth.Auth.Persistence;

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  user$: Observable<any>;

  public user: User; // Save logged in user data

  constructor(private afs: AngularFirestore,
              private afAuth: AngularFireAuth) {

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

  getUser(): Promise<any> {
    return this.user$.pipe(first()).toPromise();
  }

  signInWithEmail(email: string, password: string): Promise<void> {
    return this.afAuth.setPersistence(Persistence.SESSION).then( () => {
      return this.afAuth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          this.updateUserData(userCredential.user);
        });
    }).catch( (e) => {
      console.log(e);
    });
  }

  signUpWithEmail(email: string, password: string): Promise<void> {
    return this.afAuth.setPersistence(Persistence.SESSION).then( () => {
      return this.afAuth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          this.updateUserData(userCredential.user);
        });
    });
  }

  signOut(): void {
    this.afAuth.signOut();
  }

  private updateUserData(user: User): Promise<void> {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email,
    };


    return userRef.set(data, {merge: true});
  }



}
