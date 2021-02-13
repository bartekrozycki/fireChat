import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from './auth-service.service';
import {Router} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import firebase from 'firebase';
import firestore = firebase.firestore;

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private router: Router
  ) {
  }

  get(chatId): Observable<any> {
    return this.afs
      .collection<any>('chats')
      .doc(chatId)
      .snapshotChanges()
      .pipe(
        map(doc => {
          return {id: doc.payload.id, ...doc.payload.data()};
        })
      );
  }

  async create(): Promise<boolean> {
    const {uid} = await this.auth.getUser();

    const data = {
      uid,
      createdAt: Date.now(),
      count: 0,
      messages: []
    };

    const docRef = await this.afs.collection('chats').add(data);

    return this.router.navigate(['chats', docRef.id]);

  }

  async sendMessage(chatId, message): Promise<void> {
    const {uid} = await this.auth.getUser();

    const data = {
      uid,
      message,
      createdAt: Date.now(),
    };

    if (uid) {
      const ref = this.afs.collection('chats').doc(chatId);
      return ref.update({
        messages: firestore.FieldValue.arrayUnion(data)
      });
    }
  }

  getUserChats(): Observable<any> {
    return this.auth.user$.pipe(
      switchMap(user => {
        return this.afs
          .collection('chats', ref => ref.where('uid', '==', user.uid))
          .snapshotChanges()
          .pipe(
            map(actions => {
              return actions.map(a => {
                // tslint:disable-next-line:ban-types
                const data: Object = a.payload.doc.data();
                const id = a.payload.doc.id;
                return {id, ...data};
              });
            })
          );
      })
    );
  }
}
