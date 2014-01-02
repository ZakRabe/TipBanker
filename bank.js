// Object functions
var trans = function(type, text, amount){
	this.type = type;
	this.text = text;
	this.amount = amount;
	this.date = new Date();
	if (type == "bill") {
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
};

function inputSelect(target){
	form = document.getElementById('form');
	form.type.value = target;
	
}

function logFromForm (form) {
	var newTransaction = new trans(form.type.value,form.text.value, parseFloat(form.amount.value))
	log(newTransaction);
	document.getElementById("form").reset();
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



function toggle_visibility (target){
	target = document.getElementById(target);
	if(target.style.display == "none"){
		target.style.display = "block";

	}else{
		target.style.display = "none";
	}
}

// Draw function
//