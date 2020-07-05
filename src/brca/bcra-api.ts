import * as dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import { Dolar } from "./dolar.interface"

const httpService = axios.create({
    baseURL: process.env.BCRA_API
})

httpService.defaults.headers.common['Authorization'] = `BEARER ${process.env.BCRA_TOKEN}`;

export const getDolarPrice = async () => {
    const { data: dolarHistory } = await httpService.get<Dolar[]>("usd")
    const lastPrice = dolarHistory[dolarHistory.length - 1].v
    return lastPrice
}
