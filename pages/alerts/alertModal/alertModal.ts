import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, LoadingController, ToastController, } from 'ionic-angular';
import { ModalController } from 'ionic-angular';

import { MyAppProvider } from '../../../services/myAppProvider';
import { MysqlService } from '../../../services/mysql.service';

import { AlertListPage } from '../alertList/alertList';
import { TabsPage } from '../../tabs/tabs';

import Swal from 'sweetalert2';

@Component({
  selector: 'page-alertModal',
  templateUrl: 'alertModal.html',
  styleUrls: ['alertModal.scss', '../../../theme/variables.scss']
})
export class AlertModalPage {

  alertDashboard: string = "video";
  public alert = {};
  public myreturnvalue;
  public loading;
  public comment = "";

  public VideoOrPic = false;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, private dbService: MysqlService, public loadingCtrl: LoadingController, public myApp: MyAppProvider, public toastCtrl: ToastController) {

    //    console.log("Fetching Nav aparams from Modal");

    this.alert = this.navParams.get("alert");
    // console.log("Check if video or pic");
    // console.log(this.alert.filename.includes('.mp4'));
    this.VideoOrPic = this.alert.filename.includes('.mp4')

    if (this.VideoOrPic) {
      this.alertDashboard = "video";
    } else {
      this.alertDashboard = "pic";
    }

    //  console.log(this.alert);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      content: 'Loading Data, please wait..',
    });
    return await this.loading.present();
  }

  showToast() {
    const toast = this.toastCtrl.create({
      message: 'Alert Info Updated...',
      duration: 3000
      // showCloseButton: true,
      // closeButtonText: 'Ok'
    });
    toast.present();
    // toast.onDidDismiss(() => {
    // console.log('Dismissed toast');
    // // this.goToHomePage();
    // });
  }

  updateAlertStatus(status, alert) {
    this.presentLoading();
    console.log("update pi_heartbeats set status = '" + status + "', comments = '" + alert.comments + "' where id = " + this.alert.id);

    this.dbService.fetchDataV2("update pi_heartbeats set status = '" + status + "', comments = '" + alert.comments + "' where id = " + this.alert.id)
      .map(res => res.json())
      .subscribe(res => {

        this.loading.dismiss();
        this.myApp.openCount = 0;
        this.myApp.acceptedCount = 0;
        this.myApp.rejectedCount = 0;
        this.myApp.investigateCount = 0;

        this.navCtrl.pop();
        // alert("Updated!");
        this.showToast();

      }, error => {
        //alert("FAILED, to fetch from php : "+ error);
        this.myreturnvalue = "Error : " + error + " (Report to IT Support)";

        Swal.fire({
          title: 'Failed to Update',
          text: this.myreturnvalue,
          type: 'error',
          confirmButtonText: 'Close'
        });


        console.log(this.myreturnvalue)
        this.loading.dismiss();
        // this.update();
      });
  }

  seeValue(display) {
    console.log(display);
  }

}