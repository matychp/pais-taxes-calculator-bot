import * as dotenv from "dotenv";
import { Telegraf } from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { getTotal } from "./taxCalculator";
import { getDolarPrice } from "./brca/bcra-api";

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN || null;

if (BOT_TOKEN === null) {
    throw Error("BOT_TOKEN is null")
}

const bot = new Telegraf(BOT_TOKEN);

const calculate = async (ctx: TelegrafContext) => {
    const { reply, message } = ctx
    if (message === undefined || message.text === undefined ) {
        reply("You have to send the following parameters in order and separated with one space (only numbers)");
        reply("ProductPrice ShippingCost CustomTax")
        reply("e.g: /calculate 200 50 100")
        reply("Use /help if you don't understand what this params mean.")
    } else {
        const parameters = message.text.split(" ", 4).slice(1);

        const [productValue = 0, shippingCost = 0, CustomTax = 0] = parameters

        const currentDolarPrice = await getDolarPrice();

        const total = getTotal(Number(productValue), Number(shippingCost), Number(CustomTax), currentDolarPrice)
        const isTotalANumber = !isNaN(total);
        if (isTotalANumber === true) {
            reply(`The total of your buy is $${total} ARS.`)
        } else {
            reply(`There was some problem with your inputs, please try again.`)
        }
    }
}

bot.start(({ reply }: TelegrafContext) => {
    reply("To start use the command /calculate")
    return
})

bot.command("calculate", async (ctx: TelegrafContext) => {
    return await calculate(ctx)
})
bot.command("currentDolarPrice", async ({ reply }: TelegrafContext) => {
    const currentDolarPrice = await getDolarPrice();
    return reply(String(currentDolarPrice))
})

bot.help(({ reply }: TelegrafContext) => reply(`
    Parameters:
    1. Product price: The price of the product that you want to buy.
    2. Shipping cost (optional): The cost of the shipping service (can be 0).
    3. Custom tax (optional): The percentage value that the custom of your country apply to the product when you import them (can be 0).
`));

bot.launch();
