import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton-all-artist-musics',
  templateUrl: './skeleton-all-artist-musics.component.html',
  styleUrls: ['./skeleton-all-artist-musics.component.scss'],
})
export class SkeletonAllArtistMusicsComponent implements OnInit {

  public listSkeleton = [1,2,3,4,5,6,7,8,9,10,11,12];

  constructor() { }

  ngOnInit() {}

}
