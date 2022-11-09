import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditarUsuarioComponent } from './componentes/editar-usuario/editar-usuario.component';
import { IdentificacionComponent } from './componentes/identificacion/identificacion.component';
import { UsuarioListaComponent } from './componentes/usuario-lista/usuario-lista.component';

const routes: Routes = [
  {path:"usuarios",component:UsuarioListaComponent},
  {path:"usuarios/:id/editar",component:EditarUsuarioComponent},
  {path:"usuarios/nuevo",component:EditarUsuarioComponent},
  {path:"",component:IdentificacionComponent},
  {path:"**",redirectTo:"usuarios",pathMatch:"full"},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
