import { Component, signal, computed, effect } from '@angular/core';
import { AvatarService } from '../../services/avatar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GetHelperDetailsService } from '../../services/get-helper-details.service';
import { CommonModule } from '@angular/common';
import { DeleteHelperService } from '../../services/delete-helper.service';

interface Helper {
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
}

@Component({
  selector: 'app-right-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './right-card.component.html',
  styleUrl: './right-card.component.scss'
})
export class RightCardComponent {
  id = signal<string | null>(null);
  helper = signal<Helper | null>(null);
  imgUrl = computed(() => {
    return this.avatarService.generateAvatarUrl(this.helper()?.fullname || 'Unknown');
  });

  constructor(
    private avatarService: AvatarService,
    private route: ActivatedRoute,
    private router: Router,
    private helperDetailsService: GetHelperDetailsService,
    private deleteHelperService: DeleteHelperService
  ) {
    effect(() => {
      console.log('Helper details updated:', this.helper());
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id.set(params.get('id'));
      this.helper.set(this.helperDetailsService.helpers().find(helper => helper.id == Number(this.id())) ?? null);
    });
  }

  handleDelete(): void {
    if (this.helper()) {
      const helperId = Number(this.id());
      
      this.deleteHelperService.deleteHelper(helperId);
      
      this.helperDetailsService.helpers.update(helpers => {
        return helpers.filter(helper => helper.id !== helperId);
      });
      
      this.helper.set(null);
      this.id.set(null);
      
      console.log("Helper deleted and list updated:", this.helperDetailsService.helpers().length);
      
      this.router.navigate(['/main']);
    } else {
      console.error('No helper found to delete.');
    }
  }

}

