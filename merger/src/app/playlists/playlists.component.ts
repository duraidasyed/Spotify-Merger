import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotifyservices';
import {HomeComponent} from 'src/app/home/home.component'
import { switchMap, finalize } from 'rxjs';
@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css'],
})
export class PlaylistComponent implements OnInit {
  playlists: any[] = [];
  selectedPlaylists: any[] = [];
  newPlaylistName: string = '';

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit() {
    
    this.loadPlaylists();
    
  }
  isSelected(playlist: any): boolean {
    return this.selectedPlaylists.includes(playlist);
  }
  loadPlaylists() {
    this.spotifyService.getUserPlaylists().subscribe((data: any) => {
      this.playlists = data.items;
    });
  }

  selectPlaylist(playlist: any) {
    const maxSelectedPlaylists = 2;
    
    // Check if the playlist is already selected
    const isSelected = this.isSelected(playlist);
  
    // If the playlist is not selected and the maximum number of selected playlists has been reached
    if (!isSelected && this.selectedPlaylists.length >= maxSelectedPlaylists) {
      // Unselect the oldest selected playlist
      this.selectedPlaylists.shift();
    }
  
    // Toggle the selected status of the clicked playlist
    if (isSelected) {
      // If playlist is already selected, remove it
      this.selectedPlaylists = this.selectedPlaylists.filter(p => p !== playlist);
    } else {
      // If playlist is not selected, add it
      this.selectedPlaylists.push(playlist);
    }
    if (this.selectedPlaylists.length == 2){
      window.scrollTo(0, 0)
    }
  }

  createNewPlaylist() {
    const trackUris: string[] = [];
    const uniqueTrackUrisSet = new Set<string>();
  
    this.selectedPlaylists.forEach((playlist) => {
      this.spotifyService.getPlaylistTracks(playlist.id).subscribe((data: any) => {
        data.items.forEach((track: any) => {
          const trackUri = track.track.uri;
  
          // Check if the track URI is not already in the set
          if (!uniqueTrackUrisSet.has(trackUri)) {
            // Add the track URI to the set and the merged playlist
            uniqueTrackUrisSet.add(trackUri);
            trackUris.push(trackUri);
          }
        });
  
        if (this.selectedPlaylists.indexOf(playlist) === this.selectedPlaylists.length - 1) {
          // Last selected playlist, create a new playlist
          this.spotifyService.createPlaylist(this.newPlaylistName, trackUris).subscribe(() => {
            console.log('New playlist created successfully');
          });
        }
      });
    });
  }
}