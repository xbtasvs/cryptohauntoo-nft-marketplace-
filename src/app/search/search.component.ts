import { Component, OnDestroy, OnInit } from '@angular/core'
import { StoreService } from 'src/app/services/store/store.service'
import { MetaserviceService } from 'src/app/services/meta/metaservice.service'
import { ActivatedRoute } from '@angular/router'
import { Web3Service } from 'src/app/services/web3/web3.service'
import Helpers from 'src/app/helpers/cookies.js'
import { HttpHeaders } from '@angular/common/http'
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { server } from 'src/config/config'

declare var $: any;
const web3service = new Web3Service()

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit, OnDestroy {
  urlquery: any
  metadata: any[] = []

  page = 1
  count = 0
  tableSize = 8
  loading = 0
  connect = ""

  options: AnimationOptions = {
    path: '/assets/lottie/73877-loading.json',
  };

  constructor(private route: ActivatedRoute, private store: StoreService,
    private meta: MetaserviceService) {
  }

  async ngOnInit() {
    this.setAlphaMode('#wrapper', 'none')
    this.setAlphaMode('.hauntoo-content', 'none')
    if (web3service.getWeb3() == null) {
      $(document).ready(function () {
        $("#metamaskInstall").modal('show');
      });
    }
    else {
      this.loading = 1
      this.route.queryParamMap.subscribe((params) => {
        this.urlquery = { ...params.keys, ...params }
      })
      const url = server + '/hauntoos' + '?include=' + this.urlquery.params.include + '&offset=0';
      await this.setDataFromResponse(url, 0)
      this.setAlphaMode('#wrapper', 'auto')
      this.setAlphaMode('.hauntoo-content', 'auto')
      this.loading = 0
    }
    this.store.connectState.subscribe(connect => {
      this.connectWallet()
    })
  }

  async setDataFromResponse(url: any, event: any) {
    const data = await this.meta.getMetadataFromUrl(url).toPromise()
    const length = data.hauntoos.length
    for (let i = 0; i < length; i++) {
      data.hauntoos[i].cooldown_index = this.getCooldown(data.hauntoos[i].cooldown_index)
      if (data.hauntoos[i].auction != undefined && data.hauntoos[i].auction.type == 'sale') {
        data.hauntoos[i].price = data.hauntoos[i].auction.current_price / Math.pow(10, 18)
      }
    }
    this.metadata = [...data.hauntoos]
    this.count = data.count
    this.page = event
  }

  animationCreated(animationItem: AnimationItem): void {
  }

  getCooldown(index: any) {
    const str = ['Fast', 'Swift', 'Snappy', 'Brisk', 'Plodding', 'Slow', 'Sluggish', 'Catatonic']
    const uni = index <= 4 ? 'm' : index <= 10 ? 'h' : index <= 12 ? 'd' : 'week'
    const div = [1, 2, 5, 10, 30, 1, 2, 4, 8, 16, 24, 2, 4, 1]
    return str[Math.ceil(index / 2)] + ' Cooldown ' + '(' + div[index] + uni + ')'
  }

  ngOnDestroy() {
    this.store.changeMetaData(this.metadata)
  }

  async connectWallet() {
    let res: any
    try {
      res = await web3service.getWeb3().currentProvider.enable()
    } catch (error) {
      this.setAlphaMode('#wrapper', 'auto')
      this.setAlphaMode('.hauntoo-content', 'auto')
      this.loading = 0
      // window.location.reload()
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
      this.route.queryParamMap.subscribe((params) => {
        this.urlquery = { ...params.keys, ...params }
      })
      url = server + '/hauntoos' + '?include=' + this.urlquery.params.include + '&offset=0';
      await this.setDataFromResponse(url, 0)
      $('#staticBackdrop').modal('hide')
      window.location.reload()
    }
  }

  async isAbleToGo() {
    const acc = await web3service.getWeb3().eth.getAccounts()
    const signedAuthMessage = Helpers.getCookie("signedAuthMessage");
    const headers = new HttpHeaders({ "Authorization": signedAuthMessage })
    const user = await this.meta.authDataFromUrl(server + '/users/me', 'user', headers)
    if (acc.length == 0 || signedAuthMessage == '' || user == null) return false
    return true;
  }

  onTableDataChange(event: any) {
    const inc = this.urlquery.params.include ? this.urlquery.params.include : 'all'
    const url = server + '/hauntoos' + '?include=' + inc + '&offset=' + ((event - 1) * 8);
    this.setDataFromResponse(url, event)
  }

  setAlphaMode(id, mode) {
    $(id).css({
      'pointer-events': mode,
      'opacity': mode == 'auto' ? '1' : '0.1'
    })
  }
}
