import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav  } from 'ionic-angular';

import { DashboardPage } from '../dashboard/dashboard';
import { AlertListPage } from '../alerts/alertList/alertList';
import { MonitorListPage } from '../monitors/monitorList/monitorList';
import { RequestsPage } from '../requests/requests';
import { MapsPage } from '../maps/maps';
import { ReportsPage } from '../reports/reports';

import {MyAppProvider} from '../../services/myAppProvider';


@Component({
  // selector: 'page-tabs',
  templateUrl: 'tabs.html',
  // styleUrls: [ 'tabs.scss', '../../theme/variables.scss' ]
})
export class TabsPage {

  public mySelectedIndex;
  tab1Root = DashboardPage;
  tab2Root = AlertListPage;
  tab3Root = MonitorListPage;
  tab4Root = RequestsPage;
  tab5Root = MapsPage;
  tab6Root = ReportsPage;
  

  constructor(public myApp: MyAppProvider, public navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }
}
