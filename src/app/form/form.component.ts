import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import * as $ from 'jquery';

// Importar a classe dos formulario
import { GameForm } from '../classes/game-form';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  // Declara campos do formulario
  gameForm: GameForm = new GameForm();

  // Armazena os nomes das plataformas
  platforms: Observable<any[]>;

  constructor(private db: AngularFirestore) {

    this.platforms = this.db.collection('platforms', (ref) => ref.orderBy('name')).valueChanges();

  }

  ngOnInit(): void {

    $(document).ready(() => { // JQuery
      $(window).resize(() => {
        if (window.innerWidth > 539) {
          $('aside').show(0);
        } else {
          $('aside').hide(0);
        }
      });
    });
  }

  // Metodo que processa o formulario
  onSubmit() {
    console.log(this.gameForm);

    // Se não identificou um id cadastre um novo jogo ({...} é um atalho para Json parse)
    if (this.gameForm.id === undefined) {

      // Cadastrar novo jogo
      this.db.collection<any>('games').add({...this.gameForm})
      .then(() => {

        // Freedback positivo para o usuário
        alert(`Jogo "${this.gameForm.title}" adicionado com sucesso!\n\nClick em salvar para continua.`);

        // Apaga os valores dos documentos dos campos do formulario
        this.gameForm = new GameForm();

        // Sai sem fazer nada
        return false;

      })
      .catch((err) => {
        // Exibe erros no console
        console.error('Erro na gravação de dados: ' + err);

      });



    } else {

      // edita o novo jogo indicado pelo Id

    }
  }









  // Oculta / exibe ajuda
  helpToggle() {
    $(document).ready(() => {

      if ($('aside').is(':visible')) {
        this.helpHide();
      } else {
        this.helpShow();
      }

    });
    return false;
  }

  // Oculta ajuda
  helpHide() {
    $('aside').slideUp('fast');
  }

  // Mostra ajuda
  helpShow() {
    $('aside').slideDown('fast');
  }

  hideAside() {
    if (window.innerWidth > 539) {
      return false;
    } else {
      this.helpHide();
    }
  }

}
