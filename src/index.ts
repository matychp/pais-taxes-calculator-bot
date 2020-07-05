import * as dotenv from "dotenv";
import { Telegraf } from "telegraf";
import { getTotal } from "./taxCalculator";
import { getDolarPrice } from "./brca/bcra-api";
import { TelegrafContext } from "telegraf/typings/context";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const calculate = async ({ reply, message }: TelegrafContext) => {
    console.log(message.text)
    const parameters = message.text.split(" ", 4).slice(1);
    if (parameters.length < 1) {
        reply("You have to send the following parameters in order and separated with one space (only numbers)");
        reply("ProductPrice ShippingCost CustomTax")
        reply("e.g: /calculate 200 50 100")
        reply("Use /help if you don't understand what this params mean.")
    } else {
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

bot.start(({ reply }) => {
    reply("To start use the command /calculate")
    return
})

bot.command("calculate", async ctx => {
    return await calculate(ctx)
})
bot.command("currentDolarPrice", async ({ reply }) => {
    const currentDolarPrice = await getDolarPrice();
    return reply(String(currentDolarPrice))
})

bot.help(({ reply }) => reply(`
    Parameters:
    1. Product price: The price of the product that you want to buy.
    2. Shipping cost (optional): The cost of the shipping service (can be 0).
    3. Custom tax (optional): The percentage value that the custom of your country apply to the product when you import them (can be 0).
`));

bot.launch();
