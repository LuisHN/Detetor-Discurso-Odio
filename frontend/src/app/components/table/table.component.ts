import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit {
  public title = 'Listar By Hash';
  public strings = [];
  public hash: any = '';
  public subscriptions: Subscription[] = [];
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe())
  }

  getRequestByHash() {
    this.subscriptions.push(this.apiService.getRequestByHash(this.hash)
    .subscribe((res: any) => {
      this.strings = res.body;
    },
    err => {

    }));
  }

  setType(payload:any) {
 
  }

  remove(){
 
  }

}
