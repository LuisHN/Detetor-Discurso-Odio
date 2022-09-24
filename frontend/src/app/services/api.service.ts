import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getRequest(){
    return this.http.get(`https://api.dadol.pt/classificador`, {...this.httpOptions,   observe: 'response'}) ;
  }

  getRequestByHash(hash: string) {
    return this.http.get(`https://api.dadol.pt/extensao/${hash}`);
  }

  postRequest( body:any){
    return this.http.post(`https://api.dadol.pt/classificador`, body,  {...this.httpOptions,   observe: 'response'}) ;
  }

  putRequest( body:any, id:any){
    return this.http.put(`https://api.dadol.pt/classificador/${id}`, body,  {...this.httpOptions,   observe: 'response'}) ;
  }

  deleteRequest( id:any){
    return this.http.delete(`https://api.dadol.pt/classificador/${id}`,  {...this.httpOptions,   observe: 'response'}) ;
  }
}
