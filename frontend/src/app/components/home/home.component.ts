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
  response = undefined;
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
                      this.response = res;
                    },
                    (err) => {
                      alert('Ocorreu um erro a processar o seu pedido.');
                      this.loading = false;
                      this.string = '';
                      this.response = undefined;
                    }));

  }

}
