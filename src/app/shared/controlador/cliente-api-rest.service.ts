import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../modelo/app.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteApiRestService {
  idJuntos: String = "";
  
  private static readonly BASE_URI = 'http://localhost:8080/users/';
  constructor(private http: HttpClient) { }

  //obtener todos los usuarios
  getAllUsuarios(): Observable<HttpResponse<Usuario[]>> {
    let url = ClienteApiRestService.BASE_URI;
    return this.http.get<Usuario[]>(url, { observe: 'response' });
  }

  identificacion(name:string,contrasena:string): Observable<HttpResponse<Usuario[]>> {
    let url = ClienteApiRestService.BASE_URI+"identificacion/"+name+"/"+contrasena;
    return this.http.get<Usuario[]>(url, { observe: 'response' });
  }


  //validacion del formulario para buscar nombre similar
  buscarNombre(nombre:String): Observable<HttpResponse<Usuario>> {
    let url = ClienteApiRestService.BASE_URI+"buscarNombre/"+nombre;
    return this.http.get<Usuario>(url, { observe: 'response' });
  }

  //validacion del formulario para buscar email similar
  buscarEmail(nombre:String): Observable<HttpResponse<Usuario>> {
    let url = ClienteApiRestService.BASE_URI+"buscarEmail/"+nombre;
    return this.http.get<Usuario>(url, { observe: 'response' });
  }


  //obtener los usuarios solo segun enabled
  getUsuariosEnabled(enabled:String): Observable<HttpResponse<Usuario[]>> {
    
    if(enabled==="true" ||enabled==="false"){//si solo true o false los filtras
      let url = ClienteApiRestService.BASE_URI+"tipo?enabled="+enabled;
    return this.http.get<Usuario[]>(url, { observe: 'response' });
    }else{//si no traes todos
      let url = ClienteApiRestService.BASE_URI;
    return this.http.get<Usuario[]>(url, { observe: 'response' });
    }

    
  }


  //crear usuario
  anadirUsuario(usuario:Usuario): Observable<HttpResponse<any>> {
    let url = ClienteApiRestService.BASE_URI;
    

    return this.http.post(url, usuario, { observe: 'response', responseType: 'text' });
}

//modificar los campos del usuario
modificarUsuario(id: String, usuario:Usuario): Observable<HttpResponse<any>> {

    let url = ClienteApiRestService.BASE_URI + id;
    return this.http.put(url, usuario, { observe: 'response', responseType: 'text' });
}


//eliminar el usuario
  borrarUsuario(id: String): Observable<HttpResponse<any>> {
    let url = ClienteApiRestService.BASE_URI + id;
    return this.http.delete(url, { observe: 'response', responseType: 'text' });
  }


  //activar el enabled de los usuarios
  activarUsuarios(user_id: Number[]): Observable<HttpResponse<any>> {


    //juntamos los id que nos vienen para ponerlos en el url
    for (let id of user_id) {
      this.idJuntos = id + "," + this.idJuntos;
      //console.log(this.idJuntos);
    }

    this.idJuntos = this.idJuntos.substring(0, this.idJuntos.length - 1);


    let url = ClienteApiRestService.BASE_URI + "enabled?user_id=" + this.idJuntos;

    //console.log(url);
    this.idJuntos = "";//vaciamos para proxima peticion
    return this.http.put(url, null, { observe: 'response', responseType: 'text' });
  }

  //desactivar el enabled de los usuarios
  desactivarUsuarios(user_id: Number[]): Observable<HttpResponse<any>> {
    //console.log(user_id);
    //juntamos los id que nos vienen para ponerlos en el url
    for (let id of user_id) {
      this.idJuntos = id + "," + this.idJuntos;
      console.log(this.idJuntos);
    }

    this.idJuntos = this.idJuntos.substring(0, this.idJuntos.length - 1);
    let url = ClienteApiRestService.BASE_URI + "disabled?user_id=" + this.idJuntos;
    //console.log(url);
    this.idJuntos = "";//vaciamos para proxima peticion
    return this.http.put(url, null, { observe: 'response', responseType: 'text' });
  }


  //obtener un usuario comcreto
  getUsuario(id: String): Observable<HttpResponse<Usuario>> {
    let url = ClienteApiRestService.BASE_URI + id;
    return this.http.get<Usuario>(url, { observe: 'response' });
}

 
}
