import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  //esto esta asi porque en el ejemplo de la practica de vinos no me funcionaba segun lo que venia en el enunciado
  //por lo tanto segui el tutorial que nos venia en el enlace para probar a ver si funcionaba

  //el mensaje
  private messageSource = new BehaviorSubject<string>("mensaje en behaviuor");
  currentMessage = this.messageSource.asObservable();


  //si se muestra o no
  private showMessage = new BehaviorSubject<boolean>(false);
  showMessageActual = this.showMessage.asObservable();


  constructor() { }
  changeMessage(mensaje: string) {
    this.messageSource.next(mensaje);
  }

  changeShowMessage(bool: boolean) {
    this.showMessage.next(bool);
  }
}
