import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap} from 'rxjs/operators';
import { MyType } from './mytype'
let temp = localStorage.getItem('access_token')

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private searchUrl: string = "";

  private apiUrl = 'https://api.spotify.com/v1';

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<any> {
    const url = `${this.apiUrl}/me`;
    return this.http.get(url, { headers: this.getHeaders() });
  }



  // Get user's playlists
  getUserPlaylists(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + temp);
    this.searchUrl = 'https://api.spotify.com/v1/me/playlists';
    const queryParams = { limit : 50}
  
    return this.http.get(this.searchUrl, { headers: headers, params: queryParams }).pipe(
      catchError((error) => {
        console.error('Error fetching playlists:', error);
        return throwError(error); // Forward the error to the subscriber
      })
    );
  }

  // Get tracks from a playlist

    
   
   
 
    getPlaylistTracks(playlistId: string): Observable<any> {
      const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
      const queryParams = {limit : 50}
      return this.http.get(url, { headers: this.getHeaders(), params:queryParams }).pipe(
        catchError(error => {
          console.error(`Error getting tracks for playlist ${playlistId}:`, error);
          return throwError(error);
        })
      );
    }




  

  // Create a new playlist
  createPlaylist(name: string, trackUris: string[]): Observable<any> {
    return this.getUserProfile().pipe(
      switchMap((userProfile) => {
        const user_id = userProfile.id;
        const url = `${this.apiUrl}/users/${user_id}/playlists`;

        const body = {
          name: name,
          public: false,
          description: 'Created using Angular and Spotify API',
        };

        // Create the playlist
        return this.http.post(url, body, { headers: this.getHeaders() }).pipe(
          switchMap((createdPlaylist: any) => {
            const playlist_id = createdPlaylist.id;

            // Add tracks to the playlist
            const addTracksUrl = `${this.apiUrl}/playlists/${playlist_id}/tracks`;
            const addTracksBody = { uris: trackUris, position: 0 }; // You can adjust the position as needed

            return this.http.post(addTracksUrl, addTracksBody, { headers: this.getHeaders() });
          })
        );
      })
    );
  }


  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem("access_token"); // Replace with your access token
    console.log("HERE IS MY TOKEN" + token)
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}