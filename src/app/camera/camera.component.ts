import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Observable, Subscription } from '../app.rx';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  constructor(private element: ElementRef) { }

  ngOnInit() {
    const video = this.element.nativeElement.querySelector('video');

    const videoStream$ = new Observable(observer => {
      let streamRef: MediaStream;

      // navigator exposes native browser APIs
      // we'll get a video stream from the web cam
      navigator.getUserMedia({
        video: true,
        audio: false
      }, (stream) => {
        // we have a media stream from the native API
        // record it so we can tear it down later
        streamRef = stream;
        // emit the stream
        observer.next(stream);
        observer.complete();
      }, (err) => {
        // we had an error getting the stream
        observer.error(err);
      });

      return () => {
        // if we happened to get a media stream,
        // be sure to tear it down on unsubscribe
        if (streamRef) {
          streamRef.getVideoTracks().forEach(t => t.stop());
        }
      };
    });

    this.subscription = videoStream$
      .map(stream => URL.createObjectURL(stream))
      .finally(() => {
        video.pause();
        video.src = null;
      })
      .subscribe(url => {
        video.src = url;
        video.play();
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

