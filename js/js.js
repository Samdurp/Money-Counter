// Time in hz that the count will increase. Likely don't need to go above 60
const countUpdateFrequency = 60;

// Used to format floats to be in a currency format
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

// TODO
const workDayLength = 3;

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

        // Disables input field and radio buttons so nothing can be changed one it starts
        toggleInput(false);

        count(selectedPayType, inputtedPay);
    }
}

async function count(payType, pay)
{
    let count = 0;
    timeCountSeconds();
    while (true)
    {
        await sleep(1000);
        if (payType == "wage")
            count += ((pay/3600));
        else if (payType == "salary")
            count += ((pay/31536000)*3); // The multiplying by 3 makes it 8 hours for a workday. Add the ability to alter this.
        realtimeMoneyCount.innerText = "Money made: " + currencyFormatter.format(count);
    }
}

async function timeCountSeconds()
{
    realtimeCount.innerText = "Time elapsed: 00:00:00";
    let time = 0;
    while (true)
    {
        await sleep(1000);
        time++;
        realtimeCount.innerText = "Time elapsed: " + new Date(time * 1000).toISOString().slice(11, 19);
    }
}

function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

function toggleInput(on)
{
    let radioButtons = document.getElementsByClassName("moneyInputFieldRadio");
    if (on)
    {
        for(i = 0; i < radioButtons.length; i++)
            radioButtons[i].disabled = false;
        document.getElementById("moneyInputField").readOnly = false;
    }
    else if (!on)
    {
        for(i = 0; i < radioButtons.length; i++)
            radioButtons[i].disabled = true;
        document.getElementById("moneyInputField").readOnly = true;
    }
}
