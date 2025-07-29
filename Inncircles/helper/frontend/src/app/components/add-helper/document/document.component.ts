import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-document',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent {
 
  @Input() documentForm!: FormGroup;
  @Output() nextEvent = new EventEmitter<void>();

  constructor() {
    
  }

  

 onFileChange(event: Event, type: 'pdf' | 'image'): void {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    this.documentForm.get('additionalDocument')?.setValue(file);
  } else {
    this.documentForm.get('additionalDocument')?.setValue(null);
  }
}

  next() {
    console.log("Next button clicked in DocumentComponent");
    this.nextEvent.emit();
  }
}
