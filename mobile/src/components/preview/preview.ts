import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, Loading, LoadingController} from 'ionic-angular';
import { FundService } from '../../services/fund.service'
import { Security } from '../../models/security';
import { SecurityPage } from '../../pages/security/security';

@Component({
  selector: 'component-preview',
  templateUrl: 'preview.html',
})
export class PreviewComponent {
	
	@Input('security_in') security_from_front;

	security: Security;
	price_color: string;

	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.security = null;
		this.price_color = "price white";
	}

	ngOnInit() {
		this.security = this.security_from_front;
		if(this.security.current_price < this.security.price_history[0]['1. open']) {
			this.price_color = 'price red';
		} else if (this.security.current_price > this.security.price_history[0]['1. open']) {
			this.price_color = 'price green';
		}
	}

	openPage() {
    	this.navCtrl.push(SecurityPage, {
    		param: this.security
    	});
	}
}