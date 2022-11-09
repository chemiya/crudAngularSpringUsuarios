import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../shared/modelo/app.model';
import { ClienteApiRestService } from 'src/app/shared/controlador/cliente-api-rest.service';
import { DataService } from 'src/app/shared/controlador/data.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit {

  usuarioVacio = {
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    password: "",
    enabled: true,
    role: "HOST",
    createdAt: new Date("2010-01-01"),
    updatedAt: new Date("2010-01-01"),
    id: 0
  };

  emailValido!: string;
  nombreValido!: String;
  usuario = this.usuarioVacio as Usuario;

  nombreOriginal!: String;
  emailOriginal!: String;
  revisarDiferencia: boolean = true;
  revisarDiferenciaEmail: boolean = true;

  id!: String;
  operacion!: String;

  constructor(private ruta: ActivatedRoute, private router: Router, private clienteApiRest: ClienteApiRestService, private datos: DataService) { }


  ngOnInit() {

    // Operacion: va en el ultimo string (parte) de la URL
    this.operacion = this.ruta.snapshot.url[this.ruta.snapshot.url.length - 1].path;
    if (this.operacion == "editar") {


      this.ruta.paramMap.subscribe( // Capturamos el id de la URL
        params => {
          this.id = params.get('id')!;

        },
        err => console.log("Error al leer id para editar: " + err)
      )

      //buscamos el usuario
      this.clienteApiRest.getUsuario(this.id).subscribe(
        resp => {
          if (resp.body == null) {//si no se encuentra el usuario
            this.router.navigate(['usuarios']);
            this.datos.changeMessage("usuario no encontrado");
            this.datos.changeShowMessage(true);
          } else {//si no lo guardamos para mostrarlo
            this.usuario = resp.body!;
            this.nombreOriginal = this.usuario.name;
            this.emailOriginal = this.usuario.email;
          }


        },
        err => {
          console.log("Error al traer el vino: " + err.message);
          throw err;
        }
      )
    }
  }

  valueChangeName(entrada: string) {//cuando cambia el campo name
    if (this.id) {//si estamos editando
      if (entrada == this.nombreOriginal) {//si la nueva entrada es como la original
        this.nombreValido = ("este era su usuario inicial");
        this.revisarDiferencia = false;//no hay que buscar si existe uno igual porque es este

      } else {
        this.revisarDiferencia = true;
      }
    }


    if (entrada.length > 0 && this.revisarDiferencia == true) {// buscamos un nombre similar en la base de datos
      this.clienteApiRest.buscarNombre(entrada).subscribe(
        resp => {
          if (resp.status < 400) {
            if (resp.body == null) {
              this.nombreValido = ("nombre de usuario permitido")//si no encuentra nadie igual
            } else {
              //si encuentra alguien igual
              this.nombreValido = ("nombre de usuario repetido, por favor elija otro")
            }


          }

        },
        err => {
          console.log("Error al editar: " + err.message);
          throw err;
        }
      )
    }


  }

  valueChangeEmail(entrada: any) {

    if (this.id) {//si estamos editando
      if (entrada == this.emailOriginal) {//si la entrada es la misma que la inicial
        this.emailValido = ("este era su email inicial");
        this.revisarDiferenciaEmail = false;// no hay que revisar si hay alguien igual

      } else {
        this.revisarDiferenciaEmail = true;
      }
    }


    if (entrada.length > 0 && this.revisarDiferenciaEmail == true) {//buscamos alguien con mismo email
      this.clienteApiRest.buscarEmail(entrada).subscribe(
        resp => {
          if (resp.status < 400) {
            if (resp.body == null) {
              this.emailValido = ("email permitido")//si no lo hay
            } else {

              this.emailValido = ("email repetido, por favor elija otro")//si lo hay no se puede repetir
            }


          }

        },
        err => {
          console.log("Error al editar: " + err.message);
          throw err;
        }
      )
    }

  }


  //envio del formulario
  onSubmit() {




    if (this.id) { //si estamos editando


      const fechaActual = new Date();
      this.usuario.updatedAt = fechaActual;//actualizamos la fecha de edicion


      this.clienteApiRest.modificarUsuario(String(this.usuario.id), this.usuario).subscribe(
        resp => {
          if (resp.status < 400) {
            this.datos.changeMessage(resp.body);
            this.datos.changeShowMessage(true);//avisamos de que se ha actualizado


          } else {

            this.datos.changeMessage("error al modificar");
            this.datos.changeShowMessage(true);
          }
          this.router.navigate(['usuarios']); // Volvemos a la pantalla principal
        },
        err => {
          console.log("Error al editar: " + err.message);
          throw err;
        }
      )
    } else { //crear nuevo
      //si el nombre y el email no estan repetidos se puede guardar si no no
      if (this.nombreValido != "nombre de usuario repetido, por favor elija otro" && this.emailValido != "email repetido, por favor elija otro") {
        const fechaActual = new Date();
        this.usuario.createdAt = fechaActual;
        this.usuario.updatedAt = fechaActual;//ponemos fecha actuales
       

        this.clienteApiRest.anadirUsuario(this.usuario).subscribe(
          resp => {
            if (resp.status < 400) {
              this.datos.changeMessage(resp.body);
              this.datos.changeShowMessage(true);
             
            } else {
              this.datos.changeMessage("error al anadir");
              this.datos.changeShowMessage(true);
             
            }
            this.router.navigate(['usuarios']);//volvemos a la pantalla principal
          },
          err => {
            console.log("Error al editar: " + err.message);
            throw err;
          }
        )
      }

    }



  }

}
