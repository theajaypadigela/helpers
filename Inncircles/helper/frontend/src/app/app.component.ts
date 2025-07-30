import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { GetHelperDetailsService} from './services/get-helper-details.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
constructor( private getHelpers: GetHelperDetailsService) {}
  ngOnInit() {
    this.getHelpers.loadHelperDetails();
  }
}
