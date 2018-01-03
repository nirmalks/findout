import { Component , NgZone } from '@angular/core';
import { Platform ,NavController } from 'ionic-angular';
import { Camera , CameraOptions } from '@ionic-native/camera';
import  Clarifai  from 'clarifai';
import { clarifaiKey } from '../../../api-config';
import { Observable } from 'rxjs';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  app = new Clarifai.App({
    apiKey: clarifaiKey
  });

  outputs: Array<any> ;

  constructor(public navCtrl: NavController , private camera : Camera , private zone:NgZone) {

  }

  ionViewWillEnter(){
    this.takeImage();
  }

  takeImage():any{
    this.camera.getPicture(this.options).then((imageData) => {

      Observable.fromPromise(this.app.models.predict(Clarifai.GENERAL_MODEL , {base64: imageData} , { maxConcepts: 3 }))
      .subscribe(
        (response:any) => {
          console.log(response)
          if(response.status.code === 10000) {
            //success
            this.zone.run(() => {
              // some code
              this.outputs = response.outputs[0].data.concepts;
            });
            console.log(this.outputs)
          }
        } ,
        err => console.log(err),
      );
     }, (err) => {
      // Handle error
     });
  }
}
