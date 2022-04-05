import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton-playlist',
  templateUrl: './skeleton-playlist.component.html',
  styleUrls: ['./skeleton-playlist.component.scss'],
})
export class SkeletonPlaylistComponent implements OnInit {

  public listSkeleton = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor() { }

  ngOnInit() {}

}
