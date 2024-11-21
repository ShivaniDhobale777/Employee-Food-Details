import { Component, OnInit } from '@angular/core';
import { FoodOrderService } from '../food-order.service';

@Component({
  selector: 'app-food-order-details',
  standalone: false,
  
  templateUrl: './food-order-details.component.html',
  styleUrl: './food-order-details.component.scss'
})
export class FoodOrderDetailsComponent implements OnInit {

  foodOrders: any[] = [];
  totalFine: number = 0;
  employeeName: string = 'John Daniel'; 

  months = [
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 },
  ];

  selectedMonth: number = 11;  

  constructor(private foodOrderService: FoodOrderService) {}

  ngOnInit(): void {
    this.fetchFoodOrders(); 
  }

  fetchFoodOrders(): void {
    this.foodOrderService.getMonthlyFoodOrder(this.selectedMonth).subscribe(
      data => {
        if (data && data.employeeName) {
          this.employeeName = data.employeeName;
        }
        this.processFoodOrders(data.reports);
      },
      error => {
        console.error('Error fetching food order details:', error);
      }
    );
  }
  processFoodOrders(reports: any[]): void {
    this.foodOrders = reports.map(report => {
      let dailyFine = 0;

      const { breakfast, lunch, dinner } = report.opt_ins || {};
      if (breakfast === 'Pending') dailyFine += 100;
      if (lunch === 'Pending') dailyFine += 100;
      if (dinner === 'Pending') dailyFine += 100;

      this.totalFine += dailyFine;

      return {
        date: report.date,
        breakfast: breakfast || 'N/A',
        lunch: lunch || 'N/A',
        dinner: dinner || 'N/A',
        fine: dailyFine
      };
    });
  }


getStatusClass(status: string): string {
  switch (status) {
    case 'Delivered':
      return 'delivered-status';
    case 'Pending':
      return 'pending-status';
    case 'Canceled':
      return 'canceled-status';
    default:
      return '';
  }
}

}
