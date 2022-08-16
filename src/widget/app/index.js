import ApiService from "../services/api";
import '../assets/scss/styles.scss';
import showMarkup, { render, buildPrograms } from '../templates/index';
import { CLASSES, SELECTORS } from "./variables";

export default class calcWidget {
	constructor(selector, options) {

		const defaultOptions = {
			wrapperStyles: '',
			minTerm: 3,
		}

		const newOptions = { ...defaultOptions, ...options };

		this.markupOptions = { wrapperStyles: newOptions.wrapperStyles, minTerm: newOptions.minTerm }

		this.$el = document.querySelector(selector)
		this.api = new ApiService(newOptions.urlApi);
		this.data = this.#mountingData();
	}
	
	#mountingData = async () => {
		try {
			const data = await this.api.getData();
			const strHTML = showMarkup(data, this.markupOptions);
			
			this.#mountHTML(strHTML);
			this.#rangeControl();
			this.#handlersEvents();
			this.#sortHandlers();
		} catch (e) {
			return console.error(e);
		}
	}

	#mountHTML = (str) => {
		this.$el.append(str);
	}

	#rangeControl = () => {
		const el = this.$el

		const priceInput = el.querySelector(SELECTORS.price);
		const priceValue = el.querySelector(SELECTORS.priceValue);

		const contributionInput = el.querySelector(SELECTORS.contribution);
		const contributionValue = el.querySelector(SELECTORS.priceContribution);

		const changePrice = () => {
			priceValue.textContent = Number(priceInput.value).toLocaleString();
		}

		const contributionPrice = () => {
			contributionValue.textContent = Number(contributionInput.value).toLocaleString();
		}

		changePrice();

		contributionPrice();

		priceInput.addEventListener('input', changePrice);

		contributionInput.addEventListener('input', contributionPrice);
	}

	#handlersEvents = () => {
		const el = this.$el

		const programs = el.querySelector(SELECTORS.programs);
		const settings = el.querySelector(SELECTORS.settings);
		let inputFields, rate, bank;

		programs.addEventListener('click', ({target}) => {
			const isProgramItem = target.closest(SELECTORS.programItem);
			const programItems = document.querySelectorAll(SELECTORS.programItem);

			if (isProgramItem) {
				programItems.forEach(el => el.classList.remove(CLASSES.programItemActive));
				isProgramItem.classList.add(CLASSES.programItemActive);
				rate = isProgramItem.dataset.rate;
				bank = isProgramItem.dataset.bank;

				inputFields = this.#getCalcData(rate, bank);

				this.#calculateMortgage(inputFields);
			}
		})

		inputFields = this.#getCalcData(rate, bank);

		settings.addEventListener('change', ({target}) => {
			if (target.id === CLASSES.price) {
				inputFields.price = target.value
			}

			if (target.id === CLASSES.contribution) {
				inputFields.contribution = target.value
			}

			if (target.id === CLASSES.term) {
				inputFields.term = target.value
			}

			this.#calculateMortgage(inputFields);
		})
	}

	#getCalcData = (rate = 0, bank = 'Выберите банк') => {
		const el = this.$el

		const priceInput = el.querySelector(SELECTORS.price);
		const contributionInput = el.querySelector(SELECTORS.contribution);
		const termInput = el.querySelector(SELECTORS.term);
		
		return {
			price: priceInput.value,
			contribution: contributionInput.value,
			term: termInput.value,
			rate,
			bank,
		}
	}

	#calculateMortgage = ({price, contribution, term, rate, bank}) => {
		const paymentObj = {
			sumCredit: 0,
			monthlyPayment: 0,
			recommended: 0,
			rate,
			bank,
		}

		const numberOfMonths = term  * 12

		const lounAmount = price - contribution

		const monthlyPayment = (lounAmount + ((( lounAmount / 100 ) * rate ) / 12 ) * numberOfMonths) / numberOfMonths

		const recommendedIncome = (monthlyPayment + (monthlyPayment / 100) * 35).toFixed();

		if (monthlyPayment > 0) {
			paymentObj.sumCredit = lounAmount
			paymentObj.monthlyPayment = monthlyPayment.toFixed()
			paymentObj.recommended = recommendedIncome
			paymentObj.rate = rate
		}

		this.$el.querySelector(SELECTORS.results).innerHTML = render(paymentObj);
	}

	#getData = async () => {
		try {
			const data = await this.api.getData();
			return data
		} catch (e) {
			return console.error(e);
		}
	}

	#sortHandlers = () => {
		const sortbyRate = document.querySelector(SELECTORS.sortbyRate);
		const sortbyPopularity = document.querySelector(SELECTORS.sortbyPopularity);

		sortbyRate.addEventListener('click', ({target}) => {

			if (!target.classList.contains('is-choosen')) {
				target.classList.add('is-choosen');
				sortbyPopularity.classList.remove('is-choosen');
				this.#sortByRate();
			}
		})

		sortbyPopularity.addEventListener('click', ({target}) => {

			if (!target.classList.contains('is-choosen')) {
				target.classList.add('is-choosen');
				sortbyRate.classList.remove('is-choosen');
				this.#sortByPopularity();
			}
		})
	}

	#sortByRate = async () => {
		const data = await this.#getData();

		const sorted = data.sort((a, b) => a.rate - b.rate)
		this.#renderSortedPrograms(sorted);
	}

	#sortByPopularity = async () => {
		const data = await this.#getData();
		
		const sorted = data.sort((a, b) => b.popularity - a.popularity)
		this.#renderSortedPrograms(sorted);
	}

	#renderSortedPrograms = (sort) => {
		const listPrograms = this.$el.querySelector(SELECTORS.programsList);
		listPrograms.innerHTML = buildPrograms(sort);
	}

	getData = async () => {
		try {
			const data = await this.api.getData();
			return data
		} catch (e) {
			return console.error(e);
		}
	}
}