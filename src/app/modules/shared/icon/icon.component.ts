import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.css'],
})
export class IconComponent implements OnChanges {
  @Input() color: string = '';
  @Input() size: string = '1rem';
  @Input() iconPath: string = 'assets/icons/svg/dashboard_icon.svg';
  @Input() stroke: 'normal' | 'bold' = 'normal';

  svgIcon: SafeHtml = '';
  $svg?: Observable<any>;

  constructor(
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.$svg = this.httpClient.get(this.iconPath, { responseType: 'text' });
    this.$svg.subscribe(value => {
      let svg = value;
      svg = svg.replace(/'/g, "");
      svg = svg.replace(/ width=".*?"/i, ` width="${this.size}"`);
      svg = svg.replace(/ height=".*?"/i, ` height="${this.size}"`);
      svg = svg.replace(/fill="#(?:[0-9a-fA-F]{3}){1,2}"/g, ` fill="${this.color}"`);
      this.svgIcon = this.sanitizer.bypassSecurityTrustHtml(svg);
    });
  }


}