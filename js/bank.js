// Object functions
// localStorage with objects! thanks dave! https://github.com/dparlevliet/html5-localStorage-db
try {
  'localStorage' in window && window['localStorage'] !== null;
} catch (e) {
  // fake it
  window.localStorage = {
    __store__: {},
    setItem: function(key, value) {
      this.__store__[key] = value;
    },
    getItem: function(key) {
      try {
        return this.__store__[key];
      } catch(e) {
        return undefined;
      }
    }
  }; 
}
window.$db = function(key) {
  return {
    set: function(value) {
      return localStorage.setItem(key, value);
    },
    get: function() {
      return localStorage.getItem(key);
    },
    setObj: function(value) {
      return localStorage.setItem(key, JSON.stringify(value));
    },
    getObj: function() {
      var item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
    },
    remove: function() {
      localStorage.removeItem(key);
    }
  };
};

var clearIt = function(){
	$db('bills').remove();
	$db('deposits').remove();
	$db('expenses').remove();
	balance = 0;
	weekly = 0;
	bank = [];
	bills = [];
	expenses = [];
	draw("deposits");
	draw("bills");
	draw("expenses");
	draw("balance");	
};

var trans = function(type, text, amount, date){
	this.type = type;
	this.text = text;
	this.amount = amount;
	
	if (type  == "bill") {
		this.isPaid = false;
		this.date = date;
	}else{
		this.date = new Date();
	}
};


// Arrays 
var balance = 0;
var weekly = 0;
var bank = [];
var bills = [];
var expenses = [];



var log = function(transaction){
	switch(transaction.type){
		case "deposit":
			bank.push(transaction);
			$db("deposits").setObj(bank);
			break;
		case "bill":
			bills.push(transaction);
			$db("bills").setObj(bills);
			break;
		case "expense":
			calcBalance();
			if(balance < transaction.amount){
				console.log("Balance insufficent");
			}else{
				expenses.push(transaction);
				$db("expenses").setObj(expenses);
			}
			break;
		default:
			console.log("Bad transaction type");
			break;
	}
	calcBalance();
	draw("balance");
};

function inputSelect(target){
	form = document.getElementById('form');
	form.type.value = target;	
	var modalTitle = document.getElementById("modalTitle");

	switch(target){
		case "deposit":
		modalTitle.innerHTML = "Deposit Form";
		document.getElementById("dp").style.display="none";
		break;
		case "bill":
		modalTitle.innerHTML = "Bill Form";
		document.getElementById("dp").style.display="block";
		break;
		case "expense":
		modalTitle.innerHTML = "Expense Form";
		document.getElementById("dp").style.display="none";
		break;
	}
}

function logFromForm () {
	var form = document.getElementById("form");
	form = this.form;
	var newTransaction = new trans(form.type.value,form.text.value, parseFloat(form.amount.value),form.datepicker.value)
	log(newTransaction);
	document.getElementById("form").reset();
	$('#myModal').modal('toggle');
	draw(form.type.value + "s");
}

// Upkeep functions
var calcBalance = function(){
	balance = 0;
	for(var i = 0; i < bank.length; i++){
		balance+=bank[i].amount;
	}
	for(var j = 0; j< expenses.length; j++){
		balance-=expenses[j].amount;
	}
	console.log("your cash balance is $" + balance);
	
};
var calcWeekly = function(){
	var total = 0;
	for(var i = 0; i < bills.length; i++){
		total += bills[i].amount;
	}
	weekly = total / 4;
	console.log("You must earn $" + weekly +" per week to pay your bills");
};


function draw(target){
	var container = document.getElementById(target);
	container.innerHTML = "";
	
	switch(target){
		case "deposits":
			for(var i =0; i < bank.length; i++){
				var newItem = document.createElement('li');
				newItem.className = "list-group-item";
				var c = bank[i];
				var dateText = new Date(c.date).toDateString();
				var text = c.text + " | <span class='glyphicon glyphicon-usd'></span>" + c.amount + " | <span class='glyphicon glyphicon-calendar'></span>: " + dateText;
				newItem.innerHTML = text;
				newItem.id = "deposit_" + i;
				container.appendChild(newItem);
			};
			
		break;
		case "bills":
			for(var i =0; i < bills.length; i++){
				var newItem = document.createElement('li');
				newItem.className = "list-group-item";
				var c = bills[i];
				if(c.isPaid){
					newItem.className += " paid";
				}else{
					newItem.className += " unpaid";
				}
				var dateText = new Date(c.date).toDateString();
				var text = c.text + " | <span class='glyphicon glyphicon-usd'></span>" + c.amount + " | <span class='glyphicon glyphicon-calendar'></span>: " + dateText;
				if (!c.isPaid) {
				text += " | <span class='glyphicon glyphicon-unchecked'></span>"
				}else{
					text+= " | <span class='glyphicon glyphicon-checked'></span>"
				}
				newItem.innerHTML = text;
				newItem.id = "bill_" + i;

				container.appendChild(newItem);	
			};
		break;
		case "expenses":
				for(var i =0; i < expenses.length; i++){
				var newItem = document.createElement('li');
				newItem.className = "list-group-item";
				var c = expenses[i];
				var dateText = new Date(c.date).toDateString();
				var text = c.text + " | <span class='glyphicon glyphicon-usd'></span>" + c.amount + " | <span class='glyphicon glyphicon-calendar'></span>: " + dateText;
				newItem.innerHTML = text;
				newItem.id = "bill_" + i;
				container.appendChild(newItem);
			};
		break;
		case "balance":
			calcBalance();
			container.innerHTML = balance;
		break;
	}

}
