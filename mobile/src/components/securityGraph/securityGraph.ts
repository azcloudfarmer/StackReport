import { Component, Input, ApplicationRef } from '@angular/core';
import { FundService } from '../../services/fund.service'
import {  Security } from '../../models/security';

// !!! this code heavily inspired by https://valor-software.com/ng2-charts/ (chart library example)

@Component({
  selector: 'component-securitygraph',
  templateUrl: 'securityGraph.html',
})
export class SecurityGraphComponent {

	@Input() security_in: Security;

	security: Security;
	fundGraphHistory: [number];

	constructor(public fundService: FundService, public applicationRef: ApplicationRef) {
		//this.fund = new Fund("fund_id");
		this.security = null;
	}

  	public lineChartData:Array<any> = [
    	{data: [10, 30, 60, 100, 150]},
  	];
  	public lineChartLabels:Array<any> = ['1/1', '1/2', '1/3', '1/4', '1/5'];
  	public lineChartOptions:any = {
    	responsive: true
  	};
  	public lineChartColors:Array<any> = [
    	{ // grey
	      lineTension: 0,
	      lineWidth: 0.1,
	      borderColor: 'rgba(236,50,118,1)',
	      pointBackgroundColor: 'rgba(149,86,208,1)',
	      pointBorderColor: '#fff',
	      pointHoverBackgroundColor: '#fff',
	      pointHoverBorderColor: 'rgba(149,86,208,0.8)'
    	}
  	];
  	public lineChartLegend:boolean = false;
  	public lineChartType:string = 'line';

  	private populateGraph():void {
  		// populate graph (last 5 days))
		[0, 1, 2, 3, 4].forEach((i) => {
			this.lineChartData[0].data[4 - i] = this.security.price_history[i]['price'];
			let utcDate = new Date(this.security.price_history[i]['date']);
			let date = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
	  		let month = date.getMonth() + 1;
	  		let formatted = month + "/" + date.getDate();
			this.lineChartLabels[4 - i] = formatted;
		});
		this.applicationRef.tick();

		console.log("populated");
  	}

  	ngOnInit() {
		this.security = this.security_in;
		this.populateGraph();
		this.applicationRef.tick();

	}

  	// events 
  	public chartClicked(e:any):void {
    	console.log(e);
  	}
 
  	public chartHovered(e:any):void {
    	console.log(e);
  	}
}