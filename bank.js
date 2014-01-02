// Object functions
var trans = function(type, text, amount){
	this.type = type;
	this.text = text;
	this.amount = amount;
	this.date = new Date();
	if (type  == "bill") {
		this.isPaid = false;
	};
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
			break;
		case "bill":
			bills.push(transaction);
			break;
		case "expense":
			calcBalance();
			if(balance < transaction.amount){
				console.log("Balance insufficent");
			}else{
				expenses.push(transaction);
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
		break;
		case "bill":
		modalTitle.innerHTML = "Bill Form";
		break;
		case "expense":
		modalTitle.innerHTML = "Expense Form";
		break;
	}
}

function logFromForm () {
	var form = document.getElementById("form");
	form = this.form;

	var newTransaction = new trans(form.type.value,form.text.value, parseFloat(form.amount.value))
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
				var dateText = c.date.toDateString();
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
				var dateText = c.date.toDateString();
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
				var dateText = c.date.toDateString();
				var text = c.text + " | <span class='glyphicon glyphicon-usd'></span>" + c.amount + " | <span class='glyphicon glyphicon-calendar'></span>: " + dateText;
				newItem.innerHTML = text;
				newItem.id = "bill_" + i;
				container.appendChild(newItem);
			};
		break;
		case "balance":
			container.innerHTML = balance;
		break;
	}

}
