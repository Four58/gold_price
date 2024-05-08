import { JSDOM } from "jsdom";
import request from "request";
import { Server as socketIOServer } from "socket.io";
import http from "http";
import { checkGoldPriceExist } from "./utils/checkGoldPrice";
import express from "express";

const app = express();
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("hello from port 3000");
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});

const io = new socketIOServer(server);

const GOLD_PRICE_URL = "https://xn--42cah7d0cxcvbbb9x.com/";

// Function to scrape gold price
const scrapeGoldPrice = () => {
  request(GOLD_PRICE_URL, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const dom = new JSDOM(body);
      const goldBarPriceBuyElement = dom.window.document.querySelector(
        "#rightCol > div.divgta.goldshopf > table > tbody > tr:nth-child(1) > td:nth-child(2)"
      );
      const goldBarPriceSellElement = dom.window.document.querySelector(
        "#rightCol > div.divgta.goldshopf > table > tbody > tr:nth-child(1) > td:nth-child(3)"
      );
      const goldJewelryPriceBuyElement = dom.window.document.querySelector(
        "#rightCol > div.divgta.goldshopf > table > tbody > tr:nth-child(2) > td:nth-child(2)"
      );
      const goldJewelryPriceSellElement = dom.window.document.querySelector(
        "#rightCol > div.divgta.goldshopf > table > tbody > tr:nth-child(2) > td:nth-child(3)"
      );

      const goldBarPriceBuy = checkGoldPriceExist(goldBarPriceBuyElement);
      console.log("ทองคำแท่ง รับซื้อ:", goldBarPriceBuy);

      const goldBarPriceSell = checkGoldPriceExist(goldBarPriceSellElement);
      console.log("ทองคำแท่ง ขายออก:", goldBarPriceSell);

      const goldJewelryPriceBuy = checkGoldPriceExist(
        goldJewelryPriceBuyElement
      );
      console.log("ทองรูปพรรณ รับซื้อ:", goldJewelryPriceBuy);

      const goldJewelryPriceSell = checkGoldPriceExist(
        goldJewelryPriceSellElement
      );
      console.log("ทองรูปพรรณ ขายออก:", goldJewelryPriceSell);

      const goldPrice = {
        goldBarPriceBuy: goldBarPriceBuy,
        goldBarPriceSell: goldBarPriceSell,
        goldJewelryPriceBuy: goldJewelryPriceBuy,
        goldJewelryPriceSell: goldJewelryPriceSell,
      };

      console.log(goldPrice);

      io.emit("goldPrice", goldPrice);
    } else {
      console.error("Error fetching the page:", error);
    }
  });
};

// Scrape gold price every 5 sec (adjust as needed)
setInterval(scrapeGoldPrice, 5 * 1000);
