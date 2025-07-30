import { Component, signal, computed, effect, Input, Signal } from '@angular/core';
import { AvatarService } from '../../services/avatar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GetHelperDetailsService } from '../../services/get-helper-details.service';
import { CommonModule } from '@angular/common';
import { DeleteHelperService } from '../../services/delete-helper.service';
import { Helper } from '../../types/helper.interface';


@Component({
  selector: 'app-right-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './right-card.component.html',
  styleUrl: './right-card.component.scss'
})
export class RightCardComponent {

  getKycPdfUrl(pdf: string | File | null | undefined): string {
    if (!pdf) return '';
    if (pdf instanceof File) {
      return URL.createObjectURL(pdf);
    }
    
    let fileName = pdf;
    if (typeof pdf === 'string') {
      const parts = pdf.split(/[/\\]/);
      fileName = parts[parts.length - 1];
    } 
    return this.avatarService.getAvatarImagePath(fileName as string);
  }

   private isFile(val: unknown): val is File {
    return val instanceof File;
  }
  
  @Input() firstHelper: Signal<Helper | null> = signal(null);

  // id = signal<string | null>(null);
  // helper = signal<Helper | null>(null);
  // helper = input<Helper | null>(null);
   imgUrl = computed(() => {
    const imageVal = this.helper()?.image ?? null;
    if(imageVal == null) {
      return this.avatarService.generateAvatarUrl(this.helper()?.fullname || 'Unknown');
    }
    if (typeof imageVal === 'string' && imageVal) {
      return this.avatarService.getAvatarImagePath(imageVal);
    } else {
      return this.avatarService.generateAvatarUrl(this.helper()?.fullname || 'Unknown');
    }
  });

  helper = signal<Helper | null>(null);
  constructor(
    private avatarService: AvatarService,
    private route: ActivatedRoute,
    private router: Router,
    private helperDetailsService: GetHelperDetailsService,
    private deleteHelperService: DeleteHelperService
  ) {
    effect(() => {
      this.helper.set(this.helperDetailsService.firstHelper());
      console.log('Helper details updated:', this.helper());
    }, {allowSignalWrites: true});
  }



  // ngOnInit() {
  //   this.helper.set(this.helperDetailsService.getFirstHelper());
  // }

  handleDelete(): void {
    if (this.helper()) {
      const helperId = Number(this.helper()?.id);
      this.helperDetailsService.firstHelper.set(null);
      this.deleteHelperService.deleteHelper(helperId);
      
      this.router.navigate(['/main']);
    } else {
      console.error('No helper found to delete.');
    }
  }

  handleEdit(): void {
      if (this.helper()?.id) {
      this.router.navigate(['/add-helper', this.helper()?.id]);
    } else {
      console.error('No helper ID found for editing.');
    }
  }

}

