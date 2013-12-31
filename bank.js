// Object functions
var deposit = function(date, amount){
	this.date = date;
	this.amount = amount;
};
var bill = function(name,amount,dueDate) {
	this.name = name;
	this.amount = amount;
	this.dueDate = dueDate;
	this.isPaid = false;
};
var expense = function(date, amount,reason) {
	this.date = date;
	this.amount = amount;
	this.reason = reason;
};

// Arrays 
var balance = 0;
var weekly = 0;
var bank = [];
var billList = [];
var expenseList = [];

// merge with form functions?
// Transaction Functions
var addToBank = function(dollars){
	bank.push(dollars);	
	console.log("you added " + dollars.amount + " to your bank!");
	calcBalance();
};
var addToBills = function(item){
	billList.push(item);
	console.log("You added " + item.name + " to your bill list!");
};
var addToExpenses = function(cost){
	calcBalance();
	if(balance > cost.amount){
		expenseList.push(cost);
		console.log("You spent $" + cost.amount +"!!");
		calcBalance();
	}else{
		console.log("You dont have enough money to cover this expense");
	}
};

var payBill = function(bill){
	calcBalance();
	if(balance > bill.amount){
		bill.isPaid = true;
		console.log("you paid: " + bill.name);
		addToExpenses(new expense("today", bill.amount, (bill.name + " paid")));
	}else {
		console.log("You don't have enough money to pay this bill!");
	}
};

// Upkeep functions
var calcBalance = function(){
	balance = 0;
	for(var i = 0; i < bank.length; i++){
		balance+=bank[i].amount;
	}
	for(var j = 0; j< expenseList.length; j++){
		balance-=expenseList[j].amount;
	}
	console.log("your cash balance is $" + balance);
};
var calcWeekly = function(){
	var total = 0;
	for(var i = 0; i < billList.length; i++){
		total += billList[i].amount;
	}
	weekly = total / 4;
	console.log("You must earn $" + weekly +" per week to pay your bills");
};


// Form functions
// merge from 3 into 1 function with 2 args, switch the 2nd arg. 
// combine functionality with the transaction functions? input will only come from browser?
function sendBill (form) {
	tempBill = new bill(form.name.value, parseFloat(form.amount.value), form.dueDate.value);
	addToBills(tempBill);
	draw('billContainer', billList);
}
function sendExpense (form) {
	tempExpense = new expense(form.date.value, parseFloat(form.amount.value), form.reason.value);
	addToExpenses(tempExpense);
	draw('expenseContainer', expenseList);
}
function sendDeposit (form) {
	tempDeposit = new deposit( form.date.value,parseFloat(form.amount.value));
	addToBank(tempDeposit);
	draw('depositContainer', bank);
}



//target is a string!
//change implimentation to use DOM object
function draw(target, arr){
	var container = document.getElementById(target);
	var  newDiv = document.createElement("div");
	newDiv.innerHTML = "";
	for(var i = 0; i < arr.length; i++){
		var c = arr[i];
		switch(target){
			case "depositContainer":
			newDiv.id = "deposit" + i;
			newDiv.innerHTML = "$" + c.amount + " | " + c.date;
			break;
			case "billContainer":
			newDiv.id = "bill" + i;
			newDiv.innerHTML = c.name + "<br>$" + c.amount + " | " + c.dueDate;;
			if(c.isPaid){
				newDiv.innerHTML += " &#10003;"
			}else{
				newDiv.innerHTML += " X"
			}
			break;
			case "expenseContainer":
			newDiv.id = "expense" + i;
			newDiv.innerHTML = "$" + c.amount + " | " + c.date + " <br> " + c.reason ; 
			break;
			default:
			console.log("bad container target");
			break;
		}
		container.appendChild(newDiv);
	}
}

/*
 DOM manipulation object.
 add, remove, toggle_visibility.


*/

function toggle_visibility (target){
	target = document.getElementById(target);
	if(target.style.display == "none"){
		target.style.display = "block";

	}else{
		target.style.display = "none";
	}
}