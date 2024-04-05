import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observation } from 'src/data/models/observation';

export interface Client {
  order: number;
  client: string;
  phoneNumber: string;
  debt: number;
  borrowedPackaging: number;
  observations: Observation[];
}

const ELEMENT_DATA: Client[] = [
  {
    order: 1,
    client: "John Doe",
    phoneNumber: "555-1234",
    debt: 200,
    borrowedPackaging: 5,
    observations: [
      { text: "Regular customer", importance: 1 },
      { text: "Needs urgent attention", importance: 2 },
      { text: "Requires special handling", importance: 2 }
    ]
  },
  {
    order: 2,
    client: "Jane Smith",
    phoneNumber: "555-5678",
    debt: 150,
    borrowedPackaging: 3,
    observations: [
      { text: "New customer", importance: 1 },
      { text: "Requests expedited shipping", importance: 1 }
    ]
  },
  {
    order: 3,
    client: "Alice Johnson",
    phoneNumber: "555-2468",
    debt: 100,
    borrowedPackaging: 2,
    observations: [
      { text: "Has outstanding balance", importance: 1 },
      { text: "Interested in discounts", importance: 1 }
    ]
  },
  {
    order: 4,
    client: "Bob Brown",
    phoneNumber: "555-9876",
    debt: 50,
    borrowedPackaging: 1,
    observations: [
      { text: "Pays on time", importance: 1 },
      { text: "Occasional inquiries", importance: 1 }
    ]
  },
  {
    order: 5,
    client: "Mary Davis",
    phoneNumber: "555-1357",
    debt: 300,
    borrowedPackaging: 6,
    observations: [
      { text: "Frequent buyer", importance: 1 },
      { text: "Requires special handling for fragile items", importance: 2 }
    ]
  },
  {
    order: 6,
    client: "Michael Wilson",
    phoneNumber: "555-3698",
    debt: 75,
    borrowedPackaging: 2,
    observations: [
      { text: "Requires special packaging", importance: 2 },
      { text: "High priority customer", importance: 2 }
    ]
  },
  {
    order: 7,
    client: "Emma Martinez",
    phoneNumber: "555-2468",
    debt: 90,
    borrowedPackaging: 4,
    observations: [
      { text: "Needs urgent attention", importance: 2 },
      { text: "Preferred communication via email", importance: 1 }
    ]
  },
  {
    order: 8,
    client: "William Garcia",
    phoneNumber: "555-7531",
    debt: 200,
    borrowedPackaging: 5,
    observations: [
      { text: "Long-time customer", importance: 1 },
      { text: "Requests bulk discounts", importance: 1 }
    ]
  },
  {
    order: 9,
    client: "Olivia Rodriguez",
    phoneNumber: "555-8642",
    debt: 120,
    borrowedPackaging: 3,
    observations: [
      { text: "Frequent returns", importance: 1 },
      { text: "Interested in loyalty program", importance: 1 }
    ]
  },
  {
    order: 10,
    client: "James Lopez",
    phoneNumber: "555-9753",
    debt: 180,
    borrowedPackaging: 4,
    observations: [
      { text: "Preferred payment method: cash", importance: 1 },
      { text: "Requests expedited delivery", importance: 1 }
    ]
  },
  {
    order: 11,
    client: "Sophia Hernandez",
    phoneNumber: "555-6218",
    debt: 230,
    borrowedPackaging: 5,
    observations: [
      { text: "Loyal customer", importance: 1 },
      { text: "Requires special handling for perishable items", importance: 2 }
    ]
  },
  {
    order: 12,
    client: "Liam Gonzalez",
    phoneNumber: "555-3827",
    debt: 80,
    borrowedPackaging: 2,
    observations: [
      { text: "Occasional buyer", importance: 1 },
      { text: "Requests updates via SMS", importance: 1 }
    ]
  },
  {
    order: 13,
    client: "Ava Perez",
    phoneNumber: "555-4965",
    debt: 95,
    borrowedPackaging: 3,
    observations: [
      { text: "Interested in promotions", importance: 1 },
      { text: "Requires special handling for glass items", importance: 2 }
    ]
  },
  {
    order: 14,
    client: "Noah Torres",
    phoneNumber: "555-2846",
    debt: 40,
    borrowedPackaging: 1,
    observations: [
      { text: "Frequent inquiries", importance: 1 },
      { text: "Requests return policy information", importance: 1 }
    ]
  },
  {
    order: 15,
    client: "Isabella Ramirez",
    phoneNumber: "555-7392",
    debt: 150,
    borrowedPackaging: 3,
    observations: [
      { text: "Needs delivery by Friday", importance: 1 },
      { text: "Requests special handling for oversized items", importance: 2 }
    ]
  },
  {
    order: 16,
    client: "Mason Flores",
    phoneNumber: "555-8274",
    debt: 70,
    borrowedPackaging: 2,
    observations: [
      { text: "High priority customer", importance: 2 },
      { text: "Preferred communication via phone", importance: 1 }
    ]
  },
  {
    order: 17,
    client: "Evelyn Washington",
    phoneNumber: "555-9631",
    debt: 110,
    borrowedPackaging: 3,
    observations: [
      { text: "Requests expedited delivery", importance: 1 },
      { text: "Interested in volume discounts", importance: 1 }
    ]
  },
  {
    order: 18,
    client: "Logan Stewart",
    phoneNumber: "555-6482",
    debt: 220,
    borrowedPackaging: 4,
    observations: [
      { text: "Occasionally pays late", importance: 1 },
      { text: "Requests updates on backordered items", importance: 1 }
    ]
  },
  {
    order: 19,
    client: "Harper Morgan",
    phoneNumber: "555-1749",
    debt: 130,
    borrowedPackaging: 3,
    observations: [
      { text: "Large order pending", importance: 1 },
      { text: "Interested in customization options", importance: 1 }
    ]
  },
  {
    order: 20,
    client: "Aiden Cook",
    phoneNumber: "555-8163",
    debt: 180,
    borrowedPackaging: 4,
    observations: [
      { text: "Requires special handling", importance: 2 },
      { text: "Interested in warranty information", importance: 1 }
    ]
  }
];

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent {
  displayedColumns: string[] = ['Orden', 'Cliente', 'Telefono', 'Deudas', 'Envases prestados', 'Observaciones', 'Acciones'];
  dataSource = ELEMENT_DATA;
  disableSelect = new FormControl(false);

  showDialogClient(element: any){

  }
}
