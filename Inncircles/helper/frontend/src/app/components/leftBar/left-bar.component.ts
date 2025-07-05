import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarService } from '../../services/avatar.service';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { GetHelperDetailsService } from '../../services/get-helper-details.service';
import { signal } from '@angular/core';
import { effect } from '@angular/core';

interface Helper {
  _id?: string;
  id: number;
  occupation: string;
  organisationName: string;
  fullname: string;
  languages: string[];
  gender: string;
  phone: string;
  email: string;
  vehicleType: string;
  joinedOn?: string;
  households?: number;
}

@Component({
  selector: 'app-left-bar',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.scss']
})
export class LeftBarComponent {
    constructor(private avatarService: AvatarService, private router: Router, private http: HttpClient, private helpersDetails: GetHelperDetailsService) {
   
    effect(() => {
      const currentHelpers = this.helpersDetails.helpers();
      console.log('Helpers updated in left-bar:', currentHelpers.length);
    });
  }

  
  helpers = computed(() => this.helpersDetails.helpers());

  ngOnInit() {
    this.helpersDetails.loadHelperDetails();
  }

  getAvatarUrl(helper: any): string {
    if (!helper.image || helper.image === 'null' || helper.image.trim() === '') {
      return this.avatarService.generateAvatarUrl(helper.fullname || 'Unknown');
    }
    
    return helper.image;
  }

  onHelperClick(id: string | number) {
    this.router.navigate(['/main/helpers', id]);
  }
}
