export default class ApiService {
  constructor(url) {
    this.url = url;
  }

  getData = async () => {
    try {
      const data = await fetch(this.url);
      const json = await data.json();
      return json;
    } catch (error) {
      return new Error(error);
    }
  };
}
