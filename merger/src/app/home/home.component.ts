import { Token } from '@angular/compiler';
import { Component, OnInit, AfterViewInit} from '@angular/core';
import { Json } from 'twilio/lib/interfaces';
var client_id = "2a0b1b40f3f845638bb9b2f46371760a"
var client_secret = "c3d5f669c67f4275a415ee87bcd90120"

var responseText;
var access_token:string = ""
var refresh_token:string = ""
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


 


  
export class HomeComponent implements OnInit {

ngOnInit(): void {
  let code = this.getCode()
  console.log(code)
  this.fetchAccessToken(code)
 
}


handleRedirect(){
  let code = this.getCode();
  this.fetchAccessToken( code );
  window.history.pushState("", "", "http://localhost:4200/"); // remove param from url
}

fetchAccessToken(code:any){
  let body = "grant_type=authorization_code"
  body += "&code=" + code
  body += "&redirect_uri=" + encodeURI("http://localhost:4200/") 
  body += "&client_id=" + client_id
  body += "&client_secret=" + client_secret
  this.callAuthorizationAPI(body);
}

callAuthorizationAPI(body:any){
  fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: body,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .then(r => r.json())
    .then(data => {
      console.log(data);

      if (data.access_token !== undefined) {
        access_token = data.access_token;
        localStorage.setItem("access_token", access_token);
      }
      if (data.refresh_token !== undefined) {
        refresh_token = data.refresh_token;
        localStorage.setItem("refresh_token", refresh_token);
      }
    })
    .catch(error => console.error('Error during token exchange:', error));
}

   

 
onPageLoad(){
  if (window.location.search.length > 0){
    this.handleRedirect();
  }
}
getCode(){
  let code = null;
  const queryString = window.location.search;
  if (queryString.length> 0){
    const urlParams = new URLSearchParams(queryString)
    code = urlParams.get('code')
  }
  return code;
}
}
