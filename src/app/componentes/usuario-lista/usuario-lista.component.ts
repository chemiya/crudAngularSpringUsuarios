import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../shared/modelo/app.model';
import { ClienteApiRestService } from 'src/app/shared/controlador/cliente-api-rest.service';
import { DataService } from 'src/app/shared/controlador/data.service';

@Component({
  selector: 'app-usuario-lista',
  templateUrl: './usuario-lista.component.html',
  styleUrls: ['./usuario-lista.component.css']
})
export class UsuarioListaComponent implements OnInit {

  Usuarios!: Usuario[];
  UsuariosActualizarTrue: Usuario[] = [];
  UsuariosActualizarFalse: Usuario[] = [];
  cambiadosParaTrue: Number[] = [];
  cambiadosParaFalse: Number[] = [];
  botonGuardarCambios: boolean = true;
  message!: string;
  showMessage!: boolean;
  tipoFiltrado: String = "todos";
  //todos los avisos con message y showMessage


  constructor(private clienteApiRest: ClienteApiRestService, private datos: DataService) { }

  ngOnInit() {
    //segun el tuturoial que nos paso para implementar la comunicacion entre componentes
    //se necesitaba esto

    this.datos.currentMessage.subscribe(message => this.message = message);
    this.datos.showMessageActual.subscribe(showMessage => this.showMessage = showMessage);


    this.getUsuarios();
  }
  getUsuarios() {
    this.clienteApiRest.getAllUsuarios().subscribe(
      resp => {

        if (resp.status < 400) {
          this.Usuarios = resp.body!;
        } else {
          this.datos.changeMessage("error al acceder a los usuarios");
          this.datos.changeShowMessage(true);
        }
      },
      err => {
        console.log("Error al traer la lista: " + err.message);
        throw err;
      }
    )
  }



  borrar(id: Number) {
    if (window.confirm("esta seguro de que quier borrar a este usuario?")) {//ventana para confirmar
      this.clienteApiRest.borrarUsuario(String(id)).subscribe(
        resp => {
          if (resp.status < 400) {

            this.datos.changeMessage(resp.body);//mostramos que ya lo hemos eliminado
            this.datos.changeShowMessage(true);

            this.getUsuarios();//volvemos a cargar los nuevos usuarios
          } else {
            this.datos.changeMessage("error al eliminar el usuario");
            this.datos.changeShowMessage(true);
          }
        },
        err => {
          console.log("Error al borrar: " + err.message);
          throw err;
        }
      )
    }
  }

  


  cambioCheckbox( id: Number, enabled: boolean): void {
    
    
    //console.log("para " + id + " el nuevo estado es " + enabled);



    if (enabled == true) {
      this.cambiadosParaTrue = this.cambiadosParaTrue.filter(cambio => cambio != id);//buscamos si ya lo habia metido
      this.cambiadosParaTrue.push(id);//le guardamos para cambiar
      this.cambiadosParaFalse = this.cambiadosParaFalse.filter(cambio => cambio != id);//si esta en el contrario lo quitamos
    } else {
      this.cambiadosParaFalse = this.cambiadosParaFalse.filter(cambio => cambio != id);
      this.cambiadosParaFalse.push(id);
      this.cambiadosParaTrue = this.cambiadosParaTrue.filter(cambio => cambio != id);
    }


    //habilitamos el boton si hay algun cambio para hacer
    if (this.cambiadosParaFalse.length > 0 || this.cambiadosParaTrue.length > 0) {
      this.botonGuardarCambios = false;

    } else {
      this.botonGuardarCambios = true;

    }
  }

 
  onChangeDespegable(event: any) {
    this.tipoFiltrado = event;//cogemos la opcion seleccionada y buscamos en la base segun ella
    this.clienteApiRest.getUsuariosEnabled(this.tipoFiltrado).subscribe(
      resp => {

        if (resp.status < 400) {
          this.Usuarios = resp.body!;
        } else {
          this.datos.changeMessage("error al filtrar");
            this.datos.changeShowMessage(true);
        }
      },
      err => {
        console.log("Error al traer la lista: " + err.message);
        throw err;
      }
    )



  }

  guardarEnabled() {
    /*console.log("a true");
    console.log(this.cambiadosParaTrue);
    console.log("a false");
    console.log(this.cambiadosParaFalse);*/

    if (this.cambiadosParaTrue.length > 0) {//si hay alguno de true lo guardamos
      this.clienteApiRest.activarUsuarios(this.cambiadosParaTrue).subscribe(
        resp => {
          if (resp.status < 400) { 
            this.datos.changeMessage("cambios guardados con exito");
            this.datos.changeShowMessage(true);
          } else {
            this.datos.changeMessage("error al actualizar los registros");
            this.datos.changeShowMessage(true);
          }
          
        },
        err => {
          console.log("Error al actualizar: " + err.message);
          throw err;
        }
      )

      this.cambiadosParaTrue = [];//vaciamos el array para la siguiente vez
    }


    if (this.cambiadosParaFalse.length > 0) {//si hay alguno de false lo guardamos
      this.clienteApiRest.desactivarUsuarios(this.cambiadosParaFalse).subscribe(
        resp => {
          if (resp.status < 400) { 
            this.datos.changeMessage("cambios guardados con exito");
            this.datos.changeShowMessage(true);
          } else {
            this.datos.changeMessage("error al actualizar los registros");
            this.datos.changeShowMessage(true);
          }
         
        },
        err => {
          console.log("Error al actualizar: " + err.message);
          throw err;
        }
      )

      this.cambiadosParaFalse = [];//vaciamos el array
    }


  }

}
