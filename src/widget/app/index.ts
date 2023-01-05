import ApiService from '../services/API';
import '../assets/scss/styles.scss';
import showMarkup, { render, buildPrograms } from '../templates/index';
import { Classes, Selectors } from './variables';
import {
  ICalcWidgetOptions,
  IGetData,
  IinputFields,
  IMarkupOptions,
  IPaymentObj,
} from '../interfaces';

export default class calcWidget {
  private markupOptions: IMarkupOptions;
  private $el: HTMLElement | null;
  private data: Promise<void>;
  private api: ApiService;

  constructor(selector: string, options: ICalcWidgetOptions) {
    const defaultOptions = {
      wrapperStyles: '',
      minTerm: 3,
    };

    const newOptions = { ...defaultOptions, ...options };

    this.markupOptions = {
      wrapperStyles: newOptions.wrapperStyles,
      minTerm: newOptions.minTerm,
    };

    this.$el = document.querySelector(selector);
    this.api = new ApiService(newOptions.urlApi);

    this.data = this.mountingData();
  }

  private mountingData = async () => {
    try {
      const data = await this.checkLocalData();

      const strHTML: HTMLElement = showMarkup(data, this.markupOptions);

      this.mountHTML(strHTML);
      this.rangeControl();
      this.handlersEvents();
      this.sortHandlers();
    } catch (e) {
      return console.error(e);
    }
  };

  private parsingLocalData = (): IGetData[] => {
    return JSON.parse(sessionStorage.getItem('programs') as string);
  };

  private checkLocalData = async (): Promise<IGetData[]> => {
    const localData: IGetData[] = this.parsingLocalData();

    let data: IGetData[];

    if (!localData) {
      data = await this.api.getData();

      sessionStorage.setItem('programs', JSON.stringify(data));
    } else {
      data = localData;
    }

    return data;
  };

  private mountHTML = (str: HTMLElement): void => {
    this.$el?.append(str);
  };

  private rangeControl = (): void => {
    const el = this.$el;

    const priceInput = <HTMLInputElement>el?.querySelector(Selectors.Price);
    const priceValue = <HTMLElement>el?.querySelector(Selectors.PriceValue);

    const contributionInput = <HTMLInputElement>(
      el?.querySelector(Selectors.Contribution)
    );
    const contributionValue = <HTMLElement>(
      el?.querySelector(Selectors.PriceContribution)
    );

    const changePrice = () => {
      priceValue.textContent = Number(priceInput?.value).toLocaleString();
    };

    const contributionPrice = () => {
      contributionValue.textContent = Number(
        contributionInput.value
      ).toLocaleString();
    };

    changePrice();

    contributionPrice();

    priceInput.addEventListener('input', changePrice);

    contributionInput.addEventListener('input', contributionPrice);
  };

  private handlersEvents = (): void => {
    const el = this.$el;

    const programs = <HTMLElement>el?.querySelector(Selectors.Programs);
    const settings = <HTMLElement>el?.querySelector(Selectors.Settings);

    let inputFields: IinputFields,
      rate: string = '',
      bank: string = '';

    programs.addEventListener('click', ({ target }) => {
      const isProgramItem = (target as HTMLElement).closest(
        Selectors.ProgramItem
      );
      const programItems = document.querySelectorAll(Selectors.ProgramItem);

      if (isProgramItem) {
        programItems.forEach((el) =>
          el.classList.remove(Classes.ProgramItemActive)
        );

        isProgramItem.classList.add(Classes.ProgramItemActive);
        rate = (isProgramItem as HTMLElement).dataset.rate || '';

        bank = (isProgramItem as HTMLElement).dataset.bank || '';

        inputFields = this.getCalcData(+rate, bank);

        this.calculateMortgage(inputFields);
      }
    });

    inputFields = this.getCalcData(+rate, bank);

    settings.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLInputElement;

      if (target.id === Classes.Price) {
        inputFields.price = +target?.value;
      }

      if (target.id === Classes.Contribution) {
        inputFields.contribution = +target.value;
      }

      if (target.id === Classes.Term) {
        inputFields.term = +target.value;
      }

      this.calculateMortgage(inputFields);
    });
  };

  private getCalcData = (
    rate: number = 0,
    bank: string = 'Выберите банк'
  ): IinputFields => {
    const el = this.$el;

    const priceInput = el?.querySelector(Selectors.Price) as HTMLInputElement;
    const contributionInput = el?.querySelector(
      Selectors.Contribution
    ) as HTMLInputElement;

    const termInput = el?.querySelector(Selectors.Term) as HTMLInputElement;

    return {
      price: +priceInput?.value,
      contribution: +contributionInput?.value,
      term: +termInput.value,
      rate,
      bank,
    };
  };

  private calculateMortgage = ({
    price,
    contribution,
    term,
    rate,
    bank,
  }: IinputFields): void => {
    const paymentObj: IPaymentObj<number> = {
      sumCredit: 0,
      monthlyPayment: 0,
      recommended: 0,
      rate,
      bank,
    };

    const numberOfMonths: number = term * 12;

    const lounAmount: number = price - contribution;

    const monthlyPayment: number =
      (lounAmount + (((lounAmount / 100) * rate) / 12) * numberOfMonths) /
      numberOfMonths;

    const recommendedIncome: string = (
      monthlyPayment +
      (monthlyPayment / 100) * 35
    ).toFixed();

    if (monthlyPayment > 0) {
      paymentObj.sumCredit = lounAmount;
      paymentObj.monthlyPayment = +monthlyPayment.toFixed();
      paymentObj.recommended = +recommendedIncome;
      paymentObj.rate = rate;
    }

    const results: HTMLElement | null | undefined = this.$el?.querySelector(
      Selectors.Results
    );

    if (results) {
      results.innerHTML = render(paymentObj);
    }
  };

  private sortHandlers = (): void => {
    const sortbyRate: HTMLElement | null = document.querySelector(
      Selectors.SortbyRate
    );
    const sortbyPopularity: HTMLElement | null = document.querySelector(
      Selectors.SortbyPopularity
    );

    sortbyRate?.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;

      if (
        !(target as HTMLElement).classList.contains(
          'programs__button-sort_is-choosen'
        )
      ) {
        target.classList.add('programs__button-sort_is-choosen');
        sortbyPopularity?.classList.remove('programs__button-sort_is-choosen');
        this.sortByRate();
      }
    });

    sortbyPopularity?.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;

      if (!target.classList.contains('programs__button-sort_is-choosen')) {
        target.classList.add('programs__button-sort_is-choosen');
        sortbyRate?.classList.remove('programs__button-sort_is-choosen');
        this.sortByPopularity();
      }
    });
  };

  private sortByRate = async (): Promise<void> => {
    const data: IGetData[] = await this.checkLocalData();

    const sorted: IGetData[] = data.sort((a, b) => a.rate - b.rate);
    this.renderSortedPrograms(sorted);
  };

  private sortByPopularity = async (): Promise<void> => {
    const data: IGetData[] = await this.checkLocalData();

    const sorted: IGetData[] = data.sort((a, b) => b.popularity - a.popularity);
    this.renderSortedPrograms(sorted);
  };

  private renderSortedPrograms = (sort: IGetData[]): void => {
    const listPrograms = this.$el?.querySelector(Selectors.ProgramsList);

    if (listPrograms) {
      listPrograms.innerHTML = buildPrograms(sort);
    }
  };

  public getData = async (): Promise<IGetData[]> => {
    try {
      const data = await this.checkLocalData();
      return data;
    } catch (e: any) {
      throw new Error(e);
    }
  };
}
