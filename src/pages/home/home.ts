import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  selectedItem: any;
  icons: string[];
  items: Array<{ title: string, note: string, icon: string }>;
  music: MediaObject;

  constructor(public navCtrl: NavController, public media: Media, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    // Let's populate this page with some filler content for funzies
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
      'american-football', 'boat', 'bluetooth', 'build'];

    this.items = [];
    for (let i = 1; i < 11; i++) {
      this.items.push({
        title: 'Item ' + i,
        note: 'This is item #' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }
  }

  ionViewDidLoad(){
    this.music = this.media.create('https://s3.amazonaws.com/rupam-bucket-1/BashBagan.mp3');
    this.music.onStatusUpdate.subscribe(status => console.log(status)); // fires when file status changes

    this.music.onSuccess.subscribe(() => console.log('Action is successful'));

    this.music.onError.subscribe(error => console.log('Error!', error));
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    item.title = 'tapped';
    
    this.music.play();
  }

  itemKeyUp(event, item) {
    item.title = 'untapped';
    this.music.stop();
  }

}
