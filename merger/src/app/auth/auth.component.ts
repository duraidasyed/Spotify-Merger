import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  /**
   * requestAuth
   */
  public requestAuth() {
   
    var client_id = "2a0b1b40f3f845638bb9b2f46371760a";
    var client_secret ="c3d5f669c67f4275a415ee87bcd90120"
    var url = "https://accounts.spotify.com/authorize"

    url += "?client_id=" + client_id
   
    url += "&response_type=code"
    url += "&redirect_uri=" + encodeURI("http://localhost:4200/")
    url += "&show_dialog=true" 
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private playlist-modify-public playlist-modify-private";
    alert(url);
    window.location.href = url;
    
  }
}
