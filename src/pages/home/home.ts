import { Component , NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera , CameraOptions } from '@ionic-native/camera';
import  Clarifai  from 'clarifai';
import { clarifaiKey } from '../../../api-config';
import { Observable } from 'rxjs';
import { LoadingController } from 'ionic-angular';
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
  loader: any;
  constructor(public navCtrl: NavController , private camera : Camera , private zone:NgZone , public loading: LoadingController) {
     this.loader = this.loading.create({
      spinner:'bubbles',
      content: 'Obtaining Results...',
    });
  }

  ionViewWillEnter(){
    this.takeImage();
  }

  takeImage():any{
    this.camera.getPicture(this.options).then((imageData) => {
      this.loader.present();
      Observable.fromPromise(this.app.models.predict(Clarifai.GENERAL_MODEL , {base64: imageData} , { maxConcepts: 3 }))
      .subscribe(
        (response:any) => {
          console.log(response)
          if(response.status.code === 10000) {
            this.zone.run(() => {
              this.outputs = response.outputs[0].data.concepts;
              this.loader.dismiss();
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
