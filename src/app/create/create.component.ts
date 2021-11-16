import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../services/web3/web3.service';
import { gene_abi } from '../abis/geneScience'
import { ht_abi } from '../abis/hauntooCore'
import { sale_abi } from '../abis/saleClockAuction'
import { gene_add, ht_add, sale_add } from 'src/config/config'
import { MetaserviceService } from '../services/meta/metaservice.service';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { server } from 'src/config/config'

const web3service = new Web3Service()
declare var $: any

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})

export class CreateComponent implements OnInit {

  attribute: any
  account: any
  _gene: any
  _geneNew: any = []
  _htct: any
  _salect: any
  loading = 0
  options: AnimationOptions = {
    path: '/assets/lottie/70858-lazydoge-nft.json',
  };

  constructor(private meta: MetaserviceService) {
  }

  async ngOnInit() {
    if (web3service.getWeb3() != null) {
      this.account = await web3service.getWeb3().eth.getAccounts()
      this._gene = await web3service.exportInstance(gene_abi, gene_add)
      this._htct = await web3service.exportInstance(ht_abi, ht_add)
      this._salect = await web3service.exportInstance(sale_abi, sale_add)
    }
  }

  globalFilterStyle() {
    const style = { 'pointer-events': 'none', 'opacity': '0.1' }
    return this.loading == 0 ? {} : style
  }

  animationCreated(animationItem: AnimationItem): void {
  }

  async generate() {
    const net = await web3service.getChainId()
    // if (net != 4002)
    //   alert("You are not connect to the Fantom Test Network. Please connect to Fantom Test Network via Metamask.")

    {
      $('#wrapper').css({
        'pointer-events': 'none',
        'opacity': '0.1'
      })
      this.loading = 1
      for (let i = 0; i < $("#hauntoo_amount").val(); i++) {
        const url = server + '/hauntoos'
        await this.meta.setMetadata(url, {})
      }
      this.loading = 0;
      $('#wrapper').css({
        'pointer-events': 'auto',
        'opacity': '1'
      })
    }
  }

  async getHauntooId() {
    const index = await this._htct.methods.totalSupply().call({ from: this.account[0] })
    const res = await this._htct.methods.tokenByIndex(index - 1).call({ from: this.account[0] })
    return res;
  }
}