import { Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-document',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule, MatIconModule ],
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnDestroy {
 
  @Input() documentForm!: FormGroup;
  @Output() nextEvent = new EventEmitter<void>();
  
  documentPreviewUrl: string | null = null;

  constructor() {
    
  }

  

 onFileChange(event: Event, type: 'pdf' | 'image'): void {
  const fileInput = event.target as HTMLInputElement;
  console.log(fileInput.files?.[0]);
  if (fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    console.log('Selected file:', file);
    this.documentForm.get('additionalDocument')?.setValue(file);
    
    // Set preview URL for PDF files
    if (type === 'pdf' && file.type === 'application/pdf') {
      this.documentPreviewUrl = URL.createObjectURL(file);
    }
  } else {
    this.documentForm.get('additionalDocument')?.setValue(null);
    this.documentPreviewUrl = null;
  }
}

  next() {
    console.log("Next button clicked in DocumentComponent");
    this.nextEvent.emit();
  }

  ngOnDestroy(): void {
    // Clean up blob URL to prevent memory leaks
    if (this.documentPreviewUrl) {
      URL.revokeObjectURL(this.documentPreviewUrl);
    }
  }
}
