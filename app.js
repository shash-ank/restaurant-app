const menuUrl = "foodMenu.json";
const tableUrl = "table.json";
let menuData = new Array([{}]);
let tableData = new Array([{}]);
itemList = document.getElementById("food-items");
tableList = document.getElementById("table-items");
billDetails = new Map();
tableDetails = new Map();
parseMenuItems(menuUrl);
function parseMenuItems(url) {
  fetch(url)
    .then((response) => response.json())
    .then((items) => {
      menuData = items;
      return loadMenuData(menuData);
    });
}

parseTableItems(tableUrl);

function parseTableItems(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      tableData = data;
      return loadTableData(tableData);
    });
}

function allowDrop(event) {
  event.preventDefault();
}
function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  console.log(data);
  str = String(data);
  firstIndex = str.indexOf(",");
  lastIndex = str.lastIndexOf(",");
  foodItem = str.substring(firstIndex + 1, lastIndex);

  price = Number(str.slice(data.lastIndexOf(",") + 1));
  let id = ev.target.id;
  
  let arr = [];
  tableOrdering = new Map();
  if (!billDetails.get(id)) {
    itemPrice = price;
    tableOrdering.set(foodItem, [price, 1, itemPrice]);

    arr = [price, 1, tableOrdering];
    console.log(arr);
    billDetails.set(id, arr);
  } else {
    arr = billDetails.get(id);
    arr[0] += price;
    arr[1]++;
    tableOrdering = arr[2];
    if (!tableOrdering.get(foodItem)) {
      itemPrice = price;
      tableOrdering.set(foodItem, [price, 1, itemPrice]);
    } else {
      let foodArr = [];
      foodArr = tableOrdering.get(foodItem);
      foodArr[0] += price;
      foodArr[1]++;
      tableOrdering.set(foodItem, foodArr);
    }
    arr[2] = tableOrdering;
    billDetails.set(id, arr);
  }

  let index = Number(id.slice(id.indexOf("-") + 1)) - 1;
  tableData[index].tableName = id;
  tableData[index].bill = arr[0];
  tableData[index].itemCount = arr[1];
  console.log();
  document.getElementById(
    id
  ).outerHTML = `<li  draggable='false' ondragstart="return false;" id="${id}" ondrop="drop(event)" ondragover="allowDrop(event)" onclick="displayTableDetails('${id}',billDetails)">${id}<br><br> USD ${arr[0]} | Total items: ${arr[1]}</li>`;
}
function loadTableData(items) {
  let li1 = "";
  for (const [index] of Object.entries(items)) {
    num = items[index].tableName.indexOf("-") + 1;
    let listId = `Table-${items[index].tableName[num]}`;
    // arr = billDetails.get(listId);
    // if (arr[0] !== 0)
    li1 += `<li  draggable='false' ondragstart="return false;"  id="${listId}" ondrop="drop(event)" ondragover="allowDrop(event)"onclick="displayTableDetails('${listId}',billDetails)"> ${items[index].tableName}<br><br> USD ${items[index].bill} | Total items: ${items[index].itemCount}</li>`;
    // else
    //   li1 += `<li id="${listId}" ondrop="drop(event)" ondragover="allowDrop(event)> ${items[index].tableName}<br><br> USD ${items[index].bill} | Total items: ${items[index].itemCount}</li>`;
  }
  tableList.innerHTML = li1;
}

function loadMenuData(items) {
  let li = "";
  for (const [index] of Object.entries(items)) {
    let item = items[index].itemName;
    let price = items[index].price;
    num = Number(index) + 1;
    li += `<li draggable="true" id="food-item-${num}" ondragstart="dragStart(event,'${item}',${price})"> ${items[index].itemName}<br><br> \$${items[index].price}</li>`;
  }
  itemList.innerHTML = li;
}

//filter menu
input = document.getElementById("filter-menu");
let filterMenu = function (event) {
  keyword = input.value.toLowerCase();
  filteredItems = menuData.filter((obj) => {
    return Object.keys(obj).some(function (key) {
      if (key !== "price") {
        return obj[key].toLowerCase().indexOf(keyword) != -1;
      }
    });
  });
  loadMenuData(filteredItems);
};
input.addEventListener("keyup", filterMenu);
function dragStart(event, itemName, price) {
  foodItemData = new Array([event.target.id, itemName, price]);
  event.dataTransfer.setData("Text", foodItemData);

  // console.log(document.getElementById(event.target.id).textContent);
}

input1 = document.getElementById("filter-tables");

let filterTable = function (event) {
  keyword1 = input1.value.toLowerCase();
  filteredTables = tableData.filter((obj) => {
    return Object.keys(obj).some(function (key) {
      if (key == "tableName") {
        return obj[key].toLowerCase().indexOf(keyword1) != -1;
      }
    });
  });
  loadTableData(filteredTables);
};
input1.addEventListener("keyup", filterTable);

