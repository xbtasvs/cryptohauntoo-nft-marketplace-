import { Component, OnInit, ɵɵsetComponentScope } from '@angular/core'
import { MetaserviceService } from 'src/app/services/meta/metaservice.service'
import Helpers from 'src/app/helpers/cookies.js'
import { Web3Service } from 'src/app/services/web3/web3.service'
import { HttpHeaders } from '@angular/common/http'
import { server } from 'src/config/config'
import { ht_abi } from 'src/app/abis/hauntooCore'
import { ht_add } from 'src/config/config'
import moment from 'moment'

const web3service = new Web3Service()
@Component({
  selector: 'app-myhauntoo',
  templateUrl: './myhauntoo.component.html',
  styleUrls: ['./myhauntoo.component.css']
})
export class MyhauntooComponent implements OnInit {
  metadata: any[] = []
  eggdata: any[] = []
  account = ''
  nickname = ''
  page = 1
  count = 0
  tableSize = 8
  bornImage = ''
  _htct: any
  constructor(private meta: MetaserviceService) { }

  async ngOnInit() {

    const signedAuthMessage = Helpers.getCookie("signedAuthMessage");
    const headers = new HttpHeaders({ "Authorization": signedAuthMessage })
    const user = await this.meta.authDataFromUrl(server + '/users/me', 'user', headers)
    this.account = user.address;
    this.nickname = user.nickname;

    const url = server + '/hauntoos?owner_wallet_address=' + this.account;
    let data = await this.meta.getMetadataFromUrl(url).toPromise()
    this.count = data.count
    for (let i = 0; i < data.hauntoos?.length; i++) {
      data.hauntoos[i].cooldown_index = this.getCooldown(data.hauntoos[i].cooldown_index)
      console.log("cooldown:", data.hauntoos[i].cooldown_index)
      if (data.hauntoos[i].auction != undefined) {
        data.hauntoos[i].price = data.hauntoos[i].auction.current_price / Math.pow(10, 18)
      }
    }
    this.metadata = [...data.hauntoos]
    this.eggdata = this.metadata.filter(function (res) {
      return res.siringWithId != 0
    })
    web3service.setWeb3()
    this._htct = await web3service.exportInstance(ht_abi, ht_add)
  }

  getCooldown(index: any) {
    const str = ['Fast', 'Swift', 'Snappy', 'Brisk', 'Plodding', 'Slow', 'Sluggish', 'Catatonic']
    const uni = index <= 4 ? 'm' : index <= 10 ? 'h' : index <= 12 ? 'd' : 'week'
    const div = [1, 2, 5, 10, 30, 1, 2, 4, 8, 16, 24, 2, 4, 1]
    return str[Math.ceil(index / 2)] + ' Cooldown ' + '(' + div[index] + uni + ')'
  }

  checkPregger(item: any) {
    return this.eggdata.includes(item)
  }

  canGiveBirth(item: any) {
    return moment(item.preggerTime).utc() <= moment().utc()
  }

  async giveBirthHauntoo(item: any) {
    const res = this.canGiveBirth(item)
    if (res == false) { alert("It is not the time to born. Please wait until it gets ready!"); return; }
    else { alert("Your egg is about to come!") }
    try {
      const baby = await this._htct.methods.giveBirth(item.hauntooid).send({
        from: this.account
      })
      const url = server + '/hauntoos'
      const res = await this.meta.setMetadata(url, { id: baby.events.Birth.returnValues })
      alert("New Hauntoo has born! Congratulations!")
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  async onTableDataChange(event: any) {
    const url = server + '/hauntoos?owner_wallet_address=' + this.account + '&offset=' + ((event - 1) * 8);
    let data = await this.meta.getMetadataFromUrl(url).toPromise()
    data = data.hauntoos
    for (let i = 0; i < data.length; i++) {
      data[i].cooldown_index = this.getCooldown(data[i].cooldown_index)
    }
    this.metadata = data
    this.eggdata = this.metadata.filter(function (res) {
      return res.siringWithId != 0
    })
    this.page = event
    console.log("METADATA:", this.metadata)
  }
}
