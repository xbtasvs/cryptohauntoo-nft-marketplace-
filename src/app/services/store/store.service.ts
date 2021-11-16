import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  metadata: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  nickname: BehaviorSubject<any> = new BehaviorSubject<any>('');
  connectState: Subject<boolean> = new Subject<boolean>();
  constructor() { }

  changeMetaData(newMetaData: any) {
    this.metadata.next([...newMetaData])
  }

  changeNickName(newNickName: any) {
    this.nickname = newNickName
  }
}