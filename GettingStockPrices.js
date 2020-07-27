const si=require('stock-info');
const credentials=require('./credentials');
let transporter=credentials.transporter;
let mailOptions=credentials.mailOptions;
class StockLibrary
{
    constructor(boughtPrice, stockTrigger, quantity)
    {
        this.stock=new Stock(boughtPrice, stockTrigger, quantity);
        setInterval(()=>this.returnStockPriceAndName(this.stock.boughtPrice,this.stock.stockTrigger,this.stock.quantity), 5000);

    }
    //currentPrice=this.returnStockPriceAndName(this.stockTrigger);
    returnStockPriceAndName(boughtPrice, stockTrigger, quantity){
        //let price=0;
    si.getSingleStockInfo(stockTrigger).then(data=> 
        {
            let stockObj=
            {
                stockPrice: data.regularMarketPrice,
                stockName: data.longName
            }
            //let TotalprofitOrLoss=this.totalProfitTotalLoss(boughtPrice,stockObj,quantity);
            //console.log(stockObj.stockName+"  "+TotalprofitOrLoss);
            this.checkProfitOrLossPercent(boughtPrice,stockObj);
        })//return data;price=data.regularMarketPrice;console.log(price);});
    //return price;
    }
    totalProfitTotalLoss(boughtPrice,stockObj,quantity)
    {
        let totalprofitorloss=boughtPrice-stockObj.stockPrice;
        return -quantity*totalprofitorloss;
    }
        checkProfitOrLossPercent(myStockPrice,stockObj)
    {
        //console.log(stockObj.stockPrice);
        let currentPrice=stockObj.stockPrice;
        let stockName=stockObj.stockName;
        let profitOrLossPercent=(currentPrice-myStockPrice)/myStockPrice*100;
        //console.log(`The stock ${stockObj.stockName} is trading at ${stockObj.stockPrice}, you bought is at ${this.stock.boughtPrice} which is at a profit of ${profitOrLossPercent} %`);
        
        if(profitOrLossPercent>10)
        {
            this.sendEmailToSell(stockObj.stockName, profitOrLossPercent);
        }

     }
    sendEmailToSell(stockName, profitOrLossPercent)
    {
        console.log(`The stock ${stockName} you bought is at ${this.stock.boughtPrice} which is at a profit of ${profitOrLossPercent} %`);
        mailOptions.subject='Sell stocks';
        mailOptions.text=`The stock ${stockName} you bought is at ${this.stock.boughtPrice} which is at a profit of ${profitOrLossPercent} %`;
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    }


}


class Stock
{
    constructor(boughtPrice, stockTrigger, quantity)
    {
        this.boughtPrice=boughtPrice;
        this.stockTrigger=stockTrigger;
        this.quantity=quantity;
    }
    
}

let UnitedBreweries=new StockLibrary(1005.29,'UBL.NS',8);
let BajajFinance=new StockLibrary(3301.80,'BAJFINANCE.NS',1);
let BEML=new StockLibrary(694,'BEML.NS',2);
let MishraDhatu=new StockLibrary(212.95,'MIDHANI.NS',10);
let ITI=new StockLibrary(130.15,'ITI.NS',5);
let BharatElec=new StockLibrary(101.95,'BEl.NS',10);
let YesBank=new StockLibrary(26.45,'YESBANK.NS',100);
let INOXLeisure=new StockLibrary(261.95,'INOXLEISUR.NS',2);
//console.log(stock.profitOrLossPercent());