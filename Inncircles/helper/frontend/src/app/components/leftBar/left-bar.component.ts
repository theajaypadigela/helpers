import { Component, computed, Input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarService } from '../../services/avatar.service';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { GetHelperDetailsService } from '../../services/get-helper-details.service';
import { signal } from '@angular/core';
import { effect } from '@angular/core';
import { Helper } from '../../types/helper.interface';

@Component({
  selector: 'app-left-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './left-bar.component.html',
  styleUrls: ['./left-bar.component.scss']
})
export class LeftBarComponent {
    constructor(private avatarService: AvatarService, private router: Router, private helpersDetails: GetHelperDetailsService) {
   
    effect(() => {
      const currentHelpers = this.helpersDetails.helpers();
      // console.log('Helpers updated in left-bar:', currentHelpers.length);
    });
  }

  
  // helpers = computed(() => this.helpersDetails.helpers());

  @Input() helpers: Signal<Helper[]> = signal([]);

  getAvatarUrl(helper: any): string {
    if (!helper.image || helper.image === 'null' || helper.image.trim() === '') {
      return this.avatarService.generateAvatarUrl(helper.fullname || 'Unknown');
    }
    else if (typeof helper.image === 'string') {
      return this.avatarService.getAvatarImagePath(helper.image);
    }
    
    return helper.image;
  }

  onHelperClick(id: string | number) {
    this.helpersDetails.setFirstHelper(Number(id));
  }
}
