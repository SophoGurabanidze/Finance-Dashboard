export interface Month {
  id?: string;
  month: string;
  revenue: number;
  expenses: number;
  operationalExpenses: number;
  nonOperationalExpenses: number;
  currentAssets: number;
  currentLiabilities: number;
  totalAssets: number;
  netSales: number;
  inventory: number;
  costOfGoodsSold: number;
  accountsReceivable: number;
}

export interface GetKpisResponse {
  id: string;
  _id: string;
  __v: number;
  totalProfit: number;
  totalRevenue: number;
  totalExpenses: number;
  monthlyData: Array<Month>;
  createdAt: string;
  updatedAt: string;
}

export interface GetProductsResponse {
  id: string;
  _id: string;
  __v: number;
  price: number;
  expense: number;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlySale {
  month: string;
  productId: {
    _id: string;
    name: string;
    category: string;
    price: number;
    expense: number;
  };
  quantity: number;
  revenue: number;
}

export type GetMonthlySalesResponse = MonthlySale[];
