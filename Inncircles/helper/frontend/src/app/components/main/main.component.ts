import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { LeftBarComponent } from '../leftBar/left-bar.component';
import { GetHelperDetailsService } from '../../services/get-helper-details.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Helper } from '../../types/helper.interface';
import { RightCardComponent } from '../right-card/right-card.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LeftBarComponent, MatSelectModule, MatFormFieldModule, MatOptionModule, ReactiveFormsModule, FormsModule, RightCardComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

  allServicesSelected = false;
  allOrganizationsSelected = false;
  searchTerm: string = '';
  firstPersonId = signal<number | null>(null);

  private allHelpers = signal<Helper[]>([]);
  helpers = signal<Helper[]>([]);
  count = computed(() => this.helpers().length);
  totalHelpersCount = computed(() => this.allHelpers().length);
  firstHelper = signal<Helper | null>(null);
  
  constructor(private router: Router, public getHelpers: GetHelperDetailsService) {
    this.loadHelpers();

    effect(() => {
      const updated = this.getHelpers.helpers();
      this.helpers.set(updated);
      this.firstHelper.set(updated[0]);
      this.firstPersonId.set(updated.length > 0 ? updated[0].id : null);
      // console.log('First helper updated in main component:', this.firstHelper());
      // console.log('Helpers updated in main component:', this.helpers());
      // this.loadRightHelper(this.firstPersonId());
      this.allHelpers.set(updated);
    }, { allowSignalWrites: true });
  }

  // loadRightHelper(id: number | null = null) {
  //   console.log('Loading right helper with ID:', id);
  //   if(id) {
  //     this.router.navigate(['main/helpers', id]);
  //   }
  // }

  loadHelpers() {
    this.getHelpers.getHelperDetails().subscribe((helpers: Helper[]) => {
      this.helpers.set(helpers);
      this.allHelpers.set(helpers);
      this.firstHelper.set(this.getHelpers.getFirstHelper());
      this.firstPersonId.set(helpers.length > 0 ? helpers[0].id : null);
      // console.log('Helpers updated in main component:', this.helpers());
    });
    // this.loadRightHelper(this.firstPersonId());
    
  }


  ngOnInit() {
    this.getHelpers.loadHelperDetails();
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
    const sortedHelpers = [...this.helpers()].sort((a, b) => a.id - b.id);
    this.helpers.set(sortedHelpers);
    // this.getHelpers.helpers.set(sortedHelpers);
    this.getHelpers.firstHelper.set(sortedHelpers[0]);
    this.firstPersonId.set(sortedHelpers.length > 0 ? sortedHelpers[0].id : null);
    this.showSortOptions = false;
    // this.loadRightHelper(this.firstPersonId());
  }

  sortByName() {
    const sortedHelpers = [...this.helpers()].sort((a, b) => a.fullname.localeCompare(b.fullname));
    this.helpers.set(sortedHelpers);
    // this.getHelpers.helpers.set(sortedHelpers);
    this.getHelpers.firstHelper.set(sortedHelpers[0]);
    this.firstPersonId.set(sortedHelpers.length > 0 ? sortedHelpers[0].id : null);
    this.showSortOptions = false;
    // this.loadRightHelper(this.firstPersonId());
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

    let filteredHelpers = this.getHelpers.helpers().filter((helper: Helper) => {
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
    this.getHelpers.firstHelper.set(filteredHelpers[0]);
    // this.count.set(filteredHelpers.length);
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
    this.getHelpers.loadHelperDetails();
    this.allServicesSelected = false;
    this.allOrganizationsSelected = false;
  }
}