let displayTableDetails = function (key, map) {
  listId = document.getElementById(key);
  var body = document.getElementById("modal");
  var modal_header = document.createElement("div");
  modal_header.classList.add("modal-header");
  modal_heading = document.createElement("h2");
  modal_heading.id = "table-heading";
  modal_heading_text = document.createTextNode(`${key} | Order Details`);
  modal_heading.appendChild(modal_heading_text);
  var close_modal = document.createElement("span");
  close_modal.classList.add("close");
  close_modal.setAttribute("onclick", `closing('${key}')`);
  close_modal_text = document.createTextNode("x");
  close_modal.appendChild(close_modal_text);
  modal_header.appendChild(close_modal);
  modal_header.appendChild(modal_heading);

  var tbl = document.createElement("table");
  tbl.id = "table-details";
  if (listId.classList.contains("active")) {
    listId.classList.remove("active");
  } else {
    var Parent = document.getElementById("modal");
    while (Parent.hasChildNodes()) {
      Parent.removeChild(Parent.firstChild);
    }
    listId.classList.add("active");

    arr = billDetails.get(key);
    map = arr[2];
    orderedItems = [];
    foodArr = [[]];
    orderedItems = [...map.keys()];
    foodArr = [...map.values()];
    // console.log(orderedItems, prices);
    table_heading = document.getElementsByTagName("h2");
    table_heading.innerHTML = `<h2 id="table-heading">${key}</h2>`;
    // creates a <table> element and a <tbody> element

    var tblHead = document.createElement("thead");
    var tblHeadRow = document.createElement("tr");
    var tblHeading1 = document.createElement("th");
    var heading1 = document.createTextNode("S.No");
    tblHeading1.appendChild(heading1);
    var tblHeading2 = document.createElement("th");
    var heading2 = document.createTextNode("Item");
    tblHeading2.appendChild(heading2);

    var tblHeading3 = document.createElement("th");
    var heading3 = document.createTextNode("Price");
    tblHeading3.appendChild(heading3);
    tblHeadRow.appendChild(tblHeading1);
    tblHeadRow.appendChild(tblHeading2);
    tblHeadRow.appendChild(tblHeading3);
    tblHead.appendChild(tblHeadRow);
    tbl.appendChild(tblHead);

    var tblBody = document.createElement("tbody");

    // creating all cells
    for (var i = 0; i < orderedItems.length; i++) {
      // creates a table row
      var row = document.createElement("tr");
      row.id = key + "-" + Number(i + 1);
      // Create a <td> element and a text node, make the text
      // node the contents of the <td>, and put the <td> at
      // the end of the table row
      let serialNoElement = document.createElement("td");
      let serialNo= document.createTextNode(`${i + 1}`);
      serialNoElement.appendChild(serialNo);
      row.appendChild(serialNoElement);

      
      let orderedFoodItemElement = document.createElement("td");
      orderedFoodItemElement.id = orderedItems[i];
    
      orderedFoodItemName = document.createTextNode(`${orderedItems[i]}`);
      orderedFoodItemElement.appendChild(orderedFoodItemName);
      row.appendChild(orderedFoodItemElement);
//price
//orderedFoodItemPrice
      priceElement = document.createElement("td");
     priceElement.id="price-"+row.id;
      orderedFoodItemPrice = document.createTextNode(`${foodArr[i][0]}`);
      priceElement.appendChild(orderedFoodItemPrice);
      row.appendChild(priceElement);
//foodItemQuantity
foodItemQuantityElement = document.createElement("td");
foodItemQuantity = document.createElement("input");
foodItemQuantity.type = "number";
foodItemQuantity.id = key + "-" + row.id;
foodItemQuantity.setAttribute(
        "onchange",
        `incOrDec('${row.id}','${orderedFoodItemElement.id}','${key}','${foodItemQuantity.id}','${priceElement.id}')`
      );
      foodItemQuantity.setAttribute("min", 0);
      foodItemQuantity.setAttribute("max", 10);
      foodItemQuantity.value = foodArr[i][1];
      foodItemQuantityElement.appendChild(foodItemQuantity);
      row.appendChild(foodItemQuantityElement);
//delete
      itemPrice = foodArr[i][2];

      deleteFoodItemElement= document.createElement("td");
      deleteFoodItemButton = document.createElement("button");
      deleteFoodItemButton.setAttribute(
        "onclick",
        `deleteRow('${row.id}','${orderedFoodItemElement.id}','${key}')`
      );
      image = document.createElement("img");
      image.src = "trash.png";
      deleteFoodItemButton.appendChild(image);
      deleteFoodItemElement.appendChild(deleteFoodItemButton);
      row.appendChild(deleteFoodItemElement);

      tblBody.appendChild(row);

      // add the row to the end of the table body
    }
    var modal_footer = document.createElement("div");
    modal_footer.classList.add("modal-footer");
    modal_footer_button = document.createElement("button");
    modal_footer.setAttribute("onclick", `refresh('${key}')`);
    modal_footer_button_textContent = document.createTextNode(
      "CLOSE SESSION (GENERATE BILL)"
    );
    modal_footer_button.id = "left";
    modal_footer_button.appendChild(modal_footer_button_textContent);
    modal_footer.appendChild(modal_footer_button);
    // put the <tbody> in the <table>
    tbl.appendChild(tblBody);
    // appends <table> into <body>
    body.appendChild(modal_header);

    body.appendChild(tbl);
    body.appendChild(modal_footer);
    // sets the border attribute of tbl to 2;
    tbl.setAttribute("border", "0");
    body.style.display = "block";
  }
};
span = document.getElementsByClassName("close")[0];
function closing(id) {
  id = document.getElementById(id);
  id.classList.remove("active");
  // console.log("closing");
  modal = document.getElementById("modal");
  modal.style.display = "none";
}
function deleteRow(rowId, itemId, key) {
  rowId = document.getElementById(rowId);
  rowId.classList.add("hidden");

  arr = billDetails.get(key);
  map = new Map();
  map = arr[2];
  foodArr = [[]];
  foodArr = map.get(itemId);

  total = arr[0];
  currentItemTotalPrice = Number(foodArr[0]);
  currentDeletedFoodItemCount=Number(foodArr[1]);
   
 total -= currentItemTotalPrice;
  arr[0] = total;
  
  arr[1]-=currentDeletedFoodItemCount;
  
  map.delete(itemId);
  arr[2] = map;

  billDetails.set(key, arr);
  if (map.size == 0) closing(key);
  if (arr[1] == 0) {
    // console.log(billDetails.get(key));
    closing(key);
    document.getElementById(
      key
    ).outerHTML = `<li id="${key}" ondrop="drop(event)" ondragover="allowDrop(event)" >${key}<br><br> USD. ${total} | Total items: ${arr[1]}</li>`;
  } else
    document.getElementById(
      key
    ).outerHTML = `<li  id="${key}" class="active" ondrop="drop(event)" ondragover="allowDrop(event)" onclick="displayTableDetails('${key}',billDetails)">${key}<br><br> USD ${total} | Total items: ${arr[1]}</li>`;
}

