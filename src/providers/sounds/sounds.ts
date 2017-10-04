import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { File } from '@ionic-native/file';
import { Platform } from 'ionic-angular';

export interface ISound {
  title: string,
  fileName: string,
  fadeOutTime?: number,
  loopDisabled?: boolean
}

@Injectable()
export class SoundsProvider {
  public sounds: ISound[];
  private soundFile: string;
  constructor(public file: File, public platform: Platform) {
    this.soundFile = 'sounds.json';
    this.initialize();
  }

  initialize() {
    this.platform.ready().then(()=> {
      this.checkAndCreateFile();
    }).catch((err) => {
      console.log("Error sounds platform ready....\n");
      console.error(err);
    });
  }

  checkAndCreateFile(){
    // let soundsFileExists = this.file.checkFile(this.soundFile, this.file.dataDirectory);
    // soundsFileExists.then((exists) => {
    //   if (exists) {
    //     this.file.readAsText(this.file.dataDirectory, this.soundFile).then((fileText) => {
    //       this.sounds = JSON.parse(fileText) as ISound[];
    //     }).catch((err) => {
    //       console.log(err);
    //     });
    //   }
    //   else {
    //     this.seed();
    //     this.writeFile();
    //   }
    // }).catch((err)=> {
    //   console.log("Error Home sound file exists ready....\n");
    //   console.log(err);
    // });
    this.seed();
  }

  writeFile() {
    let fileWritten = this.file.writeFile(this.file.dataDirectory,
      this.soundFile, JSON.stringify(this.sounds), { replace: true });
    fileWritten.then(() => {
      console.log("File written.");
    }).catch((err) => {
      console.error(err);
    });
  }

  seed() {
    this.sounds = [
      { title: 'Uklele', fileName: 'Uklele.mp3', loopDisabled: true},
      { title: 'Phone', fileName: 'Phone.mp3', loopDisabled: true },
      { title: 'Happy', fileName: 'Happy1.mp3', loopDisabled: true },
      { title: 'Bash Bagan', fileName: 'BashBagan.mp3' },
      { title: 'Booter Raja', fileName: 'BhooterRaja.mp3' },
      { title: 'Plane Landing', fileName: 'PlaneLanding.mp3', loopDisabled: true },
      { title: 'Tense', fileName: 'Suspense.mp3' },
    ]
  }

}
