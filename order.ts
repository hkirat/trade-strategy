const request = require('request')
const crypto = require('crypto')
const baseurl = "https://api.coindcx.com"
import { key, secret } from "./config";

export const createOrder = (side: "buy" | "sell", market: string, price: number, quantity: number, clientOrderId: string) => {
    return new Promise<void>((resolve) => {
        const body = {
            side,
            "order_type": "limit_order", 
            market,
            "price_per_unit": price,
            "total_quantity": quantity,
            "timestamp": Math.floor(Date.now()),
            "client_order_id": clientOrderId
        }
    
        const payload = new Buffer(JSON.stringify(body)).toString();
        const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex')
    
        const options = {
            url: baseurl + "/exchange/v1/orders/create",
            headers: {
                'X-AUTH-APIKEY': key,
                'X-AUTH-SIGNATURE': signature
            },
            json: true,
            body: body
        }
    
        request.post(options, function(error, response, body) {
            if (error) {
                console.log("error while cancelling orders");
            } else {
                console.log(body);
            }
            resolve();
        })
    
    })
    
}

export const cancelOrder = () => {

}

export const cancelAll = (market: string) => {
    return new Promise<void>((resolve) => {
        const body = {
            market,
            timestamp: Math.floor(Date.now())
        }
    
        const payload = new Buffer(JSON.stringify(body)).toString();
        const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex')
    
        const options = {
            url: baseurl + "/exchange/v1/orders/cancel_all",
            headers: {
                'X-AUTH-APIKEY': key,
                'X-AUTH-SIGNATURE': signature
            },
            json: true,
            body: body
        }
    
        request.post(options, function(error, response, body) {
            if (error) {
                console.log("error while cancelling orders");
            } else {
                console.log("acnceleled all orders");
                console.log(body);
            }
            resolve();
        })
    })
   
}