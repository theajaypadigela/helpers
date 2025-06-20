import { Component, signal, computed } from '@angular/core';
import { AvatarService } from '../../services/avatar.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-right-card',
  standalone: true,
  imports: [],
  templateUrl: './right-card.component.html',
  styleUrl: './right-card.component.scss'
})
export class RightCardComponent {
  id = signal<number>(0);
  constructor(private avatarService: AvatarService,private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.id.set(+params['id'] || 0);
    });
  }

  helpers = [
    {
      id: 1,
      name: 'John Smith',
      occupation: 'Plumber',
      households: 12,
      image: null,
      employeeId: 'EMP001',
      gender: 'Male',
      language: 'English',
      mobileNo: '1234567890',
      emailId: 'john.smith@email.com',
      type: 'Full-time',
      organization: 'ABC Services',
      joinedOn: '2022-01-15'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      occupation: 'Electrician',
      households: 8,
      image: null,
      employeeId: 'EMP002',
      gender: 'Female',
      language: 'English',
      mobileNo: '2345678901',
      emailId: 'sarah.johnson@email.com',
      type: 'Part-time',
      organization: 'XYZ Electric',
      joinedOn: '2023-03-10'
    },
    {
      id: 3,
      name: 'Mike Brown',
      occupation: 'Carpenter',
      households: 15,
      image: null,
      employeeId: 'EMP003',
      gender: 'Male',
      language: 'Spanish',
      mobileNo: '3456789012',
      emailId: 'mike.brown@email.com',
      type: 'Contract',
      organization: 'WoodWorks',
      joinedOn: '2021-07-22'
    },
    {
      id: 4,
      name: 'Lisa Davis',
      occupation: 'Cleaner',
      households: 20,
      image: null,
      employeeId: 'EMP004',
      gender: 'Female',
      language: 'Hindi',
      mobileNo: '4567890123',
      emailId: 'lisa.davis@email.com',
      type: 'Full-time',
      organization: 'CleanCo',
      joinedOn: '2020-11-05'
    },
    {
      id: 5,
      name: 'David Wilson',
      occupation: 'Gardener',
      households: 6,
      image: null,
      employeeId: 'EMP005',
      gender: 'Male',
      language: 'Tamil',
      mobileNo: '5678901234',
      emailId: 'david.wilson@email.com',
      type: 'Part-time',
      organization: 'GreenThumb',
      joinedOn: '2024-02-18'
    }
  ];
  helper = computed(() => this.helpers.find(h => h.id === this.id()) || this.helpers[0]);
  // helper: any = this.helpers[this.id];
  
  getAvatarUrl(id: number): string {
    const helper = this.helpers.find(h => h.id === id);
    if (!helper) {
      return '';
    }
    if (!helper.image || helper.image === 'null') {
      return this.avatarService.generateAvatarUrl(helper.name);
    }
      return helper.image;
  }
}

