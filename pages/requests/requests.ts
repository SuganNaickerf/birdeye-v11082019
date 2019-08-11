import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import "rxjs/add/operator/map";

import {MyAppProvider} from '../../services/myAppProvider';
import { MysqlService } from '../../services/mysql.service';

import { AlertModalPage } from '../alerts/alertModal/alertModal';
//import { UpdateVehiclePage } from '../../updateVehicle/updateVehicle';
//import { AddVehiclePage } from '../../addVehicle/addVehicle';

import { Observable, Subscription } from 'rxjs/Rx';
import 'rxjs/add/observable/interval';

@Component({
  selector: 'page-requests',
  templateUrl: 'requests.html',
  styleUrls: [ 'requests.scss', '../../theme/variables.scss' ]
})
export class RequestsPage {

  alertDashboard: string = "open";
  public myreturnvalue;
  public loading;
  public requests = [];
  public fleetImages: any;
  public dummyAlert = [];

  public firstrun=false;
  public isPaused=false;

  countDown;
  currentlyBusy = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private dbService: MysqlService,
    private myApp: MyAppProvider
  ) {

    //Schedule automated fetch
    this.myTimer()

  }


myTimer() {
   
   
    this.countDown = Observable.timer(0, 60000)
      .subscribe(x => {
        console.log("Timer-executed...");
        if(!this.currentlyBusy){
        this.getRequests();
        console.log("Fetching Data");
        }
      });

  }

  // goToAddVehiclePage(){
  //   this.navCtrl.push(AddVehiclePage);
  // }

  goToAlertModal(request) {

    console.log("Opening Alert Modal");
    this.navCtrl.push(AlertModalPage, {alert: request});

  }

 ionViewDidEnter(){
   
   console.log("ionViewDidEnter")
   if (!this.currentlyBusy){
     this.getRequests();
    }
 }

  getRequests(){

    this.isPaused=false;
    this.currentlyBusy=true;

    //If 1st run show loading box
    if (!this.firstrun){
          this.presentLoading();
    } 

console.log("SELECT ph.*, ROUND(ph.freemem, 0) AS roundedMem, pu.Client_Name from pi_heartbeats ph, pi_units pu where ph.cpuserial = pu.cpuserial and ph.alertType like '%Request%' and date(hdatetime)=DATE(NOW()) and pu.Client_Name = '" + this.myApp.user.Client_Name + " and date(hdatetime)=DATE(NOW())' order by id desc limit 100");

    this.dbService.fetchDataV2("SELECT ph.*, ROUND(ph.freemem, 0) AS roundedMem, pu.Client_Name from pi_heartbeats ph, pi_units pu where ph.cpuserial = pu.cpuserial and ph.alertType like '%Request%'  and date(hdatetime)=DATE(NOW()) and pu.Client_Name = '" + this.myApp.user.Client_Name + " ' order by id desc limit 100")

      .map(res => res.json())
      .subscribe(res => {

        this.isPaused=true;
        if (!this.firstrun){
          this.loading.dismiss();
          this.firstrun=true;
        }

        this.requests=res.data;
        this.dummyAlert = this.requests;
        
        //this
        //console.log(this.requests);

        this.myApp.openCount = 0;
        this.myApp.acceptedCount = 0;
        this.myApp.rejectedCount = 0;
        this.myApp.investigateCount = 0;

        // for(let i = 0; i < this.requests.length; i++ ){
        //   if(this.requests[i].status === null){
        //     this.myApp.openCount = this.myApp.openCount + 1;
        //     // console.log(this.myApp.openCount); 
        //   }
        //   else if(this.requests[i].status === 'Accepted'){
        //     this.myApp.acceptedCount = this.myApp.acceptedCount + 1; 
        //   }
        //   else if(this.requests[i].status === 'Rejected'){
        //     this.myApp.rejectedCount = this.myApp.rejectedCount + 1; 
        //   }
        //   else if (this.requests[i].status === 'Investigate'){
        //     this.myApp.investigateCount = this.myApp.investigateCount + 1; 
        //   }
        // }

        
        // console.log("In Json Format: " + res.json())
        this.currentlyBusy=false;
        }, error => {
          this.isPaused=true;
          this.currentlyBusy=false;
          alert("FAILED, to fetch from php : "+ error);
          this.myreturnvalue = "Error : " + error;
          console.log(this.myreturnvalue)
          this.loading.dismiss();
      });
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      content: 'Loading Data, please wait..',
    });
    return await this.loading.present();  
  }

  // goToUpdateVehiclePage(fleet){
  //   this.navCtrl.push(UpdateVehiclePage, {fleet: fleet})
  // }

}
