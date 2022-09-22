import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from './services/api.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  component = 'home';

  constructor(private route: ActivatedRoute) {
    this.route.fragment.subscribe((fragment: any) => {
      if (!fragment) fragment = 'home'
      this.component = fragment;
  })
  }

}
