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
//date prototype to return a weekNumber from the date.
Date.prototype.getWeekNumber = function(){
    var d = new Date(+this);
    d.setHours(0,0,0);
    d.setDate(d.getDate()+4-(d.getDay()||7));
    return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
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
	calcWeekly();	
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
	calcWeekly();
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
	var container = document.getElementById("weeklyBtn");
	container.innerHTML = weekly + " /wk"

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
				if(new Date(c.date).getWeekNumber() == new Date().getWeekNumber()){
					weekly -= c.amount

				}
			};
			var container = document.getElementById("weeklyBtn");
			if(weekly>=0){
			container.innerHTML = weekly + " /wk"
			}else{
				container.innerHTML = "0 /wk"
			}
		break;
		case "bills":
			for(var i =0; i < bills.length; i++){
			        var c = bills[i];
			        var now = new Date().getDate();
			        var nowMonth = new Date().getMonth();
			        var dueDate = new Date(c.date).getDate();
			        var dueMonth = new Date(c.date).getMonth();
			        var due = null;
			        if((dueDate - now < 15) && (dueMonth !== nowMonth)){
			        	due = false;
			        }else{
			        	due = true;
			        }

			        //jQuery courtesy of dave
			        //new jQuery object newItem with plaintext of the list element
			        var newItem = $(
			          '<li id="bill_'+ i +'" class="list-group-item '+((c.isPaid && !due)?'paid': 'unpaid')+'">' +
			            c.text + ' | <span class="glyphicon glyphicon-usd"></span>' + c.amount + ' | <span class="glyphicon glyphicon-calendar"></span>: ' + (new Date(c.date)).toDateString() + '<button class="btn btn-xs pull-right" data-id="'+i+'">Pay Me!</button>' +
			          '</li>'
			        );
			    //in the newItem find the button element and add the click function
				newItem.find('button').click(function(e) {
				  e.preventDefault();
				  // data-id attribute of the result of text.find('button'). FANTASTIC!! jQuery is da shit.
				  payBill(bills[parseInt($(this).attr('data-id'))],parseInt($(this).attr('data-id')));
				  return false;
				});
				//append newItem  to the container
			        $(container).append(newItem);
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
function payBill(bill, id){
	if(balance >= bill.amount){
		var newExpense = new trans("expense", "Paid " + bill.text, bill.amount);
		log(newExpense)
		bill.isPaid = true;
		var newDate = new Date(bill.date);
		newDate.setMonth(newDate.getMonth()+1);
		bill.date = new Date(newDate)
		bills.splice(id,1,bill);
		$db("bills").setObj(bills);
		draw('bills');
		draw('expenses');
	}else{
		alert("Not enough balance to pay this now!");
	}
}