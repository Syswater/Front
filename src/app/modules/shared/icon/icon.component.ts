import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.css'],
})
export class IconComponent implements OnChanges {
  @Input() color: string = 'green_1';
  @Input() size: string = '1rem';
  @Input() iconPath: string = 'assets/icons/svg/dashboard_icon.svg';
  @Input() stroke: 'normal' | 'bold' = 'normal';

  svgIcon: SafeHtml = '';
  withFillColor: boolean = false;
  $svg?: Observable<any>;

  constructor(
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnChanges(): void {
    this.$svg = this.httpClient.get(this.iconPath, { responseType: 'text' });
    this.$svg.subscribe(value => {
      let svg = value;
      svg = svg.replace(/'/g, "");
      svg = svg.replace(/ width=".*?"/i, ` width="${this.size}"`);
      svg = svg.replace(/ height=".*?"/i, ` height="${this.size}"`);
      this.withFillColor = svg.includes('fill="#') || svg.includes("fill='#");
      this.svgIcon = this.sanitizer.bypassSecurityTrustHtml(svg);
    });
  }
}