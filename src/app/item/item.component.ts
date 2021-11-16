import { AfterViewChecked, Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { StoreService } from '../services/store/store.service'
import { Web3Service } from '../services/web3/web3.service'
import { MetaserviceService } from 'src/app/services/meta/metaservice.service'
import { sale_abi } from '../abis/saleClockAuction'
import { ht_abi } from '../abis/hauntooCore'
import { ht_add, sale_add } from 'src/config/config'
import BigNumber from 'bignumber.js'
import Helpers from 'src/app/helpers/cookies.js'
import { HttpHeaders } from '@angular/common/http'
import { server } from 'src/config/config'

const web3service = new Web3Service()
declare var $: any

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit, AfterViewChecked {

  metadata: any[] = []
  itdata: any
  account: any
  itattr: any = []
  itPara = -1
  loading = 0
  itCooldown = ''
  itPrice = -1
  _salect: any
  _htct: any
  status = 0
  code = ['Buy with FTM', 'Create Auction', 'Cancel Auction', '']
  isDataAvailable: boolean = false;

  constructor(private store: StoreService,
    private route: ActivatedRoute,
    private meta: MetaserviceService) {
  }

  async ngOnInit() {
    web3service.setWeb3()
    this._salect = await web3service.exportInstance(sale_abi, sale_add)
    this._htct = await web3service.exportInstance(ht_abi, ht_add)
    this.account = await web3service.getWeb3().eth.getAccounts()
    this.itPara = this.route.snapshot.params.id
    const url = server + '/hauntoos/' + this.itPara;
    await this.setDataFromResponse(url, 0)
    this.itdata = this.metadata;
    this.itattr = this.itdata.attributes;
    this.isDataAvailable = true;
    if (this.itdata.auction?.type == 'sale') {
      this.itPrice = this.itdata.auction.current_price / Math.pow(10, 18)
      this.status = (this.itdata.owner.address.toLowerCase() == this.account[0].toLowerCase() ? 2 : 0)
    }
    else this.status = (this.itdata.owner.address.toLowerCase() == this.account[0].toLowerCase() ? 1 : 3)

    console.log("status:", this.status)

    this.store.connectState.subscribe(connect => {
      this.connectWallet()
    })
  }

  async updateItemGio($event: any) {
    if ($event.target.innerText != this.itdata.description) {
      const url = server + '/hauntoos/' + this.itPara + "/updateItemGio";
      await this.meta.setMetadata(url, { updateItemGio: $event.target.innerText })
    }
  }

  async updateItemName($event: any) {
    if ($event.target.innertext != this.itdata.name) {
      const url = server + '/hauntoos/' + this.itPara + "/updateItemName";
      await this.meta.setMetadata(url, { updateItemName: $event.target.innerText })
    }
  }

  async setDataFromResponse(url: any, event: any) {
    const data = await this.meta.getMetadataFromUrl(url).toPromise()
    data.cooldown_index = this.getCooldown(data.cooldown_index)
    if (data.auction != undefined && data.auction.type == 'sale')
      data.price = data.auction.current_price
    this.metadata = data
  }

  async connectWallet() {
    let res: any
    try {
      res = await web3service.getWeb3().currentProvider.enable()
    } catch (error) {
      this.setAlphaMode('#wrapper', 'auto')
      this.setAlphaMode('.hauntoo-content', 'auto')
      window.location.reload()
      return;
    }
    const account = await web3service.getWeb3().eth.getAccounts();
    let url = server + '/users/' + account[0].toLowerCase()
    res = await this.meta.getMetadataFromUrl(url).toPromise()
    if (res.result != 'success') {
      this.setAlphaMode('.hauntoo-content', 'auto')
      $('#staticBackdrop').modal('show')
    }
    else {
      if (!Helpers.getCookie("signedAuthMessage"))
        await this.metamaskSignIn()
      else window.location.reload()
    }
  }

  getCooldown(index: any) {
    const str = ['Fast', 'Swift', 'Snappy', 'Brisk', 'Plodding', 'Slow', 'Sluggish', 'Catatonic']
    const uni = index <= 4 ? 'm' : index <= 10 ? 'h' : index <= 12 ? 'd' : 'week'
    const div = [1, 2, 5, 10, 30, 1, 2, 4, 8, 16, 24, 2, 4, 1]
    return str[Math.ceil(index / 2)] + ' Cooldown ' + '(' + div[index] + uni + ')'
  }

  async metamaskSignIn() {
    const res = await web3service.signIn()
    if (res == 1) {
      const signedAuthMessage = Helpers.getCookie("signedAuthMessage");
      const headers = new HttpHeaders({ "Authorization": signedAuthMessage })
      const user = await this.meta.authDataFromUrl(server + '/users/me', 'user', headers)
      let url: any;
      if (user == null) {
        url = server + '/users';
        let request: { [k: string]: any } = {};
        request.address = await web3service.getWeb3().eth.getAccounts()
        request.address = request.address[0].toLowerCase()
        request.nickname = $('#nickname').val()
        request.image = 1;
        this.meta.setMetadata(url, request)
      }
      $('#staticBackdrop1').modal('hide')
      window.location.reload()
    }
  }

  ngAfterViewChecked() {
  }

  doAction(mode: number) {
    switch (this.status) {
      case 0:
        this.buyItem()
        break
      case 1:
        this.modalShow(mode)
        break
      case 2:
        this.cancelAuction()
        break
    }
  }

  async buyItem() {
    const net = await web3service.getChainId()
    // if (net != 4002)
    //   alert("You are not connect to the Fantom Test Network. Please connect to Fantom Test Network via Metamask.")
    if (this.account.length == 0 || Helpers.getCookie("signedAuthMessage") == '')
      alert("You are not signed in yet. Please sign in by pressing Connect Wallet button in the right conor.")

    else {
      let currentPrice = 0
      try {
        currentPrice = await this._salect.methods.getCurrentPrice(this.itdata.hauntooid).call();
        console.log(currentPrice)
      } catch (err) {
        console.log(err);
      }
      const res = await this._salect.methods.bid(this.itdata.hauntooid).send({
        from: this.account[0],
        value: currentPrice
      });
      if (res.status == true) {
        const signedAuthMessage = Helpers.getCookie("signedAuthMessage");
        const headers = new HttpHeaders({ "Authorization": signedAuthMessage })
        const user = await this.meta.authDataFromUrl(server + '/users/me', 'user', headers)
        const url = server + '/hauntoos/' + this.itdata.hauntooid + '/sale';
        let owner: { [k: string]: any } = {}
        owner.address = this.account[0]
        owner.nickname = user.nickname
        this.meta.setMetadata(url, { 'owner': owner })
        window.location.reload()
      }
    }
  }

  modalShow(mode: number) {
    if (mode === 0) $('#createAuct').modal('show')
    else if (mode === 1) $('#createFixed').modal('show')
  }

  async createAuction(mode: number) {
    let val = 0
    if (mode == 0) {
      let dur = $("#duration option:selected").val()
      if (dur.includes('day')) val = 86400
      else if (dur.includes('week')) val = 604800
      else if (dur.includes('month')) val = 2592000
    }
    else val = 86400

    if (Number($('#stprice').val()) < Number($('#edprice').val())) {
      $('#warning').css({ 'display': 'block' })
    }

    else {
      const res = await this._htct.methods.createSaleAuction(
        this.itdata.hauntooid,
        mode == 0 ? new BigNumber($('#stprice').val()).times(new BigNumber(10).pow(18)).toString() :
          new BigNumber($('#fixprice').val()).times(new BigNumber(10).pow(18)).toString(),
        mode == 0 ? new BigNumber($('#edprice').val()).times(new BigNumber(10).pow(18)).toString() :
          new BigNumber($('#fixprice').val()).times(new BigNumber(10).pow(18)).toString(),
        new BigNumber(val)
      ).send({ from: this.account[0] })
      if (res.status == true) {
        let val;
        try {
          val = await this._salect.methods.getAuction(this.itdata.hauntooid).call()
        } catch (error) {
          console.log(error)
        }
        let auction: { [k: string]: any } = {}
        auction.id = this.itdata.hauntooid
        auction.type = 'sale'
        auction.start_price = val.startingPrice
        auction.end_price = val.endingPrice
        auction.start_time = val.startedAt + '000'
        auction.duration = val.duration
        auction.status = auction.end_time != 0 ? 'open' : 'close'
        const signedAuthMessage = Helpers.getCookie("signedAuthMessage");
        const headers = new HttpHeaders({ "Authorization": signedAuthMessage })
        const user = await this.meta.authDataFromUrl(server + '/users/me', 'user', headers)
        auction.seller = { address: this.account[0], nickname: user.nickname, image: 1 }
        const url = server + '/hauntoos/' + this.itdata.hauntooid + '/createSale';
        this.meta.setMetadata(url, { 'auction': auction })
        window.location.reload()
      }
      $('#createAuct').modal('hide')
    }
  }

  async cancelAuction() {
    const res = await this._salect.methods.cancelAuction(this.itdata.hauntooid).send({
      from: this.account[0]
    })
    if (res.status == true) {
      const url = server + '/hauntoos/' + this.itdata.hauntooid + '/cancelAuction';
      this.meta.setMetadata(url, {})
      window.location.reload()
    }
  }

  setAlphaMode(id, mode) {
    $(id).css({
      'pointer-events': mode,
      'opacity': mode == 'auto' ? '1' : '0.1'
    })
  }
}
