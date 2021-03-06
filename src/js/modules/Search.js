import axios from "axios";
import { key } from "../config";

export default class Search {
  constructor(query) {
    this.query = query;
  }
  async getResults(query) {
    try {
      //saving promise result to res variable
      const res = await axios(
        `https://www.food2fork.com/api/search?key=${key}&q=${this.query}`
      );
      this.result = res.data.recipes;
      //console.log(this.result);
    } catch (error) {
      alert(error);
    }
  }
}
