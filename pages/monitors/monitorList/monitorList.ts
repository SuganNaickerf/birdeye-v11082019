import { Component } from '@angular/core';
import { NavController, LoadingController, ModalController } from 'ionic-angular';
import Swal from 'sweetalert2';

import { MysqlService } from '../../../services/mysql.service';
import {MyAppProvider} from '../../../services/myAppProvider';

import { MonitorModalPage } from '../monitorModal/monitorModal';

@Component({
  selector: 'page-monitorList',
  templateUrl: 'monitorList.html',
  styleUrls: [ 'monitorList.scss', '../../../theme/variables.scss' ]
})
export class MonitorListPage {

  public loading;
  public monitors = [];
  public myreturnvalue;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
    // public goshalaProvider: ImcpaAppProvider,
    private dbService: MysqlService, private myApp: MyAppProvider, public modalCtrl: ModalController) {
      this.getMonitors();
  }
 
refershMonitors(){
    this.getMonitors();
  }


  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      content: 'Loading Data, please wait..',
    });
    return await this.loading.present();  
  }

  goToAlertModal(monitor) {
    // const modal = this.modalCtrl.create(MonitorModalPage, {monitor: monitor});
    // modal.present();

console.log("Going to monitor modal");
    this.navCtrl.push(MonitorModalPage, {monitor: monitor})
  }

  getMonitors(){
    this.presentLoading();
    this.dbService.fetchDataV2("SELECT * from pi_units p where p.Client_Name= '" + this.myApp.user.Client_Name + "' ORDER BY unit_name ASC")
      .map(res => res.json())
      .subscribe(res => {
        this.loading.dismiss();
        this.monitors=res.data;
        //console.log(this.monitors);
        this.myApp.MonitorCount = this.monitors.length;

        // console.log("In Json Format: " + res.json())
        
        }, error => {
        alert("FAILED, to fetch from php : "+ error);
        this.myreturnvalue = "Error : " + error;
        console.log(this.myreturnvalue)
        this.loading.dismiss();
      });
  }

  activateCommand(monitor, command){
    this.presentLoading();
    this.dbService.fetchDataV2("INSERT INTO pi_commands (unit_name,cpuserialno,createDatetime,command,flag) VALUE ('" + monitor.unit_name + "','" + monitor.cpuserial + "',NOW(),'" + command + "','NEW')")
      .map(res => res.json())
      .subscribe(res => {
        console.log(res);
        Swal.fire({
          title: 'Succes',
          text: 'The Comand has been sent!',
          type: 'success',
          confirmButtonText: 'Close'
        });
        this.loading.dismiss();
        // this.clearCache();
        // this.update();
        // this.tables=res.data;

        }, error => {
        Swal.fire({
          title: 'Error!',
          text: "FAILED, to fetch from php : "+ error,
          type: 'error',
          confirmButtonText: 'Close'
        });
        // alert("FAILED, to fetch from php : "+ error);
        this.myreturnvalue = "Error : " + error;
        console.log(this.myreturnvalue)
        this.loading.dismiss();
        // this.update();
      });
  }

getMonitorStatus(monitor, catType){

  if (catType == "MOTION"){
    return "eye-off"
  }

  if (catType == "IR"){
    return "wifi"
  }

  if (catType == "TRACK"){
    return "qr-scanner"
  }
 
}


}
