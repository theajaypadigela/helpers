import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { LeftBarComponent } from '../leftBar/left-bar.component';
import { GetHelperDetailsService } from '../../services/get-helper-details.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Helper } from '../../types/helper.interface';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LeftBarComponent, MatSelectModule, MatFormFieldModule, MatOptionModule, ReactiveFormsModule, FormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

  allServicesSelected = false;
  allOrganizationsSelected = false;
  searchTerm: string = '';

  constructor(private router: Router, private getHelpers:GetHelperDetailsService) {}

  helpers = signal<Helper[]>([]);
  private allHelpers: Helper[] = [];
  count = computed(() => this.helpers().length);
  totalHelpersCount: number = 0;

  ngOnInit() {
    this.getHelpers.getHelperDetails().subscribe(
      (data: any) => {
        this.allHelpers = data as Helper[];
        this.helpers.set(this.allHelpers);
        this.totalHelpersCount = this.allHelpers.length;
        console.log('Helpers loaded:', this.helpers());
      },
      (error) => {
        console.error('Error fetching helper details:', error);
      }
    );
  }

  navigateToAddHelper() {
    this.router.navigate(['/add-helper']);
  }

  showSortOptions = false;
  showFilterOptions = false;

  filterForm = new FormGroup({
    TypeOfService: new FormControl<string[]>([]),
    Organizations: new FormControl<string[]>([])
  });

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

  allServiceOptions = ['Maid', 'driver', 'gardener', 'cook', 'nurse', 'babysitter', 'painter'];
  allOrganizationOptions = ['asbl', 'spring-helpers'];

  selectAllServices() {
    this.filterForm.get('TypeOfService')?.patchValue(this.allServiceOptions);
    this.allServicesSelected = true;
  }

  deselectAllServices() {
    this.filterForm.get('TypeOfService')?.patchValue([]);
    this.allServicesSelected = false;
  }

  selectAllOrganizations() {
    this.filterForm.get('Organizations')?.patchValue(this.allOrganizationOptions);
    this.allOrganizationsSelected = true;
  }

  deselectAllOrganizations() {
    this.filterForm.get('Organizations')?.patchValue([]);
    this.allOrganizationsSelected = false;
  }

  applyFiltersAndSearch() {
    const filterValues = this.filterForm.value;
    const searchTerm = this.searchTerm.toLowerCase();

    let filteredHelpers = this.allHelpers.filter((helper: Helper) => {
      const serviceMatch = !filterValues.TypeOfService || filterValues.TypeOfService.length === 0 || filterValues.TypeOfService.some(service => service.toLowerCase() === helper.occupation.toLowerCase());
      const orgMatch = !filterValues.Organizations || filterValues.Organizations.length === 0 || filterValues.Organizations.some(org => org.toLowerCase() === helper.organisationName.toLowerCase());
      return serviceMatch && orgMatch;
    });

    if (searchTerm) {
      filteredHelpers = filteredHelpers.filter(helper =>
        helper.fullname.toLowerCase().includes(searchTerm) ||
        String(helper.id).includes(searchTerm) ||
        helper.occupation.toLowerCase().includes(searchTerm)
      );
    }

    this.helpers.set(filteredHelpers);
  }

  applyFilters() {
    this.applyFiltersAndSearch();
    this.showFilterOptions = false;
  }

  onSearch() {
    this.applyFiltersAndSearch();
  }

  resetFilters() {
    this.filterForm.reset({
      TypeOfService: [],
      Organizations: []
    });
    this.searchTerm = '';
    this.applyFiltersAndSearch();
    this.allServicesSelected = false;
    this.allOrganizationsSelected = false;
  }
}
