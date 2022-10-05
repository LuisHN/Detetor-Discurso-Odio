import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  title = 'Plataforma de deteção automática de discurso de ódio em Lingua Portuguesa';
  string = '';
  loading = false;
  subs:any = [];
  response: any = undefined;
  display = 'none';
  hideClassificador = true;
  step = 1;
  type = '';
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subs.forEach((sub:any) => {
      sub.unsubscribe();
    })
  }

  classifyString()  {
    this.loading = true;
    this.subs.push(this.apiService.postRequest({string: this.string})
                    .subscribe((res: any) => {
                      this.loading = false;
                      this.string = '';
                      this.response = res.body;
                      this.hideClassificador = false;
                    },
                    (err) => {
                      alert('Ocorreu um erro a processar o seu pedido.');
                      this.loading = false;
                      this.string = '';
                      this.response = undefined;
                      this.hideClassificador = true;
                    }));

  }

  getClassificationLabel(classification: any) { 
    if (classification == 0 || classification == 1) {
      return (classification == 1) ? 'Discurso de ódio' : 'Discurso normal'
    }
    return 'Resultados pendentes. Consulte mais tarde la tab lista Hash.'
  }

  setType(payload: any) {
    payload['isOwner']  = 1;
    this.subs.push(this.apiService.putRequest(payload)
        .subscribe((res:any) => { 
          alert("Classificado com sucesso");
          this.hideClassificador = true;
        },
            err=> { 
               alert("Ocorreu um erro. tente novamente")
            }))
  }

  remove(id: any){ 
    this.subs.push(this.apiService.deleteRequest(id, 1)
        .subscribe((res:any) => { 
          alert("Removido com sucesso");
          this.hideClassificador = true;
            },
            err=> { 
              alert("Ocorreu um erro. tente novamente")
            }))
  }

}
