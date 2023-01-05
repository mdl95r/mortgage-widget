export interface IGetData {
  bank: string;
  image: string;
  popularity: number;
  rate: number;
}

export interface ICalcWidgetOptions {
  urlApi: string;
  wrapperStyles: string;
  minTerm: number;
}

export interface IMarkupOptions {
  wrapperStyles: string;
  minTerm: number;
}

export interface IinputFields {
  price: number;
  contribution: number;
  term: number;
  rate: number;
  bank: string;
}

export interface IPaymentObj<T> {
  sumCredit: number;
  monthlyPayment: T;
  recommended: T;
  rate: number;
  bank?: string;
}
