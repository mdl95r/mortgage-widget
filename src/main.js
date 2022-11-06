import calcWidget from './widget/app/index';

document.addEventListener('DOMContentLoaded', () => {
  const URL = 'https://mdl95r.github.io/API/credit-calc/credit-programs.json';

  const options = {
    urlApi: URL,
    wrapperStyles: 'max-width: 1100px; margin: 0px auto;',
    minTerm: 5,
  };

  const widget = new calcWidget('#calc_widget', options);

  const getDataFromWidget = async () => {
    const data = await widget.getData();

    const newData = transformData(data);

    console.log(...newData);
  };

  const transformData = (data) => {
    return data.map((el) => {
      return {
        ...el,
        info: `${el.bank} ставка: ${el.rate}`,
      };
    });
  };

  getDataFromWidget();
});
