import { Component, signal, computed, effect } from '@angular/core';
import { AvatarService } from '../../services/avatar.service';
import { ActivatedRoute } from '@angular/router';
import { GetHelperDetailsService } from '../../services/get-helper-details.service';
import { CommonModule } from '@angular/common';
import { sign } from 'crypto';

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
    private helperDetailsService: GetHelperDetailsService
  ) {
    effect(() => {
      console.log('Helper details updated:', this.helper());
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id.set(params.get('id'));
      this.helper.set(this.helperDetailsService.helpers.find(helper => helper.id == Number(this.id())) ?? null);
    });
  }

}

