// Time in hz that the count will increase. Likely don't need to go above 60
const countFrequency = 60;

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

// Function that will run all init stuff on page load
function initJS()
{
    initMoneyInputFieldSubmitBtn();
}

function initMoneyInputFieldSubmitBtn()
{
    // Listener for the submit button for selecting wage vs salary\
    const btn = document.querySelector('#moneyInputFieldSubmitBtn');      

    const radioButtons = document.querySelectorAll('input[class="moneyInputFieldRadio"]');
    const inputFields = document.querySelectorAll('input[class="moneyInputField"]');

    let selectedPayType = "NULL";
    let inputtedPay = "NULL";

    btn.addEventListener("click", () => 
    {
        for (const radioButton of radioButtons) 
            if (radioButton.checked) 
            {
                selectedPayType = radioButton.value;
                break;
            }
        for (const inputField of inputFields)
            inputtedPay = inputField.value;

        confirmValidInputs(selectedPayType, inputtedPay);
    });
}

function confirmValidInputs(selectedPayType, inputtedPay)
{
    // Checks to see if the user has inputted data in the necessary fields
    let inputsAreValid = false;
    if (selectedPayType == "NULL" && inputtedPay == "")
        moneyInputFieldFeedback.innerText = `Please select a pay type and enter a pay amount`;
    else if (selectedPayType == "NULL" && inputtedPay != "")
        moneyInputFieldFeedback.innerText = `Please select a pay type`;
    else if (inputtedPay == "" && selectedPayType != "NULL")
        moneyInputFieldFeedback.innerText = `Please enter a pay amount`;
    else
        inputsAreValid = true;

    // If everything was inputted correctly into the money input fields, then give feedback saying what they entered
    if (inputsAreValid)
    {
        if (selectedPayType == "wage")
            moneyInputFieldFeedback.innerText = `You selected a wage of $${inputtedPay} per hour`;
        else if (selectedPayType == "salary")
            moneyInputFieldFeedback.innerText = `You selected a salary of $${inputtedPay} per year`;

        count(selectedPayType, inputtedPay);
    }
}

async function count(payType, pay)
{
    var startTime, endTime;
    startTime = new Date();

    let count = 0;
    let time = 0;
    while (true)
    {
        await sleep(1000);
        time++;
        if (payType == "wage")
            count += ((pay/3600));
        realtimeMoneyCount.innerText = formatter.format(count);
        realtimeCount.innerText = time;
    }
}

function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}