import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  showState = new BehaviorSubject(false);
  
  public heading = new Subject<string>();
  public message = new Subject<string>();

  constructor() { }

  show(heading: any, message: any) {
    this.showState.next(true);

    // setting text for toast
    this.heading.next(heading);
    this.message.next(message);
  }

  close() {
    this.showState.next(false);
  }

}
