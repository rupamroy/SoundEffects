import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';
import { SoundsProvider, ISound } from '../../providers/sounds/sounds';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  selectedItem: any;
  path: string;
  icons: string[];
  items: Array<ISound>;
  music: MediaObject;
  playing: boolean = false;
  musicStatus: number;

  constructor(public navCtrl: NavController, public platform: Platform, public toastCtrl: ToastController,
    public media: Media, public navParams: NavParams, public sounds: SoundsProvider) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
  }

  ionViewDidLoad() {
    try {
      this.path = 'assets/sounds/';

      this.platform.ready().then(() => {
        this.items = this.sounds.sounds;
        //android path
        if (this.platform.is('android')) {
          this.path = '/android_asset/www/assets/sounds/';
        }
      }).catch((err) => {
        console.log("Error Home platform ready....\n");
        console.error(err);
      });

      // add insomnia
    }
    catch (err) {
      this.handleError(err);
    }

  }

  ionicViewWillLeave() {
    // add insomnia
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.loop(item);
  }

  itemKeyUp(event, item) {
    this.stop(item);
  }

  loop(item, firstRun: boolean = true) {
    try {
      if (firstRun) {
        if (!this.playing)
          this.playing = true;
        else
          return;
      }
      this.music = this.media.create(`${this.path}${item.fileName}`);
      this.music.onStatusUpdate.subscribe(status => {
        console.log('status: ' + status);
        this.musicStatus = status;
        setTimeout(() => {
          if (this.playing && status === 4 && !item.loopDisabled) {
            this.loop(item, false);
          } else {
            this.playing = status === 4 ? false : this.playing;
          }
        }, 10);
      });
      this.music.onSuccess.subscribe(() => console.log('Action is successful'));
      this.music.onError.subscribe(error => console.log('Error!', error));
      if (firstRun) {
        this.music.seekTo(0);
      } else {
        this.music.seekTo(0); // Todo this should be set to the loopStaartTime when playing in loop;
      }
      // this.music.setVolume(); // Todo set individual volume if present.
      this.music.play();
    } catch (err) {
      this.handleError(err);
    }
  }

  stop(item) {
    try {
      if (this.musicStatus === 2) {
        if (item.fadeOutTime) {
          let stopTime = item.fadeOutTime;;
          let intervalStartTime = 0;
          let intervalTime = 500;
          let volume = 1.0;
          let stopInterval = setInterval(() => {
            if (intervalStartTime >= stopTime) {
              this.music.stop();
              this.music.release();
              this.playing = false;
              clearInterval(stopInterval);
            } else {
              volume = Math.abs(volume - (intervalTime / stopTime));
              this.music.setVolume(volume);
            }
            intervalStartTime = intervalStartTime + intervalTime;
          }, intervalTime)
        } else {
          this.music.stop();
          this.music.release();
          this.playing = false;
        }
      }
    } catch (err) {
      this.handleError(err);
    }
  }

  reset() {
    try {
      this.music.stop();
      this.music.release();
    } catch (err) {
      this.handleError(err);
    }
  }

  handleError(error: Error) {
    let toast = this.toastCtrl.create({
      message: error.message,
      duration: 5000
    });
    toast.present();
  }
}
