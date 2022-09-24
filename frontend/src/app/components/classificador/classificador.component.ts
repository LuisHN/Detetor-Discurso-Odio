import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-classificador',
  templateUrl: './classificador.component.html'
})
export class ClassificadorComponent implements OnInit {

  title = 'Classificador';
  frase:any;

  subs:any = []

  lock:boolean = true;
  msg = 'Não existem mais frases neste momento';

  constructor(private apiService: ApiService) {
    this.getNew()
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy() {
    this.subs.forEach((sub:any) => {
      sub.unsubscribe();
    })
  }

  setType(payload:any) {
    this.lock = true;
    payload['id'] = this.frase.id;
    this.subs.push(this.apiService.putRequest(payload)
        .subscribe((res:any) => {
          this.getNew();
        },
            err=> {
          this.lock = false;
               alert("Ocorreu um erro. tente novamente")
            }))
  }

  remove(){
    this.lock = true;
    this.subs.push(this.apiService.deleteRequest(this.frase.id,0)
        .subscribe((res:any) => {
              this.getNew();
            },
            err=> {
              this.lock = false;
              alert("Ocorreu um erro. tente novamente")
            }))
  }

  getNew() {
    this.subs.push(this.apiService.getRequest()
        .subscribe((res:any) => { 
            this.frase = res.body;
            this.msg = ''; 
        },
        (err) => {
          this.msg = "Não existem mais frases neste momento";
        })
        )
  }
}
