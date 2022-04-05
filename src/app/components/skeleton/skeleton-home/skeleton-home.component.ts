import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton-home',
  templateUrl: './skeleton-home.component.html',
  styleUrls: ['./skeleton-home.component.scss'],
})
export class SkeletonHomeComponent implements OnInit {

  public slidesOpts = { initialSlide: 0, speed: 300, spaceBetween: 1, slidesPerView: 3, freeMode: true };
  public listSkeleton = [1,2,3,4,5,6];

  constructor() { }

  ngOnInit() {}

}
