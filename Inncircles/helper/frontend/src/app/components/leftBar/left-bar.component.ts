import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarService } from '../../services/avatar.service';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { GetHelperDetailsService } from '../../services/get-helper-details.service';

@Component({
  selector: 'app-left-bar',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.scss']
})
export class LeftBarComponent {
    constructor(private avatarService: AvatarService, private router: Router, private http: HttpClient, private helpersDetails: GetHelperDetailsService) {}

  helpers: any[] = [];
  ngOnInit() {
    this.helpersDetails.getHelperDetails().subscribe(data => {
      this.helpers = data as any[];
    });
  }
  getAvatarUrl(helper: any): string {

    if (!helper.image || helper.image === 'null' || helper.image.trim() === '') {
      return this.avatarService.generateAvatarUrl(helper.fullname || 'Unknown');
    }
    
    return helper.image;
  }
  onHelperClick(id: string | number) {

    this.router.navigate(['/main/helpers', id]);
    // console.log('Helper clicked:', id);
  }
}
