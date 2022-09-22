import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  title = 'Plataforma de deteção automática de discurso de ódio em Lingua Portuguesa';
  constructor() { }

  ngOnInit(): void {
  }

}
