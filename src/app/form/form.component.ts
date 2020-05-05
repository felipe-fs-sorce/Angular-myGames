import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import * as $ from 'jquery';

// Importar a classe dos formulario
import { GameForm } from '../classes/game-form';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  // Declara campos do formulario
  gameForm: GameForm = new GameForm();

  // Armazena os nomes das plataformas
  platforms: Observable<any[]> = this.db.collection('platforms', (ref) => ref.orderBy('name')).valueChanges();

  // Obter rota
  id: string = this.route.snapshot.paramMap.get('id');

  constructor(

    //Conexão com Firestore
    private db: AngularFirestore,


    //Roteamentos
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit(): void {

    // se tem id obter dados do daos db
    if (this.id !== null) {

      // Atualizar campo dos formularios
      this.gameForm.id = this.id;

      this.db.collection<any>('games').doc(this.id).ref.get().then(

        (doc) => {

          if (doc.exists) {

            // Atribui dados recebidos aos campos do formularios
            this.gameForm.id = doc.id;
            this.gameForm.title = doc.data().title;
            this.gameForm.cover = doc.data().cover;
            this.gameForm.description = doc.data().description;
            this.gameForm.platform = doc.data().platform;
            this.gameForm.media = doc.data().media;
            this.gameForm.date = doc.data().date;


          } else {
            // AVISO
            alert('Documento não existe!\nClique em [Ok] para continuar');

            // Redireciona para a listagem
            this.router.navigate(['/list']);
          }

        }

      ).catch(
        // Mensagem de erro do console
        (error) => {
          console.error('Falha ao obter documento: ' , error);
        }


      );


    }






    // Responsividade da ajuda (aside)
    $(document).ready(() => {
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

      // Em caso de erro ao gravar....
      .catch((err) => {

        // Exibe erros no console
        console.error('Erro na gravação de dados: ' + err);

      });

      // Se tem um id, está editando documento existente

    } else {

      // console.log('Editando', this.gameForm);

      this.db.collection<any>('games').doc(this.id).set(

        // Obtém os dados do formulario e atribui ao documento do Firestore

        {
          title: this.gameForm.title,
          cover: this.gameForm.cover,
          description: this.gameForm.description,
          platform: this.gameForm.platform,
          media: this.gameForm.media,
          date: this.gameForm.date,
        }



      ).then( () => {
      // se atualizou o documento
      alert(`"${this.gameForm.title}" atualizado com sucesso!\n\nClique em [Ok] para continuar.`);

      // Listagem de jogos

      this.router.navigate(['/list']);



      }

      ).catch(

        // Exibe error no console
        (error) => {
          console.error('Falha ao atualizar Db:', error);
        });



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
