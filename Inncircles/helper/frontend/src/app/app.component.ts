import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { GetHelperDetailsService} from './services/get-helper-details.service';
import { get } from 'http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
constructor(private http: HttpClient, private getHelpers: GetHelperDetailsService) {}
  ngOnInit() {
    this.getHelpers.loadHelperDetails();
    console.log(this.getHelpers.helpers);
  }
}
