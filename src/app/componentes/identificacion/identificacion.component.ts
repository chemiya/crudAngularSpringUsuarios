import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteApiRestService } from 'src/app/shared/controlador/cliente-api-rest.service';

@Component({
  selector: 'app-identificacion',
  templateUrl: './identificacion.component.html',
  styleUrls: ['./identificacion.component.css']
})
export class IdentificacionComponent implements OnInit {

  name!:string;
  password!:string;
  mensaje!:string;
  constructor(private clienteApiRest: ClienteApiRestService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(){
    this.clienteApiRest.identificacion(this.name,this.password).subscribe(
      resp => {
        if (resp.status < 400) {
          if(resp.body==null){
            this.mensaje="usuario y contrasena incorrectos";
          }else{
            this.router.navigate(['usuarios']);
          }


        } else {
          
          
        }
       
      },
      err => {
        console.log("Error al entrar: " + err.message);
        throw err;
      }
    )

  }

 

}
