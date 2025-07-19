import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { LeftBarComponent } from '../leftBar/left-bar.component';
import { GetHelperDetailsService } from '../../services/get-helper-details.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LeftBarComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

  constructor(private router: Router, private getHelpers:GetHelperDetailsService) {}

  navigateToAddHelper() {
    this.router.navigate(['/add-helper']);
  }

  showSortOptions = false;
  showFilterOptions = false;

  toggleSortMenu() {
    this.showSortOptions = !this.showSortOptions;
  }

  sortById() {
    this.getHelpers.sortHelpersById();
    this.showSortOptions = false;
  }

  sortByName() {
    this.getHelpers.sortHelpersByName();
    this.showSortOptions = false;
  }

  toggleFilterMenu() {
    this.showFilterOptions = !this.showFilterOptions;
  }

}
