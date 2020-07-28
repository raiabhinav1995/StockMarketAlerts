const si=require('stock-info');
const credentials=require('./credentials');
let transporter=credentials.transporter;
let mailOptions=credentials.mailOptions;
const cron=require('node-schedule');
class StockLibrary
{
    constructor(boughtPrice, stockTrigger, quantity)
    {
        this.stockTrigger=stockTrigger;
        this.boughtPrice=boughtPrice;
        this.quantity=quantity;
        this.currentPrice;
        this.stockName;
        return this;
    }
    async getStockObj(stockTrigger)
    {
        return await si.getSingleStockInfo(stockTrigger).then
        (
            
            data=>
            {//console.log(data);
                return {price:data.regularMarketPrice,name:data.longName}
                
            }
        );
    }
    totalProfitTotalLoss(stockObj)
    {
        let boughtPrice=stockObj.boughtPrice;
        let quantity=stockObj.quantity;
        let pricePaid=quantity*boughtPrice;
        let currentPrice=quantity*stockObj.currentPrice;
        let totalprofitorloss=currentPrice-pricePaid;
        if(totalprofitorloss>0)
        console.log(`The stock ${stockObj.stockName} you bought for ${pricePaid} is worth ${currentPrice} which makes total profit of ${totalprofitorloss.toFixed(2)}`);
        else
        {
            console.log(`The stock ${stockObj.stockName} you bought for ${pricePaid} is worth ${currentPrice} which makes total loss of ${totalprofitorloss.toFixed(2)}`); 
        }
    }
        


}
function sendHourlyReport(stockArray)
    {
        let hours=new Date().getHours();
        let subject=`Hourly Report for ${hours}`;
        let body='';
        for(let i=0;i<stockArray.length;i++)
        {
            let stockObj=stockArray[i].sl;
        let stockName=stockObj.stockName;
        let currentStockPrice=stockObj.currentPrice;
        let quantityOwned=stockObj.quantity;
        let stockBoughtPrice=stockObj.boughtPrice;
        body+=`Your stock:${stockName}\n is trading at Current Price:${currentStockPrice}\n you bought quantity:${quantityOwned} shares \ncosting Total Price:${quantityOwned*stockBoughtPrice}\n and now is having value Current Value: ${currentStockPrice*quantityOwned}\n which makes a profit or loss of ${checkProfitOrLossPercent(stockObj)}%\n\n`;
        }
        console.log(body);

        sendEmail(subject, body);
         
    }
    function sendEmail(subject, body)
    {
        mailOptions.subject=subject;
        mailOptions.text=body;
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    }
    function checkProfitOrLossPercent(stockObj)
    {
        let myStockPrice=stockObj.boughtPrice;
        let currentPrice=stockObj.currentPrice;
        let stockName=stockObj.stockName;
        let profitOrLossPercent=(currentPrice-myStockPrice)/myStockPrice*100;
        console.log(`The stock ${stockName} you bought is at ${myStockPrice} which is at a profit of ${profitOrLossPercent} %`);
        if(profitOrLossPercent>10)
        {
            let subject='Stocks which can be sold';
            let body=`The stock ${stockName} you bought is at ${this.stock.boughtPrice} which is at a profit of ${profitOrLossPercent} %`;
        }
        return profitOrLossPercent;

     }
class Stock
{
    constructor(boughtPrice, stockTrigger, quantity)
    {
        this.sl=new StockLibrary(boughtPrice,stockTrigger,quantity);
    }

}

stocks=[
    new Stock(1005.29,'UBL.NS',8),
    new Stock(3301.80,'BAJFINANCE.NS',1),
    new Stock(694,'BEML.NS',2),
    new Stock(212.95,'MIDHANI.NS',10),
    new Stock(130.15,'ITI.NS',5),
    new Stock(101.95,'BEl.NS',10),
    new Stock(26.45,'YESBANK.NS',100),
    new Stock(261.95,'INOXLEISUR.NS',2)
    ]   

    async function run(){
        for(let i=0;i<stocks.length;i++)
    {
        let nameprice=await stocks[i].sl.getStockObj(stocks[i].sl.stockTrigger);
        stocks[i].sl.currentPrice=nameprice.price;
        stocks[i].sl.stockName=nameprice.name;
    }
    return stocks;
}
run().then(stocks=>
    {
        var j=cron.scheduleJob('00 09-15 * * 1-5',()=>sendHourlyReport(stocks));
    });
    

    
