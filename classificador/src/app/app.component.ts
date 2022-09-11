import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  title = 'Classificador';
  frase:any;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  subs:any = []

  lock:boolean = true;

  constructor(private http: HttpClient) {
    this.getNew()
  }

  ngOnDestroy() {
    this.subs.forEach((sub:any) => {
      sub.unsubscribe();
    })
  }

  setType(payload:any) {
    this.lock = true;
    this.subs.push(this.putRequest(payload, this.frase.id)
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
    this.subs.push(this.deleteRequest(this.frase.id)
        .subscribe((res:any) => {
              this.getNew();
            },
            err=> {
              this.lock = false;
              alert("Ocorreu um erro. tente novamente")
            }))
  }

  getNew() {
    this.subs.push(this.getRequest()
        .subscribe((res:any) => {
          if(res.body.length > 0)
            this.frase = res.body[0]
          else {
            alert("Não existem mais frases neste momento")
          }
        }))
  }

  private getRequest(){
    return this.http.get(`https://api.dadol.pt/classificador/limit/1`, {...this.httpOptions,   observe: 'response'}) ;
  }

  private putRequest( body:any, id:any){
    return this.http.put(`https://api.dadol.pt/classificador/${id}`, body,  {...this.httpOptions,   observe: 'response'}) ;
  }

  private deleteRequest( id:any){
    return this.http.delete(`https://api.dadol.pt/classificador/${id}`,  {...this.httpOptions,   observe: 'response'}) ;
  }
}
