import createElement from '../helpers/createElement';

export default function showMarkup(data, { wrapperStyles, minTerm }) {
  const wrapper = createElement('div', 'wrapper');

  wrapper.style.cssText = wrapperStyles;

  const divs = ['settings', 'programs', 'results'];

  divs.forEach((div) => {
    const element = createElement('div', div);
    wrapper.append(element);
    wrapper.append(element);
  });

  wrapper.querySelector('.results').innerHTML = render({
    sumCredit: 0,
    monthlyPayment: 0,
    recommended: 0,
    rate: 0,
  });

  wrapper.querySelector('.settings').innerHTML = `
		<div class="settings__item">
			<label for="price">Стоимость жилья</label>
			<input type="range" name="price" id="price" min="0" max="100000000" step="100000" value="0">
			<div id="price-value">0</div>
		</div>
		<div class="settings__item">
			<label for="contribution">Первоначальный взнос</label>
			<input type="range" name="contribution" id="contribution" min="0" max="100000000" step="100000" value="0">
			<div id="contribution-value">0</div>
		</div>
		<div class="settings__item">
			<label for="term">Срок кредита</label>
			<input type="number" name="term" id="term" min="${minTerm}" max="30" value="${minTerm}" inputmode="numeric">
		</div>
	`;

  const listPrograms = createElement('div', 'programs__list');

  listPrograms.innerHTML = buildPrograms(data);

  const programsHeader = createElement('div', 'programs__header');

  programsHeader.innerHTML = `
		<div class="programs__title">Выберите банк</div>
		<div class="programs__sort">
			<button class="programs__button-sort programs__sortby-rate">Сортировать по низкой ставке</button>
			<button class="programs__button-sort programs__sortby-popularity">Сортировать по популятности</button>
		</div>
	`;

  wrapper.querySelector('.programs').append(programsHeader);
  wrapper.querySelector('.programs').append(listPrograms);

  return wrapper;
}

const render = ({
  rate,
  sumCredit,
  monthlyPayment,
  recommended,
  bank = 'Выберите банк',
}) => {
  return `
		<div class="results__item">
			<div class="results__item-title">Ставка:</div>
			<div class="results__item-value">${rate} %</div>
		</div>
		<div class="results__item">
			<div class="results__item-title">Банк:</div>
			<div class="results__item-value">${bank}</div>
		</div>
		<div class="results__item">
			<div class="results__item-title">Сумма кредита:</div>
			<div class="results__item-value">${sumCredit.toLocaleString()} ₽</div>
		</div>
		<div class="results__item">
			<div class="results__item-title">Ежемесячный платеж:</div>
			<div class="results__item-value">${monthlyPayment.toLocaleString()} ₽</div>
		</div>
		<div class="results__item">
			<div class="results__item-title">Рекомендуемый доход:</div>
			<div class="results__item-value">${recommended.toLocaleString()} ₽</div>
		</div>
	`;
};

const buildPrograms = (data) => {
  let htmlString = '';

  data.forEach((el) => {
    htmlString += `
			<div class="programs__item" data-rate="${el.rate}" data-bank="${el.bank}">
				<img src="${el.image}" alt="${el.bank}" class="programs__img" loading="lazy">
				<div class="programs__info">
					<div class="programs__bank">${el.bank}</div>
					<div class="programs__rate">Ставка от ${el.rate} %</div>
				</div>
			</div>`;
  });

  return htmlString;
};

export { render, buildPrograms };
