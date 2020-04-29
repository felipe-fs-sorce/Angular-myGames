import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Modelagem dos dados
export interface Game {
  cover: string;
  date: string;
  description: string;
  media: string;
  platform: string;
  title: string;
}

// Modelagem com o Id do documento
export interface GameId extends Game {
  id: string;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  // Atributos

  // Obtém a coleção do Firestore, conforme o modelo acima
  private gameCollection: AngularFirestoreCollection<Game>;

  // objeto games é tipo assincrno que vai receber os dados Db
  games: Observable<GameId[]>;

  // Campo que será usado para ordenação dos dados
  orderBy: string;

  // Direção da ordenação dos dados (ascendente ou descendente)
  orderDr: any;

  constructor(private db: AngularFirestore) {

    // Ordena pelo titulo ao carregar
    this.orderBy = "title";

    // Em ordem ascendente ao carregar
    this.orderDr = "asc";

  }

  ngOnInit(): void {

    // Atualiza a lista de games
    this.getList();

  }

  getList() {
    // Referencia aos documentos da coleção 'games'
    this.gameCollection = this.db.collection<Game>('games', ref => ref.orderBy(this.orderBy, this.orderDr));

    // Obtém os documento de coleção
    this.games = this.gameCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Game;
        const id = a.payload.doc.id;

        // Retorna os documentos quando eles forem obtidos
        return { id, ...data };
      }))
    );

  }

  // Alterar o campo usado para ordenar a listagem
  changeOrderField(field: string) {

    if (this.orderBy !== field) { //Se o campo selecionado é diferente do atual
      this.orderBy = field; // Muda o valor do campo
      this.getList(); // Atualizar a listagem com o novo parametro
    }

    return false; // Sai sem fazer nada

  }


  changeOrderDir(direction: any) {

    if (this.orderDr !== direction) { //Se o campo selecionado é diferente do atual
      this.orderDr = direction; // Muda o valor do campo
      this.getList(); // Atualizar a listagem com o novo parametro

    }

    return false; // Sai sem fazer nada

  }

  // Apagar o jogo
  deleteGame(gamekey, gameTitle) {

    // Mensagem para confimar se deseja apagar (Observe o ! = Not)
    if(!confirm(`Ooops!\nTem certeza que deseja apagar esse jogo "${gameTitle}" testa coleção?`)) {
      return false;
    }

    this.db.collection('games').doc(gamekey).delete()
    .then (res => {
      alert(`"${gameTitle}" foi apagado da sua coleção!\nClique em [ok] para continuar.`);
    })
    .catch(err => {
      console.error(`Falha ao apagar: $[err]`);
    });




    return false;
  }

}
