import { Component, OnInit } from '@angular/core';
import { MetaserviceService } from 'src/app/services/meta/metaservice.service'
import { Web3Service } from 'src/app/services/web3/web3.service'
import Helpers from 'src/app/helpers/cookies.js'
import { HttpHeaders } from '@angular/common/http'
import { server } from 'src/config/config'
import { ht_abi } from 'src/app/abis/hauntooCore'
import { ht_add } from 'src/config/config'
import moment from 'moment'

const web3service = new Web3Service()
declare var $: any
@Component({
  selector: 'app-summoning',
  templateUrl: './summoning.component.html',
  styleUrls: ['./summoning.component.css']
})
export class SummoningComponent implements OnInit {

  preggers = { id: -1, name: '', gene: -1, cooldown: '', image: undefined };
  sire = { id: -1, name: '', gene: -1, cooldown: '', image: undefined };
  metadata: any[] = []
  filter: any[] = []
  account = ''
  nickname = ''
  gene = 0
  page1 = 1;
  count1 = 0;
  tableSize1 = 3;
  _htct: any;
  constructor(private meta: MetaserviceService) {
  }

  async ngOnInit() {
    const signedAuthMessage = Helpers.getCookie("signedAuthMessage");
    const headers = new HttpHeaders({ "Authorization": signedAuthMessage })
    const user = await this.meta.authDataFromUrl(server + '/users/me', 'user', headers)
    this.account = user.address;
    this.nickname = user.nickname;
    const url = server + '/hauntoos?owner_wallet_address=' + this.account + '&limit=3';
    let data = await this.meta.getMetadataFromUrl(url).toPromise()
    this.count1 = data.count
    for (let i = 0; i < data.length; i++) {
      data.hauntoos[i].cooldown_index = this.getCooldown(data.hauntoos[i].cooldown_index)
      if (data.hauntoos[i].auction != undefined && data.hauntoos[i].auction.type == 'sale') {
        data.hauntoos[i].price = data.hauntoos[i].auction.current_price / Math.pow(10, 18)
        data.hauntoos[i].cooldown_index = this.getCooldown(data.hauntoos[i].cooldown_index)
      }
    }
    this.metadata = data.hauntoos
    this.filter = this.metadata

    web3service.setWeb3()
    this._htct = await web3service.exportInstance(ht_abi, ht_add)
  }

  getCooldown(index: any) {
    const str = ['Fast', 'Swift', 'Snappy', 'Brisk', 'Plodding', 'Slow', 'Sluggish', 'Catatonic']
    const uni = index <= 4 ? 'm' : index <= 10 ? 'h' : index <= 12 ? 'd' : 'week'
    const div = [1, 2, 5, 10, 30, 1, 2, 4, 8, 16, 24, 2, 4, 1]
    return str[Math.ceil(index / 2)] + ' Cooldown ' + '(' + div[index] + uni + ')'
  }

  async onTableDataChange(event: any) {
    const url = server + '/hauntoos?owner_wallet_address=' + this.account + '&exclude=' + '&limit=3' + '&offset=' + ((event - 1) * 3);
    let data = await this.meta.getMetadataFromUrl(url).toPromise()
    this.count1 = data.count
    data = data.hauntoos
    for (let i = 0; i < data.length; i++) {
      data[i].cooldown_index = this.getCooldown(data[i].cooldown_index)
    }
    this.metadata = data
    this.filter = this.metadata.filter(res => {
      return !(res.hauntooid == this.sire.id || res.hauntooid == this.preggers.id ||
        moment(res.preggerTime).utc() > moment().utc() || res.siringWithId != 0)
    })
    this.page1 = event
  }

  selectHauntoo(item) {
    if (this.gene == 0) {
      this.sire.id = item.hauntooid
      this.sire.image = item.image
      this.sire.name = item.name
      this.sire.gene = item.generation
      this.sire.cooldown = item.cooldown_index
    }
    else {
      this.preggers.id = item.hauntooid
      this.preggers.image = item.image
      this.preggers.name = item.name
      this.preggers.gene = item.generation
      this.preggers.cooldown = item.cooldown_index
    }
    $('#hauntooList').modal('hide')
  }

  async summoningHauntoos() {
    const res = await this.canSummoning()
    if (res == false) { alert("This pair is not able to summoning. Please try other pair."); return; }
    try {
      await this._htct.methods.breedWithAuto(this.preggers.id, this.sire.id).send({
        from: this.account,
        value: 0.002 * Math.pow(10, 18)
      })
      await this.meta.setMetadata(server + '/hauntoos/' + this.preggers.id + '/addPreggers', {})
      alert("Summoning success!")
      window.location.replace(window.location.origin + '/hauntoo/myhauntoo')
    } catch (error) {
      console.log(error)
    }
  }

  async canSummoning() {
    return await this._htct.methods.canBreedWith(this.preggers.id, this.sire.id).call()
  }

  async showModal(_gene: number) {
    this.gene = _gene
    this.filter = this.metadata.filter(res => {
      return !(res.hauntooid == this.sire.id || res.hauntooid == this.preggers.id ||
        moment(res.preggerTime).utc() > moment().utc() || res.siringWithId != 0)
    })
    $('#hauntooList').modal('show')
  }
}
