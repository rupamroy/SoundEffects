import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  selectedItem: any;
  path : string;
  icons: string[];
  items: Array<{ title: string, fileName: string}>;
  music: MediaObject;
  playing : boolean = false;
  musicStatus: number;

  constructor(public navCtrl: NavController, public platform: Platform, public media: Media, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.items = [
      { title: 'Sad', fileName: 'SadMusic.mp3'},
      { title: 'Mystery 1', fileName: 'Mystery1.mp3'},
      { title: 'Mystery 2', fileName: 'Mystery2.mp3'},
      { title: 'Happy', fileName: 'Happy1.mp3'}
    ]
  }

  ionViewDidLoad() {
    this.path = 'assets/sounds/';

    //android path
    if (this.platform.is('android')) {
      this.path = '/android_asset/www/assets/sounds/';
    }
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.loop(item);
  }

  itemKeyUp(event, item) {
    this.stop();
  }

  loop(item, firstRun: boolean = true) {
    if(firstRun){
      this.playing = true;
    }
    this.music = this.media.create(`${this.path}${item.fileName}`);
    this.music.onStatusUpdate.subscribe(status => {
      console.log('status: ' + status);
      this.musicStatus = status;
      setTimeout(()=> {
        if(this.playing && status === 4) {
          this.loop(item, false);
        }
      }, 400);
    }); 
    this.music.onSuccess.subscribe(() => console.log('Action is successful'));
    this.music.onError.subscribe(error => console.log('Error!', error));
    if(firstRun){
      this.music.seekTo(0); 
    } else {
      this.music.seekTo(0); // Todo this should be set to the loopStaartTime when playing in loop;
    }
    // this.music.setVolume(); // Todo set individual volume if present.
    this.music.play();
  }

  stop() {
    this.playing = false;
    if(this.musicStatus === 2) {
      this.music.stop();
    }
    this.music.release();
  }

}
