import { Injectable } from '@angular/core';
import Web3 from 'web3';
import Helpers from 'src/app/helpers/cookies.js'
declare var window: any;

@Injectable({
  providedIn: 'root'
})

export class Web3Service {
  public web3: any;
  constructor() {
  }

  getWeb3() {
    if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
      // We are in the browser and metamask is running.
      this.web3 = new Web3(window.web3.currentProvider);
      console.log('web3 from metamask');
    } else {
      // We are on the server *OR* the user is not running metamask
      // const provider = new Web3.providers.HttpProvider(
      //   'https://rinkeby.infura.io/your_Key'
      // );
      return null
    }
    return this.web3
  }

  setWeb3() {
    if (this.web3 == null)
      this.web3 = new Web3(window.web3.currentProvider);
  }

  async getChainId() {
    return await this.web3.eth.getChainId()
  }

  async exportInstance(ABI: any, contractAddress: any) {
    return await new (this.web3 as any).eth.Contract(ABI, contractAddress)
  }

  async signIn() {
    var message = "CryptoHauntoo";
    const address = await this.web3.eth.getAccounts()
    try {
      let obj = await this.web3.eth.sign(this.web3.utils.sha3(message), address[0])
      Helpers.setCookie("signedAuthMessage", obj)
      return 1;
    } catch (error) {
      console.log(error)
    }
    return 0;
  }

  getValue(cash: any) {
    return this.web3.utils.fromWei(cash, 'ether')
  }
}
