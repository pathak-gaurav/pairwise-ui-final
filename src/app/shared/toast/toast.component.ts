import { Component, Input, OnInit } from '@angular/core';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {

  showToast: boolean = false;
  header: string = "";
  message: string = "";

  constructor(
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.toast.showState.subscribe(res => {
      console.log(res);
      
      this.showToast = res;
    });

    this.toast.heading.subscribe(res => {
      this.header = res;
    });

    this.toast.message.subscribe(res => {
      this.message = res;
    });
  }

  closeToast() {
    this.showToast = false;
  }

}
