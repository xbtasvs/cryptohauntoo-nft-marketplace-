import { Component } from '@angular/core';
import { MetaserviceService } from '../app/services/meta/metaservice.service'
import { StoreService } from './services/store/store.service';
import { OnInit } from '@angular/core';
import { Web3Service } from 'src/app/services/web3/web3.service'
import { HttpHeaders } from '@angular/common/http'
import Helpers from 'src/app/helpers/cookies.js'
import { server } from 'src/config/config'
import { ht_abi } from 'src/app/abis/hauntooCore'
import { sale_abi } from 'src/app/abis/saleClockAuction'
import { sire_abi } from './abis/siringClockAuction';
import { ht_add, sale_add, sire_add } from 'src/config/config'

const web3service = new Web3Service()
declare var $: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  myweb3: any
  connect: boolean = true
  _htct: any
  _sire: any
  _sale: any
  account: any
  ownable: boolean = false

  constructor(private meta: MetaserviceService,
    private store: StoreService) {
  }
  title = 'CryptoHauntoo';

  async ngOnInit() {
    try {
      const acc = await web3service.getWeb3().eth.getAccounts()
      const signedAuthMessage = Helpers.getCookie("signedAuthMessage");
      const headers = new HttpHeaders({ "Authorization": signedAuthMessage })
      const user = await this.meta.authDataFromUrl(server + '/users/me', 'user', headers)
      if (acc.length == 0 || signedAuthMessage == '' || user == null) this.connect = false
      if (acc.length != 0) {
        this._htct = await web3service.exportInstance(ht_abi, ht_add)
        const owner = await this._htct.methods.owner().call()
        if (user.address.toLowerCase() == owner.toLowerCase()) {
          localStorage.setItem("owner", "true")
        }
        else localStorage.setItem("owner", "false")
        if (acc[0].toLowerCase() == owner.toLowerCase()) {
          this._sale = await web3service.exportInstance(sale_abi, sale_add)
          this._sire = await web3service.exportInstance(sire_abi, sire_add)
          this.account = acc[0]
          this.ownable = true
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  getClasses() {
    return window.location.href.includes("item") ?
      'transparent header-light scroll-light border-bottom clone' : 'transparent'
  }

  async transferOwner() {
    const add = $('#address').val()
    await this._sire.methods.transferOwnership(add).send({ from: this.account })
    await this._sale.methods.transferOwnership(add).send({ from: this.account })
    await this._htct.methods.transferOwnership(add).send({ from: this.account })
    window.location.reload()
  }

  onConnect() {
    this.store.connectState.next(true);
  }
}