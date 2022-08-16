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

Features: parcel, es6 classes

Добавил один метод для вызова из вне - getData() для получения списка банков: 

```
const widget = new calcWidget('#calc_widget', options);

const getDataFromWidget = async () => {
  const data = await widget.getData();

  const newData = transformData(data)

  console.log(...newData);
}

```
