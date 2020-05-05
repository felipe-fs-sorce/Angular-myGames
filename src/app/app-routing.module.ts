import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './list/list.component';
import { NewComponent } from './new/new.component';
import { E404Component } from './e404/e404.component';
import { AboutComponent } from './about/about.component';
import { EditComponent } from './edit/edit.component';


const routes: Routes = [

//Rota não especificada é redirecionada para  a home

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

  //Rota para  listagem dos games
  { path: 'list', component: ListComponent, data: { title: 'Lista de Jogos'} },
  { path: 'new', component: NewComponent, data: { title: 'Novo Jogo'} },
  { path: 'about', component: AboutComponent, data: { title: 'Sobre o my Games' } },

  //Rota para editar documento
  { path: 'edit/:id', component: EditComponent, data: { title: 'Edite o Jogo'} },

  //Rota desconhecida é redirecionada para o componete "error404"

  { path: '**', component: E404Component, data: { title: 'Error de cadastro' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
