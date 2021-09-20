const link = document.querySelectorAll('a');
const billEl = document.querySelector('.bill');
const currencyEl = document.querySelector('.currency');
const selectTipEl = document.querySelector('.selTip');
const ownEl = document.querySelector('#custom');
const numEl = document.querySelector('.num');
const errorTextEl = document.querySelector('.errorText');
const tipAmountEl = document.querySelector('.tipAmount');
const lightEl = document.querySelector('.light');
const totalTxtEl = document.querySelector('.totalTxt');
const light2El = document.querySelector('.light2');
const billAmount = document.querySelector('#bill');
const peopleAmount = document.querySelector('#people');
const billFrm = document.querySelector('.billform');


// onfocus and onblur all inputs
const inputs = document.getElementsByTagName('input');
for (let i = 0; i < inputs.length; i++) {
    inputs[i].onfocus = function(){
        this.value = '';
    }
    inputs[i].onblur = function(){
        if(this.value != '' && this.value != '0') {
            this.value = this.value;
        } else {
            this.value = this.defaultValue;
        }
    }
}


// change the language
link.forEach(el => {
    el.addEventListener('click', () => {
        const attr = el.getAttribute('language');
        billEl.textContent = data[attr].bill;
        currencyEl.textContent = data[attr].currency;
        selectTipEl.textContent = data[attr].selTip;
        ownEl.value = data[attr].custom;
        numEl.textContent = data[attr].num;
        errorTextEl.textContent = data[attr].errorText;
        tipAmountEl.textContent = data[attr].tipAmount;
        lightEl.textContent = data[attr].light;
        totalTxtEl.textContent = data[attr].totalTxt;
        light2El.textContent = data[attr].light2;
    });
});

let data = {
    'english': {
        'bill' : 'Bill',
        'currency' : '$',
        'selTip' : 'Select Tip %',
        'custom' : 'Custom',
        'num' : 'Number of People',
        'errorText' : `Can't be zero`,
        'tipAmount' : 'Tip Amount',
        'light' : '/ person',
        'totalTxt' : 'Total',
        'light2' : '/ person'
    },
    'polish': {
        'bill' : 'Rachunek',
        'currency' : 'zł',
        'selTip' : 'Napiwek %',
        'custom' : 'Własny',
        'num' : 'Ilość osób',
        'errorText' : 'Ilość nie może wynosić 0',
        'tipAmount' : 'Napiwek',
        'light' : '/ osoba',
        'totalTxt' : 'Łącznie',
        'light2' : '/ osoba'
    },
    'russian': {
        'bill' : 'Счёт',
        'currency' : '₽',
        'selTip' : 'Чаевые %',
        'custom' : 'Кастомные',
        'num' : 'Количество человек',
        'errorText' : 'Не может быть ровно 0',
        'tipAmount' : 'Чаевые',
        'light' : '/ человек',
        'totalTxt' : 'Итого',
        'light2' : '/ человек'
    }
}


//change style of buttons "Select Tip"
// const tipDev = document.querySelector('.tips');
// const tipsBtns = tipDev.querySelectorAll('button');
// for (let i = 0; i < tipsBtns.length; i++) {
//     tipsBtns[i].onclick = function() {
//         let el = tipsBtns[0];
//         while(el) {
//             if(el.tagName === 'BUTTON') {
//                 el.classList.remove('active');
//             }
//             el = el.nextSibling;
//         }
//         this.classList.add('active');
//     }
// }


// get a value from bill form => billValue
const bill = document.getElementById('bill');
bill.addEventListener('input', setBillValue);

function validateFloat(s) {
    let rgx = /^[0-9]*\.?[0-9]*$/;
    return s.match(rgx);
}

function setBillValue() {
    if (bill.value.includes(',')) {
        bill.value = bill.value.replace(',', '.');
    }
    if (!validateFloat(bill.value)) {
        bill.value = bill.value.substring(0, bill.value.length - 1);
    }
    billValue = parseFloat(bill.value);

    if (bill.value > 0) {
        billFrm.classList.add('billActive');
    } else {
        billFrm.classList.remove('billActive');
    }
    calculateTip();
    //console.log(billValue);
}


// get a value of tips => tipValue
let tipValue = 0;
const tipBtn = document.querySelectorAll('.btt');
tipBtn.forEach(btn => {
    btn.addEventListener('click', handleClick);
});

function handleClick(event) {
    tipBtn.forEach(btn => {
        btn.classList.remove('active');
        if (event.target.innerHTML == btn.innerHTML) {
            btn.classList.add('active');
            tipValue = parseFloat(btn.innerHTML) / 100;
        }
    });
    calculateTip();
    //console.log(tipValue);
}


// get a value from custom form => customValue

ownEl.addEventListener('input', getCustomValue);

function validateInt(s) {
    let rgx = /^[0-9]*$/;
    return s.match(rgx);
}

function getCustomValue() {

    if (ownEl.value.includes(',')) {
        ownEl.value = ownEl.value.replace(',', '.');
    }
    if (!validateInt(ownEl.value)) {
        ownEl.value = ownEl.value.substring(0, ownEl.value.length - 1);
    }
    
    tipValue = parseFloat(ownEl.value / 100);

    tipBtn.forEach(btn => {
        btn.classList.remove('active');
    });
    calculateTip()
    //console.log(tipValue);
}


// get a value from number of people form => peopleValue and add an error
const errorMsg = document.querySelector('.errorText');

const people = document.getElementById('people');
people.addEventListener('input', setPeopleValue);

var peopleValue = 1;
function setPeopleValue() {
    if (people.value.includes(',')) {
        people.value = people.value.replace(',', '.');
    }
    if (!validateFloat(people.value)) {
        people.value = people.value.substring(0, people.value.length - 1);
    }
    peopleValue = parseFloat(people.value);

    if (peopleValue <= 0) {
        errorMsg.classList.add('errorTextActive');
        peopleAmount.classList.add('error');
        totalTip.innerHTML = '0.00';
        total.innerHTML = '0.00';
        setTimeout(function() {
            totalTip.innerHTML = '0.00';
            total.innerHTML = '0.00';
            errorMsg.classList.remove('errorTextActive');
            peopleAmount.classList.remove('error');
        }, 2000);
    } 

    calculateTip()
    console.log(peopleValue);
}


// counting...
let totalTip = document.getElementById('totalTip');
let total = document.getElementById('total');

function calculateTip() {
    if (tipValue >= 0.01 && peopleValue > 0) {
        let tip = billValue * tipValue / peopleValue;
        let tot = billValue * (tipValue + 1) / peopleValue;
        totalTip.innerHTML = tip.toFixed(2);
        total.innerHTML = tot.toFixed(2);
    }
}



// resetBtn
let reset = document.querySelector('.resetBtn');
    reset.addEventListener('click', () => {
        billAmount.value = 0;
        setBillValue();
        peopleAmount.value = 1;
        setPeopleValue();
        ownEl.value = ownEl.defaultValue;
        totalTip.innerHTML = '0.00';
        total.innerHTML = '0.00';
        tipBtn.forEach(btn => {
            btn.classList.remove('active');
        });
    });