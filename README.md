# mortgage-widget

## Перед вами виджет калькулятор ипотеки созданный в учебных целях.

Формат json обьекта:

```
{
  "bank": string,
  "rate": number,
  "image": string,
  "popularity": number
}
```

Features: parcel, typescript, axios, es6 classes, sort by rating / sort by popularity.

Добавил один метод для вызова из вне - getData() для получения списка банков:

```
const widget = new calcWidget('#calc_widget', options);

const getDataFromWidget = async () => {
  const data = await widget.getData();

  const newData = transformData(data)

  console.log(...newData);
}

const transformData = (data) => {
  return data.map((el) => {
    return {
      ...el,
      info: `${el.bank} ставка: ${el.rate}`
    }
  })
}

getDataFromWidget();

```
