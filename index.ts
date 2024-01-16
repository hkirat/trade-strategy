import axios from "axios";
import { DepthManager } from "./DepthManager";
import { cancelAll, createOrder } from "./order";

const solInrMarket = new DepthManager("B-XAI_INR");

const usdtInrMarket = new DepthManager("B-USDT_INR");

const solUsdtMarket = new DepthManager("B-XAI_USDT");

setInterval(() => {
    console.log(solInrMarket.getRelevantDepth())
    console.log(usdtInrMarket.getRelevantDepth())
    console.log(solUsdtMarket.getRelevantDepth())
    // there are two sides you can sit on
    // sell SOL for INR, buy USDT from INR, buy SOL from INR
    // lets say u start with 1 SOL
    const canGetInr = solInrMarket.getRelevantDepth().lowestAsk - 0.001;
    const canGetUsdt = canGetInr / usdtInrMarket.getRelevantDepth().lowestAsk;
    const canGetSol = canGetUsdt / solUsdtMarket.getRelevantDepth().lowestAsk;
    
    console.log(`You can convert ${1} SOL into ${canGetSol} SOL`)

    // Buy SOL from INR, sell SOL for USDT, sell USDT for INR.
    const initialInr = solInrMarket.getRelevantDepth().highestBid + 0.001;
    const canGetUsdt2 = solUsdtMarket.getRelevantDepth().highestBid;
    const canGetInr2 = canGetUsdt2 * usdtInrMarket.getRelevantDepth().highestBid;

    console.log(`You can convert ${initialInr} INR into ${canGetInr2} INR`)
}, 2000)

async function main() {
    const highestBid = solInrMarket.getRelevantDepth().highestBid;
    console.log(`placing order for ${parseFloat(highestBid) + 0.01}`);
    await createOrder("buy", "XAIINR", (parseFloat(highestBid) + 0.01).toFixed(3), 10, Math.random().toString())
    await new Promise((r) => setTimeout(r, 10000));
    await cancelAll("XAIINR");
    await new Promise((r) => setTimeout(r, 1000));
    main();
}

setTimeout(async () => {
    main();
}, 2000)
