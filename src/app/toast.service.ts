// toast.service.ts
import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: any[] = [];
  options: any = {
    delay: 5000,
    autohide: true,
    animation: true
  };

  warning(message: string, title: string = 'Warning') {
    this.options.classname = 'bg-warning text-light';
    this.options.headertext = title;
    this.show(message, this.options);
    console.log(message);
  }

  success(message: string, title: string = 'Success') {
    this.options.classname = 'bg-success text-light';
    this.options.headertext = title;
    this.show(message, this.options);
    console.log(message);
  }

  error(message: string, title: string = 'Error') {
    this.options.classname = 'bg-danger text-light';
    this.options.headertext = title;
    this.show(message, this.options);
    console.error(message);
  }

  info(message: string, title: string = 'Info') {
    this.options.classname = 'bg-info text-light';
    this.options.headertext = title;
    this.show(message, this.options);
    console.info(message);
  }

  // Push new Toasts to array with content and options
  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  // Callback method to remove Toast DOM element from view
  remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
