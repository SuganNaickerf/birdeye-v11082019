import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, RequestOptions, RequestMethod } from '@angular/http';
import * as CryptoJS from 'crypto-js';
import "rxjs/add/operator/map";

//Service Encryption 
import {EncryptionService} from '../services/encryption.service';

  
@Injectable()
export class MysqlService {

constructor(public http: Http,public encryptme:EncryptionService) { }
 
public fetchDataV2(mysql:string): Observable<any> {

    //console.log("In V2 Data sql");
    //Create Spinner 
    //this.presentLoading();

    //Create Headers for POST
      var headers = new Headers();
      headers.append("Accept", 'application/pdf');
      headers.append('Content-Type', 'application/json' );
      headers.append('Access-Control-Allow-Origin', '*' ); 
    
      const requestOptions = new RequestOptions({ headers: headers });

    //console.log("Output SQL");
    //console.log(mysql);
    //console.log("Output SQL");

    // if (mysql.length<10){
    //   mysql= 'select * from ' + mysql;
    //   //console.log(mysql);
    // }
    // let date = new Date();
    //Generate Form to Post 
    var date = new Date();
    var dateTxt = "N" + date.toDateString();

    let postData = new FormData();
      postData.append('data',this.encryptme.encrytme(mysql));
      postData.append('xtest',dateTxt);
      // postData.append('mytime');

    //console.log ("Posting");
    //Site to post data to 
    return this.http.post("https://www.dev-x.co.za/Projects/PhoenixInstruments/BirdScanner/birdSql.php", postData).timeout(10000)
  }

}