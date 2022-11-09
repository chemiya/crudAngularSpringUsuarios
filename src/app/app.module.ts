import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditarUsuarioComponent } from './componentes/editar-usuario/editar-usuario.component';
import { UsuarioListaComponent } from './componentes/usuario-lista/usuario-lista.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { IdentificacionComponent } from './componentes/identificacion/identificacion.component';


@NgModule({
  declarations: [
    AppComponent,
    EditarUsuarioComponent,
    UsuarioListaComponent,
    IdentificacionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
   
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
