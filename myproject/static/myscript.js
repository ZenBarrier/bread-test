var opts = {
  buttonId: 'bread-checkout-btn',
  actAsLabel: false,
  asLowAs: true,
  items: [
    {
      name: 'Couch',
      price: 10000,
      sku: 'COUCH123',
      quantity: 1,
      imageUrl: '[REPLACEMEWITHAREALURL]',
      detailUrl: '[REPLACEMEWITHAREALURL]',
    }]
};
bread.checkout(opts);

opts.done = function (err, tx_token) {
  if (err) {
    console.error("There was an error: " + err);
    return;
  }
  if (tx_token !== undefined) {
    console.log(tx_token);
    var i = document.createElement('input');
    i.type = 'hidden';
    i.name = 'token';
    i.value = tx_token;
    var f = document.createElement('form');
    f.action = '[REPLACEMEWITHSERVICEURL]';
    f.method = 'POST';
    f.appendChild(i);
    document.body.appendChild(f);
    f.submit();
  }
  return;
};
bread.checkout(opts);

opts.calculateTax = function (shippingContact, billingContact, callback) {
  $.ajax({
    url: '/tax',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      shippingAddress: shippingContact,
      total: opts.items[0].price * opts.items[0].quantity
    })
  })
    .done(function (data) {
      callback(null, data);
    })
    .fail(function (err) {
      callback(err);
    });
};
opts.calculateShipping = function (shippingContact, callback) {
  $.ajax({
    url: '/shipping',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      shippingAddress: shippingContact,
      total: opts.items[0].price * opts.items[0].quantity
    })
  })
    .done(function (data) {
      callback(null, data);
    })
    .fail(function (err) {
      callback(err);
    });
};

opts.onCustomerClose = function (err, custData) {
  if (err !== null) {
    console.error("An error occurred getting customer close data.");
    return;
  }
  var customerEmail = custData.email;
  var qualState = custData.state;
  switch (qualState) {
    case 'PREQUALIFIED':
      console.log(customerEmail + " was prequalified for financing.");
      alert("Succesfully Financed!")
      break;
    case 'PARTIALLY_PREQUALIFIED':
      console.log(customerEmail + " was partially prequalified for financing.");
      break;
    case 'NOT_PREQUALIFIED':
      console.log(customerEmail + " was not prequalified for financing.");
      alert("Sorry, Declined!")
      break;
    case 'ABANDONED':
      if (customerEmail === undefined || customerEmail === null) {
        console.log("Unknown customer abandoned their prequalification attempt.");
      } else {
        console.log(customerEmail + " abandoned their prequalification attempt.");
      }
      break;
  }
}