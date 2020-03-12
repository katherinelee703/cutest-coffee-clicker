/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  document.getElementById("coffee_counter").innerText = coffeeQty;
}

function clickCoffee(data) {
  const plusOne = ++data.coffee;
  document.getElementById("coffee_counter").innerText = plusOne;
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  // your code here
  /*
  1. run through every producer in the producers array
  2. on each i, check if the producers value is >= half of the required amount
  3. if true, toggle unlocked to true;
  */
  for (let i = 0; i < producers.length; i++) {
    let producer = producers[i];
    if (coffeeCount >= producer.price / 2) {
      producer.unlocked = true;
    }
  }
}

function getUnlockedProducers(data) {
  let unfilteredPArr = data.producers.slice();
  filteredPArr = unfilteredPArr.filter(element => {
    return element.unlocked === true;
  });
  return filteredPArr;
}

function makeDisplayNameFromId(id) {
  // your code here
  /*
  1. take ID and run a for loop on it. let result str = ""
  2. if char is an _, change it to " "
  3. += to result str
  4. str[0].toUpperCase;
  */
  let resultStr = "";
  for (let i = 0; i < id.length; i++) {
    let letter = id[i];
    if (letter === "_") {
      letter = " ";
    }
    resultStr += letter;
  }
  //do a split, map, join
  resultStr = resultStr
    .split(" ")
    .map(piece => piece[0].toUpperCase() + piece.substr(1).toLowerCase())
    .join(" ");
  console.log(resultStr);
  return resultStr;
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement("div");
  containerDiv.className = "producer";
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
  let producerContainer = document.getElementById("producer_container");
  deleteAllChildNodes(producerContainer);
  unlockProducers(data.producers, data.coffee);
  let unlockedArr = getUnlockedProducers(data);
  for (let i = 0; i < unlockedArr.length; i++) {
    let producer = unlockedArr[i];
    let toAppend = makeProducerDiv(producer);
    producerContainer.append(toAppend);
  }
  /*
      1) calls document.getElementById() or document.querySelector()
      2) appends some producer div elements to the producer container
      3) unlocks any locked producers which need to be unlocked
      4) only appends unlocked producers
      5) deletes the producer container's children before appending new producers
      6) is not in some way hardcoded to pass the tests
  */
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  for (let i = 0; i < data.producers.length; i++) {
    let producer = data.producers[i];
    if (producer.id === producerId) {
      return producer;
    }
  }
}

function canAffordProducer(data, producerId) {
  let producer = getProducerById(data, producerId);
  if (data.coffee >= producer.price) {
    return true;
  }
  return false;
}

function updateCPSView(cps) {
  document.getElementById("cps").innerText = cps;
}

function updatePrice(oldPrice) {
  // your code here
  newPrice = Math.floor(oldPrice * 1.25);
  return newPrice;
}

function attemptToBuyProducer(data, producerId) {
  // your code here
  /*
  1. should check if canAffordProducer
  2. if so, increment producer by ++
  3. also call updatePrice
  4. also decrement data.coffee if able to buy it
  5. also update cps
  6. else return false and do nothing
  */
  let producer = getProducerById(data, producerId);
  let affordIt = canAffordProducer(data, producerId);
  if (affordIt) {
    ++producer.qty;
    data.coffee = data.coffee - producer.price;
    producer.price = updatePrice(producer.price);
    data.totalCPS += producer.cps;
    updateCPSView(data.totalCPS);
    return true;
  }
  return false;
}

function buyButtonClick(event, data) {
  if (event.target.tagName === "BUTTON") {
    let producerId = event.target.id.slice(4);

    if (attemptToBuyProducer(data, producerId) === false) {
      window.alert("Not enough coffee!");
    } else {
      renderProducers(data);
      updateCoffeeView(data.coffee);
      updateCPSView(data.totalCPS);
    }
  }
}

function tick(data) {
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  updateCPSView(data.totalCPS);
  // updates the dom to reflect any newly unlocked producers
  let unlockedArr = getUnlockedProducers(data);
  unlockedArr.forEach(element => makeProducerDiv(element));
  renderProducers(data);
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === "undefined") {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById("big_coffee");
  bigCoffee.addEventListener("click", () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById("producer_container");
  producerContainer.addEventListener("click", event => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}
