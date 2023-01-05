import axios from 'axios';
import { IGetData } from '../interfaces';

export default class ApiService {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  getData = async (): Promise<IGetData[]> => {
    try {
      return await axios.get(this.url).then(({ data }) => data);
    } catch (error: any) {
      throw new Error(error);
    }
  };
}
