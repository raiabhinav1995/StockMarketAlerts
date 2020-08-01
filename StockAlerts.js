const si=require('stock-info');
const credentials=require('./credentials');
let transporter=credentials.transporter;
let mailOptions=credentials.mailOptions;
const cron=require('node-schedule');
async function getStockObj(stockTrigger)
    {
        return await si.getSingleStockInfo(stockTrigger).then
        (
            
            data=>
            {//console.log(data);
                return {price:data.regularMarketPrice,name:data.longName,}
                
            }
        );
    }
function sendHourlyReport(stockArray)
    {
        let hours=new Date().getHours();
        let subject=`Hourly Report for ${hours}`;
        let body='';
        for(let i=0;i<stockArray.length;i++)
        {
        let stockObj=stockArray[i];
        let stockName=stockObj['stockName'];
        let currentStockPrice=stockObj.currentPrice;
        let quantityOwned=stockObj.quantity;
        let stockBoughtPrice=stockObj.boughtPrice;
        totalProfitOrLoss+=(currentStockPrice*quantityOwned)-(stockBoughtPrice*quantityOwned);
        body+=`Your stock:${stockName}\n is trading at Current Price:${currentStockPrice}\n you bought quantity:${quantityOwned} 
        shares \ncosting Total Price:${quantityOwned*stockBoughtPrice}\n and now is having value Current Value: ${currentStockPrice*quantityOwned}\n 
        which makes a profit or loss of ${checkProfitOrLossPercent(stockObj).toFixed(2)}%\n\n`;
        if(i===stockArray.length-1)
        body+=`Total Profit or Loss for your total trade is ${totalProfitOrLoss.toFixed(2)}`;
        }
        //console.log(body);

        sendEmail(subject, body);
         
    }
    function sendEmail(subject, body)
    {
        mailOptions.subject=subject;
        mailOptions.text=body;
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              //console.log(error);
            } else {
              console.log('Email sent: at',new Date().getHours() + " ");
            }
          });
    }
    function checkProfitOrLossPercent(stockObj)
    {
        let myStockPrice=stockObj.boughtPrice;
        let currentPrice=stockObj.currentPrice;
        let stockName=stockObj.stockName;
        let profitOrLossPercent=(currentPrice-myStockPrice)/myStockPrice*100;
        //console.log(`The stock ${stockName} you bought is at ${myStockPrice} which is at a profit of ${profitOrLossPercent} %`);
        if(profitOrLossPercent>10)
        {
            let subject='Stocks which can be sold';
            let body=`The stock ${stockName} you bought is at ${myStockPrice} which is at a profit of ${profitOrLossPercent} %`;
            sendEmail(subject, body);
        }
        return profitOrLossPercent;

     }
class Stock
{
    constructor(boughtPrice, stockTrigger, quantity, currentPrice=0, stockName='')
    {
        this.boughtPrice=boughtPrice;;
        this.stockTrigger=stockTrigger;
        this.quantity=quantity;
    }

}
let totalProfitOrLoss=0;
stocks=[
    new Stock(1005.29,'UBL.NS',8),
    new Stock(3301.80,'BAJFINANCE.NS',1),
    new Stock(370.01,'TATASTEEL.NS',10),
    new Stock(694,'BEML.NS',2),
    new Stock(212.95,'MIDHANI.NS',10),
    new Stock(95.85,'BEl.NS',10),
    new Stock(26.45,'YESBANK.NS',100),
    new Stock(258.75,'INOXLEISUR.NS',10)
    ]   

    async function run(){// Adding the price and name of stock to current Stock Object in the array
        for(let i=0;i<stocks.length;i++)
    {
        let nameprice=await getStockObj(stocks[i].stockTrigger);
        stocks[i]['currentPrice']=nameprice.price;
        stocks[i]['stockName']=nameprice.name;
        //console.log(stocks[i], nameprice);
    }
    return stocks;
}
run().then(stocks=>
    {
        sendHourlyReport(stocks);
        //var j=cron.scheduleJob('00 09-15 * * 1-5',()=>sendHourlyReport(stocks));
        //console.log(totalProfitOrLoss);
    });
    

    