function incOrDec(rowId, itemId, key, foodQuantity, priceId) {
  rowId = document.getElementById(rowId);
  console.log(rowId, itemId, key, foodQuantity);
  foodQuantity = document.querySelector("#" + foodQuantity);
  priceElement = document.querySelector('#'+priceId);
  currentCount = Number(foodQuantity.value);
 
  console.log(currentCount);
  // console.log("changed value: " + foodQuantity.value);
  arr = [];
  foodArr = [];
  arr = billDetails.get(key);
  totalPrice = arr[0];
  totalItems = arr[1];
  // console.log(arr);
  map = arr[2];
  foodArr = map.get(itemId);
  itemPrice = foodArr[2];
  currentItemTotalPrice = foodArr[0];
  itemCount = foodArr[1];
  if (itemCount > currentCount) {
    //decrement
    itemCount--;
    currentItemTotalPrice -= itemPrice;
    totalPrice -= itemPrice;
    totalItems--;
  } else if (itemCount < currentCount) {
    //increment
    itemCount++;
    currentItemTotalPrice += itemPrice;
    totalPrice += itemPrice;
    totalItems++;
  }
  priceElement.textContent=currentItemTotalPrice;
  foodArr[0] = currentItemTotalPrice;
  foodArr[1] = itemCount;
  if (currentCount == 0) {
    map.delete(itemId);
    rowId.classList.add("hidden");
  }
  // map.set(itemId, foodArr);
  arr[0] = totalPrice;
  arr[1] = totalItems;
  arr[2] = map;
  billDetails.set(key, arr);
  if (arr[1] == 0 && totalPrice !== 0) {
    closing(key);
    deleteRow(rowId, itemId, key);
    document.getElementById(
      key
    ).outerHTML = `<li id="${key}" ondrop="drop(event)" ondragover="allowDrop(event)">${key}<br><br> USD ${total} | Total items: ${arr[1]}</li>`;
  } else if (totalPrice == 0) {
    refresh(key);
  } else
    document.getElementById(
      key
    ).outerHTML = `<li id="${key}" class="active" ondrop="drop(event)" ondragover="allowDrop(event)" onclick="displayTableDetails('${key}',billDetails)">${key}<br><br> USD ${totalPrice} | Total items: ${totalItems}</li>`;

  // console.log(foodArr);
}
function refresh(key) {
  modal = document.getElementById("modal");
  modal.style.display = "none";
  document.getElementById(
    key
  ).outerHTML = `<li id="${key}" ondrop="drop(event)" ondragover="allowDrop(event)" onclick="displayTableDetails('${key}',billDetails)">${key}<br><br> USD ${0} | Total items: ${0}</li>`;
  billDetails.delete(key);
}