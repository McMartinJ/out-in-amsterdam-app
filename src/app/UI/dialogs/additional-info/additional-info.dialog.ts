import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Venue} from '../../../models/venue.model';

@Component({
  selector: 'app-additional-info',
  templateUrl: './additional-info.dialog.html',
  styleUrls: ['./additional-info.dialog.css']
})
export class AdditionalInfoDialog implements OnInit {

  adress: string;
  city: string;
  zipcode: string;

  constructor(public dialogRef: MatDialogRef<AdditionalInfoDialog>,
              @Inject(MAT_DIALOG_DATA) public data: [Venue, number]) {
    this.adress = data[0].location.adress;
    this.city = data[0].location.city;
    this.zipcode = data[0].location.zipcode;
  }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  showOnMap() {
    this.dialogRef.close(this.data[0]);
  }

  getVideoId(url: string) {
    const videoSource = new URL(url);
    return videoSource.searchParams.get('v');
  }
}
