import { Component } from '@angular/core';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  single: any[] = [
    {
      "name": "Normal",
      "value": 1000
    },
    {
      "name": "Servifacil",
      "value": 500
    },
  ];
  view: [number, number] = [700, 200];
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = false;
  yAxisLabel: string = 'Country';
  showYAxisLabel: boolean = false;
  xAxisLabel: string = 'Population';
  colorScheme: Color = {
    domain: ['#6FDB90', '#6E96DB'],
    group: ScaleType.Ordinal,
    name: 'SysWaterColors',
    selectable: true
  };


  ////////////

  singlePie: any[] = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    }
  ];
  viewPie: [number, number] = [273, 200];

  // options
  showLabels: boolean = false;
  isDoughnut: boolean = false;
  legendPosition: LegendPosition = LegendPosition.Below;

  colorSchemePie: Color = {
    domain: ['#6EB8DB', '#6EDAB6'],
    group: ScaleType.Ordinal,
    name: 'SysWaterColors',
    selectable: true
  };

}
