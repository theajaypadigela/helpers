import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { LeftBarComponent } from '../leftBar/left-bar.component';
import { RightCardComponent } from '../right-card/right-card.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, LeftBarComponent, RightCardComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

  constructor(private router: Router) {}

  navigateToAddHelper() {
    this.router.navigate(['/add-helper']);
  }

}
