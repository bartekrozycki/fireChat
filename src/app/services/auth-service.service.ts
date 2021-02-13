import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {UserService} from './user.service';
import {User} from '../shared/services/user';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  public user: User; // Save logged in user data

  constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth, public router: Router, public userService: UserService) {
    this.afAuth.authState.subscribe(user => {
      this.user = user;
    });
  }

  signInWithEmail(email: string, password: string): Promise<void> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        this.userService.setUserLoggedIn(userCredential.user);
        this.user = userCredential.user;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }

  signUpWithEmail(email: string, password: string): Promise<void> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        this.userService.setUserLoggedIn(userCredential.user);
        this.user = userCredential.user;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }

  signOut(): void {
    this.userService.clearLocalStorage();
    this.afAuth.signOut().then(() => {
      this.user = null;
    });
    this.router.navigate(['/sign']);
  }


}
