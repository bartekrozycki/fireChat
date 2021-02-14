import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from './auth-service.service';
import {map, switchMap} from 'rxjs/operators';
import {combineLatest, Observable, of} from 'rxjs';
import firebase from 'firebase';
import FieldValue = firebase.firestore.FieldValue;

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
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

  async create(): Promise<string> {
    const {uid} = await this.auth.getUser();

    const data = {
      uid,
      createdAt: Date.now(),
      count: 0,
      messages: []
    };

    const docRef = await this.afs.collection('chats').add(data);

    return docRef.id;

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
        messages: FieldValue.arrayUnion(data)
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

  joinUsers(chat$: Observable<any>): Observable<any> {
    let chat;
    const joinKeys = {};

    return chat$.pipe(
      switchMap(c => {
        // Unique User IDs
        chat = c;
        const uids = Array.from(new Set(c.messages.map(v => v.uid)));

        // Firestore User Doc Reads
        const userDocs = uids.map(u =>
          this.afs.doc(`users/${u}`).valueChanges()
        );

        return userDocs.length ? combineLatest(userDocs) : of([]);
      }),
      map(arr => {
        arr.forEach(v => (joinKeys[(v as any).uid] = v));
        chat.messages = chat.messages.map(v => {
          return { ...v, user: joinKeys[v.uid] };
        });

        return chat;
      })
    );
  }
}
