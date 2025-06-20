import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarService } from '../../services/avatar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-left-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.scss']
})
export class LeftBarComponent {
    constructor(private avatarService: AvatarService, private router: Router) {}
     helpers = [
    {
      id: 1,
      name: 'John Smith',
      occupation: 'Plumber',
      households: 12,
      image: null
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      occupation: 'Electrician',
      households: 8,
      image: null
    },
    {
      id: 3,
      name: 'Mike Brown',
      occupation: 'Carpenter',
      households: 15,
      image: null
    },
    {
      id: 4,
      name: 'Lisa Davis',
      occupation: 'Cleaner',
      households: 20,
      image: null
    },
    {
      id: 5,
      name: 'David Wilson',
      occupation: 'Gardener',
      households: 6,
      image: null
    }
  ];
  getAvatarUrl(helper: any): string {

    if (!helper.image || helper.image === 'null' || helper.image.trim() === '') {
      return this.avatarService.generateAvatarUrl(helper.name);
    }
    
    return helper.image;
  }
  onHelperClick(id: string | number) {

    this.router.navigate(['/main/helpers', id]);
    console.log('Helper clicked:', id);
  }
}
