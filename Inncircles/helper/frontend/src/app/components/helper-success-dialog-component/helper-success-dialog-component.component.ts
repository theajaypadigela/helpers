import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { QRCodeModule } from 'angularx-qrcode';
import { Helper } from '../../types/helper.interface';
import { AvatarService } from '../../services/avatar.service';

@Component({
  selector: 'app-helper-success-dialog-component',
  standalone: true,
  imports: [QRCodeModule, MatDialogModule, MatButtonModule],
  templateUrl: './helper-success-dialog-component.component.html',
  styleUrl: './helper-success-dialog-component.component.scss'
})
export class HelperSuccessDialogComponentComponent {
  helper!: Helper;
  imgUrl: string = '';
  private avatarService: AvatarService;
  constructor(
    public dialogRef: MatDialogRef<HelperSuccessDialogComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string; qrCodeValue: string },
    avatarService: AvatarService
  ) {
    this.avatarService = avatarService;
    // console.log(this.data);
    this.helper = JSON.parse(this.data.qrCodeValue);
    // console.log(this.helper);
    if(this.helper.image){
      this.imgUrl = this.avatarService.getAvatarImagePath(this.helper.image as string);
    } else if(this.helper.fullname) {
      this.imgUrl = this.avatarService.generateAvatarUrl(this.helper.fullname);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
