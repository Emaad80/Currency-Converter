const BASE_URL = "https://v6.exchangerate-api.com/v6/ed75d670ebc2046d0d7bbc85";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currency codes
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }
  const URL = `${BASE_URL}/latest/${fromCurr.value}`;
  try {
    let response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    let data = await response.json();
    let rate = data.conversion_rates[toCurr.value];
    if (!rate) {
      throw new Error("Exchange rate not available.");
    }
    let finalAmount = amtVal * rate;
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${
      toCurr.value
    }`;
  } catch (error) {
    msg.innerText = `Error: ${error.message}`;
    console.error(error);
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
  img.onerror = () => {
    img.src = "https://via.placeholder.com/64"; // Default flag image if the API fails
  };
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});
