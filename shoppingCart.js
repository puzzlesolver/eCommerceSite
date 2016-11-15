/*  This is the JavaScript file for an online store which includes filters and a shopping cart.
    The shopping cart lets the user add items to it and chech out items which have already been added to the shopping cart.
    The user is also able to modify the quantity and delete items from the shopping cart.
    After checking out items and reviewing these items in the shopping cart the user is required to enter a credit card information to complete the purchase.
    An Order Summary page is displayed showing name, address, the items ordered with their respective quantity with an additional shipping fee and tax added to the total.
    After receiving the total, the user has the option to continue and place the order or cancel it.
    A confirmation page is displayed after the user places the order letting the user know the order was accepted and the ordered items are on the way.
    Once the user places the order and the order is confirmed the items selected by the user are removed from the shopping cart.
    The user is not allowed to return to, view, modify, or cancel the order at that point because the session is destroyed for security purposes.
    The personal information provided by the user such as name, address, and credit card information is not stored in the database for this project.
*/

$(document).ready(function() {

  //Define variables for supplements details that will be used throughout the entire navigation and shopping process
  var imageSupplements = document.getElementsByClassName("img");
  var titleSupplements = document.getElementsByClassName("title");
  var retailSupplements = document.getElementsByClassName("retail");
  var descriptionSupplements = document.getElementsByClassName("description");
  var featuresSupplements = document.getElementsByClassName("features");
  var onHandSupplements = document.getElementsByClassName("onhand");
  var quantitySupplements = document.getElementsByClassName("qty");
  var ctgSupplements = new Array(imageSupplements.length);
  var supplementStr = "";
  var ctgSupplementsIndex = 0;
  var validShopCart = true;
  var supplementCheckedCounter = 0;
  var aminoacidsChecked = false;
  var creatineChecked = false;
  var fatburnersChecked = false;
  var postworkoutChecked = false;
  var preworkoutChecked = false;
  var proteinChecked = false;
  var vitaminsChecked = false;
  
  //for-loop that iterates through the supplement images and checks for availability of the supplements
  for(var i = 0; i < imageSupplements.length; i++){
    supplements(i);
    supplementAvailability(i);
    individualItemDialogModalSetup(i);
    addToCart(i);
  }
  
  shoppingCartDialog();
  filters();
  populateSupplements();


  //add images into the supplement information window
  function supplements(index){
    imageSupplements[index].innerHTML = "<input type='image' id='img_" + imageSupplements[index].getAttribute("name") +
                               "' src='http://www.***.com/~workoutSupplements/onlineStore/images/" +
                               imageSupplements[index].getAttribute("name").toUpperCase() + ".jpg' width='150px' height='200px' />";
  }
  
  //show supplement availability to the customer depending on how many items exist in stock
  //https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
  function supplementAvailability(index){  
    for(var j = 0; j < onHandSupplements.length; j++){      
      if((imageSupplements[index].getAttribute("name")).trim() == (onHandSupplements[j].innerHTML).trim()){
        var qty = quantitySupplements[j].innerHTML;
        if(qty == "0"){   
          titleSupplements[index].insertAdjacentHTML('afterend', "<p style='color:red;text-align:center'>More on the way</p>"); 
        }
        else if(qty != "0"){
          titleSupplements[index].insertAdjacentHTML('afterend', "<p style='color:green;text-align:center'><strong>In stock ("+qty+")</strong></p>");
          dialogHandle(index);
        }
        return;
      }      
    }
    titleSupplements[index].insertAdjacentHTML('afterend', "<p style='color:orange;text-align:center'><strong>Coming soon!</strong></p>");
  }
  
  //setup dialog modal for supplement details to be displayed after the user clicks on a specific supplement
  function individualItemDialogModalSetup(index){
    var img = "<img src=\"http://www.***.com/~workoutSupplements/onlineStore/images/" + 
                    imageSupplements[index].getAttribute("name").toUpperCase() + ".jpg\" class=\"detailImg\" width=\"150px\" />";
    
    var modal = "<div id='dialog-modal_" + imageSupplements[index].getAttribute("name") + "' class='widget-dialog-container'>" +  
                "<form method='post' action=''>" +    
                img +
                "<div id='addToCart'><input type='text' name='qty_" + imageSupplements[index].getAttribute("name") + "' size='5' placeholder='0'/>" +
                "<div id='addToCartError_" + imageSupplements[index].getAttribute("name") + "' class='errorMsg'>&nbsp;</div>" +
                "<input type='button' name='add_" + imageSupplements[index].getAttribute("name") + "' class='buttonStyle' value='Add to Cart' />" + 
                "</div><div><p><strong>$" + retailSupplements[index].innerHTML +
                "</strong></p><p><strong>Features: </strong>" + featuresSupplements[index].innerHTML +
                "</p><p><strong>Description: </strong>" + descriptionSupplements[index].innerHTML +
                "</p></div></form>" +       
                "</div>"; 
    
    imageSupplements[index].insertAdjacentHTML('afterend', modal);
    hideModal(index);
  }
    
  //Hide dialog modal which displays supplements details
  function hideModal(index){
    $('#dialog-modal_'+imageSupplements[index].getAttribute("name")).dialog({
      minHeight: 400,
      minWidth: 500,
      modal: true,
      autoOpen: false,
      closeText: "x",
      close: function(event, ui){
      }
    });
  }
  
  //setup the shopping cart dialog to be shown to the customer
  function shoppingCartDialog(){
    $('[name="cartDialog"]').dialog({
      minHeight: 400,
      minWidth: 800,
      modal: true,
      autoOpen: false,
      closeText: "x",
      close: function(event, ui){        
      }
    });
    
    $('[name="cartImg"]').on('click', function(){
      $(".widget-dialog-container").css("border", "1px solid #19363F");
      $(".filter").prop('checked', false);
      displaySupplements();
      $('[name="cartDialog"]').dialog('open');
      updateCart();
    });
  }
  
  //Establish dialog handles when the user clicks on a specific supplement
  function dialogHandle(index){
    $('#img_' + imageSupplements[index].getAttribute("name")).on('click', function(){
      $(".widget-dialog-container").css("border", "1px solid #19363F");
      $('#dialog-modal_'+imageSupplements[index].getAttribute("name")).dialog('open');   
      $('#addToCartError_' + imageSupplements[index].getAttribute("name")).html("&nbsp;");
    });
    $('#img_' + imageSupplements[index].getAttribute("name")).addClass("inStock");
  }
  
  //Configure add-to-cart buttons and check for quantity
  function addToCart(index){
    var tmpSku = imageSupplements[index].getAttribute("name");
    
    $("[name='add_" + tmpSku + "']").on('click', function(){
      //Qty empty
      if(isNaN($("[name='qty_" + tmpSku + "']").val()) || ($("[name='qty_" + tmpSku + "']").val()).trim().length == 0){
        $('#addToCartError_' + imageSupplements[index].getAttribute("name")).html("Enter a number.");
        errorHandler($("[name='qty_" + tmpSku + "']"));
      }
      //Qty > available qty
      else if(Number($("[name='qty_" + tmpSku + "']").val()) > (Number(fetchQuantitySupplements(tmpSku)) - Number(sessionStorage.getItem(tmpSku)))){
        $('#addToCartError_' + imageSupplements[index].getAttribute("name")).html("Only " + (Number(fetchQuantitySupplements(tmpSku)) - Number(sessionStorage.getItem(tmpSku))) + " left in stock.");
        errorHandler($("[name='qty_" + tmpSku + "']"));
      }
      //Qty = "-" or "0"
      else if($("[name='qty_" + tmpSku + "']").val() < 1){
        $('#addToCartError_' + imageSupplements[index].getAttribute("name")).html("Enter a number > 0.");
        errorHandler($("[name='qty_" + tmpSku + "']"));
      }
      //Qty valid        
      else{ 
        updateSession(tmpSku, $("[name='qty_" + tmpSku + "']").val());
        $('#addToCartError_' + imageSupplements[index].getAttribute("name")).html("");
        $("[name='qty_" + tmpSku + "']").val("")
        $('#dialog-modal_'+imageSupplements[index].getAttribute("name")).dialog('close');
        //open shopping cart
        $('[name="cartDialog"]').dialog('open'); 
        //update shopping cart
        updateCart();
        updateQuantitySupplements(tmpSku, $("[name='qty_" + tmpSku + "']").val());
      }
    });
    
    $("[name='qty_" + tmpSku + "']").on('focus', function(){
      clearError($("[name='qty_" + tmpSku + "']"));
    });
  }
  
  //Update session to be used for the shopping cart
  function updateSession(sku, qty){
    if(sessionStorage.getItem(sku) == null){
      sessionStorage.setItem(sku, qty);
    }
    else{
      sessionStorage.setItem(sku, Number(sessionStorage.getItem(sku)) + Number(qty));
    }
  }
  
  //Update shopping cart information based on the session
  function updateCart(){
    var str = "<div id='cartItems'>";
    var key;
    var val;
    var tmpRetail;
    var subtotal = 0;
    
    if(sessionStorage.length == 0){
      str +=  "<div id='emptyMsg'><h1>Your cart is empty</h1><p>" + 
              "<input type='button' name='continueShopping' class='buttonStyle' value='Continue Shopping' /></p></div></div>"; 
    }
    else{
      for(var k = 0; k < sessionStorage.length; k++) {   
          key = sessionStorage.key(k);  
          val = sessionStorage.getItem(key);
          tmpRetail = fetchRetailSupplements(key);
          subtotal += (val*tmpRetail);

          str += "<p><input type='button' name='remove_" + key +"' class='removeSupplementBtn' value='x'/>" + 
                  "<img src='http://www.***.com/~workoutSupplements/onlineStore/images/" + 
                  key.toUpperCase() + ".jpg' width='75px' />" + 
                  "<span>" + 
                  "<input type='text' name='cartQty_" + key + "' size='5' value='" + val + "'/>" +
                  " x   <input type='text' size='5' value='" +tmpRetail + "' disabled/>  =  <input type='text' name='cartSubTotal_" + 
                  key + "' size='5' value='" + 
                  (val*tmpRetail).toFixed(2) +"' disabled/></span></p>"; 
      } 
      str += "</div>";
      str += "<div id='subtotalPrice'><div id='cartErrorMsg' name='cartErrorMsg'>&nbsp;</div><hr><p>SUBTOTAL : $" + subtotal.toFixed(2) + "</p>";
      str += "<p><input type='button' name='continueShopping' class='buttonStyle' value='Continue Shopping' />";
      str += "<input type='button' name='checkout' class='buttonStyle' value='Check Out Now'/>";
      str += "</p></div>";
    }
    $('[name="cartDialog"]').html(str);
    cartButtons();
  }
  
  //configure cart buttons including the remove button and update changes in the qty of the cart
  function cartButtons(){
    var tmpKey;
      $('[name="continueShopping"]').on('click', function(){
      $('[name="cartDialog"]').dialog('close');
    });
    
    $('[name="checkout"]').on('click', function() {
      if(validShopCart){
        customerInfoDialog();
        $('[name="cartDialog"]').dialog('close');
        $('[name="customerInfoDialog"]').dialog('open');
        infoErrors();
      }
    });
    
    for(var k = 0; k < sessionStorage.length; k++) {   
          tmpKey = sessionStorage.key(k);            
          removeButton(tmpKey); 
          quantityCheck(tmpKey);      
      }
  }     
  
  function removeButton(key) {
    $('[name="remove_' + key + '"]').on('click', function(){
      sessionStorage.removeItem(key);
      updateCart();
    });
  }
  
  //Checks if qty in the cart has changed 
  function quantityCheck(key){
    $('[name="cartQty_' + key + '"]').on('focus', function(){
      clearError($('[name="cartQty_' + key + '"]'));
    });
    
    $('[name="cartQty_' + key + '"]').on('blur', function(){  
      //Qty < 0
      if(Number($('[name="cartQty_' + key + '"]').val()) < 0){
        $('[name="cartErrorMsg"]').html("Please enter 0 or a positive number.");
        errorHandler($('[name="cartQty_' + key + '"]'));
        validShopCart = false;
        return;
      }
      //Qty not a number
      else if(isNaN($('[name="cartQty_' + key + '"]').val())){
        $('[name="cartErrorMsg"]').html("Please enter a number.");
        errorHandler($('[name="cartQty_' + key + '"]'));
        validShopCart = false;
        return;
      }
      //Qty == 0
      else if($('[name="cartQty_' + key + '"]').val().trim() == 0){
        sessionStorage.removeItem(key);
        validShopCart = true;
      }
      //Qty > Qty Available
      else if($('[name="cartQty_' + key + '"]').val().trim() > Number(fetchQuantitySupplements(key))){
        $('[name="cartErrorMsg"]').html("There are only " + fetchQuantitySupplements(key) + " left in stock.");
        errorHandler($('[name="cartQty_' + key + '"]'));
        validShopCart = false;
        return;
      }
      //Qty valid
      else{
        sessionStorage.setItem(key, $('[name="cartQty_' + key + '"]').val().trim());
        validShopCart = true;
      }
      
      updateCart();
    });
  }
  
  //configure the customer dialog with billing and shipping information of the customer for placing orders
  function customerInfoDialog(){
    var str = "<div id='billingInfo'><table><tr><td><h1>Billing Info</h1></td></tr>" +
              "<tr><td><select name='cardType'><option value='default'>Select Card Type</option>" +
              "<option value='visa'>Visa</option><option value='amex'>American Express</option>" +
              "<option value='mastercard'>MasterCard</option><option value='discover'>Discover</option></select></td></tr>" +
              "<tr><td><input type='text' name='cardNum' placeholder='Card Number' class='error' /></td>" + 
              "<td><span id='exp'>Expiration: <input type='text' name='cardExpMon' id='cardExpMon' placeholder='MM' size='1' />" + 
              "<input type='text' name='cardExpYear' id='cardExpYear' placeholder='YYYY' size='2'/></span></td>" +
              "<td><input type='text' name='securityCode' placeholder='Security Code' /></td></tr>" +
              "<tr><td><input type='text' name='firstname' placeholder='First Name'/></td>" +
              "<td><input type='text' name='middlename' placeholder='Middle Name'/></td>" + 
              "<td><input type='text' name='lastname' placeholder='Last Name'/></td></tr>" +
              "<tr><td><input type='text' name='address1' placeholder='Address'/></td>" +
              "<td><input type='text' name='address2' placeholder='Address'/></td></tr>" +
              "<tr><td><input type='text' name='city' placeholder='City' /></td>" + 
              "<td><input type='text' name='state' placeholder='State: AL, AK, AZ, etc.'/></td>" + 
              "<td><input type='text' name='zip' placeholder='Zip'/></td></tr>" +
              "<tr><td>Phone: <input type='text' name='phoneArea' placeholder='###' size='1' />" +
              "<input type='text' name='phonePrefix' placeholder='###' size='1' />" +
              "<input type='text' name='phoneSuffix' placeholder='####' size='2' /></td></tr>" +
              "</table></div>" +
              "<div id='shippingInfo'><table><tr><td><h1>Shipping Info</h1></td></tr>" +
              "<tr><td><input type='checkbox' name='reuseInfo' value='reuse'>Use Billing Info</td></tr>" +
              "<tr><td><input type='text' name='firstShipping' placeholder='First Name'/></td>" +
              "<td><input type='text' name='middleShipping' placeholder='Middle Name'/></td>" + 
              "<td><input type='text' name='lastShipping' placeholder='Last Name'/></td></tr>" +
              "<tr><td><input type='text' name='address1Shipping' placeholder='Address'/></td>" +
              "<td><input type='text' name='address2Shipping' placeholder='Address'/></td></tr>" +
              "<tr><td><input type='text' name='cityShipping' placeholder='City' /></td>" +
              "<td><input type='text' name='stateShipping' placeholder='State: AL, AK, AZ, etc.'/></td>" + 
              "<td><input type='text' name='zipShipping' placeholder='Zip'/></td></tr>" +
              "<tr><td>Phone: <input type='text' name='phoneAreaShipping' placeholder='###' size='1' />" +
              "<input type='text' name='phonePrefixShipping' placeholder='###' size='1' />" +
              "<input type='text' name='phoneSuffixShipping' placeholder='####' size='2' /></td></tr>" +
              "</table></div>" +
              "<div id='showError' name='showError'>&nbsp;</div>" +
              "<div id='infoButtons'><p><input type='button' name='cancelReview' class='buttonStyle' value='Cancel' />" + 
              "<input type='button' name='toReview' class='buttonStyle' value='Continue' /></p></div>";  
      
    $('[name="customerInfoDialog"]').dialog({
      minHeight: 400,
      width: 1000,
      modal: true,
      autoOpen: false,
      closeText: "x",
      close: function(event, ui){
      }
    });  
      
    $('[name="customerInfoDialog"]').html(str);   
    
    //Billing Info = Shipping Info when checkbox is selected by the customer
    $('[name="reuseInfo"]').on('click', function(){
      if($(this).is(':checked')){
        $('[name="firstShipping"]').val($('[name="firstname"]').val());
        $('[name="middleShipping"]').val($('[name="middlename"]').val());
        $('[name="lastShipping"]').val($('[name="lastname"]').val());
        $('[name="address1Shipping"]').val($('[name="address1"]').val());
        $('[name="address2Shipping"]').val($('[name="address2"]').val());
        $('[name="cityShipping"]').val($('[name="city"]').val());
        $('[name="stateShipping"]').val($('[name="state"]').val());
        $('[name="zipShipping"]').val($('[name="zip"]').val());
        $('[name="phoneAreaShipping"]').val($('[name="phoneArea"]').val());
        $('[name="phonePrefixShipping"]').val($('[name="phonePrefix"]').val());
        $('[name="phoneSuffixShipping"]').val($('[name="phoneSuffix"]').val());
      }
      //Clear all text fields if the checkbox is unchecked by the customer
      else if($(this).attr('checked', false)){
        $('[name="firstShipping"]').val("");
        $('[name="middleShipping"]').val("");
        $('[name="lastShipping"]').val("");
        $('[name="address1Shipping"]').val("");
        $('[name="address2Shipping"]').val("");
        $('[name="cityShipping"]').val("");
        $('[name="stateShipping"]').val("");
        $('[name="zipShipping"]').val("");
        $('[name="phoneAreaShipping"]').val("");
        $('[name="phonePrefixShipping"]').val("");
        $('[name="phoneSuffixShipping"]').val("");
      }
    });
    
    infoButtons();
    focusHandler();
  }
  
  //Validate information when button is clicked by the customer
  function infoButtons(){
    $('[name="cancelReview"]').on('click', function(){
      $('[name="customerInfoDialog"]').dialog('close');
    });
      
    $('[name="toReview"]').on('click', function(){
      if(validCustomer()){
        orderDialog();
        $('[name="customerInfoDialog"]').dialog('close');
        $('[name="orderSummaryDialog"]').dialog('open');
      } 
    });
  }
  
  //setup order dialog for customer to review supplement details 
  function orderDialog(){
    var key;
    var val;
    var tmpRetail;
    var subtotal = 0;
    var orderStr = "";
    var tax;
    var total;
    
    for(var k = 0; k < sessionStorage.length; k++) {   
        key = sessionStorage.key(k);  
        val = sessionStorage.getItem(key);
        tmpRetail = fetchRetailSupplements(key);
        subtotal += (val*tmpRetail);
        orderStr += "<tr><td><img src='http://www.***.com/~workoutSupplements/onlineStore/images/" + 
                    key.toUpperCase() + ".jpg' width='75px' /></td><td>" + fetchTitleSupplements(key) + "</td>" + 
                    "<td><span> x " + val + "</span></td></tr>";
    } 
    tax = (subtotal + 5) * 0.08;
    total = subtotal + 5 + tax;
    
    var str = "<div id='summaryShippingInfo'><table><tr><h1>Your order will be shipped to:</h1></tr>" +
              "<tr><td><span>" + $('[name="firstShipping"]').val() +"</span> " +
              "<span>" + $('[name="middleShipping"]').val() +"</span> " +
              "<span>" + $('[name="lastShipping"]').val() +"</span></td></tr>" +
              "<tr><td><span>" + $('[name="address1Shipping"]').val() + "</span></td>" +
              "<td><span>" + $('[name="address2Shipping"]').val() + "</span></td></tr>" +
              "<tr><td><span>" + $('[name="cityShipping"]').val() + ", " + 
              $('[name="stateShipping"]').val() + " " + $('[name="zipShipping"]').val() + "</span></td></tr>" +
              "</table></div><div id='summaryCartInfo'>" +
              "<table><tr><h1>Your order contains:</h1></tr>" + orderStr +
              "</table></div><div id='summaryChargeInfo'>" +
              "<p>SUBTOTAL : $" + subtotal.toFixed(2) + "</p>" +
              "<p>SHIPPING :$ 5.00 </p>" +
              "<p>TAX : $" + tax.toFixed(2) + "</p>" +
              "<hr><p>TOTAL : $" + total.toFixed(2) + "</p></div>" +
              "<div id='summaryButtons'><p><input type='button' name='cancelSummary' class='buttonStyle' value='Cancel' />" + 
              "<input type='button' name='placeOrder' class='buttonStyle' value='Place Order' /></p></div>";
              
        
    $('[name="orderSummaryDialog"]').dialog({
      minHeight: 400,
      width: 1000,
      modal: true,
      autoOpen: false,
      closeText: "x",
      close: function(event, ui){
      }
    });  
    
    $('[name="orderSummaryDialog"]').html(str);
    orderButtons();
  }
  
  //Order buttons and update on_hand table and merchandise_out table as well as clear the session in the cart  
  function orderButtons(){
    var date = new Date();
    
    $('[name="cancelSummary"]').on('click', function(){
      $('[name="orderSummaryDialog"]').dialog('close');
    });
    
    $('[name="placeOrder"]').on('click', function(){
      confirmationDialog();
      updateSupplements();
      sessionStorage.clear();
      
      $('[name="orderSummaryDialog"]').dialog('close');
      $('[name="confirmationDialog"]').dialog('open');
    });
  }
  
  //Update onHand & merchandiseOut supplements quantity after customer has placed an order     
  function updateOnHand(response){}
  
  function updateSupplements(){
    var date = new Date();
    var url = '';
    
    for(var i = 0; i < sessionStorage.length; i++){
      key = sessionStorage.key(i);  
      val = sessionStorage.getItem(key);
      
      url = 'http://www.***.com/workoutSupplements/servlet/OnHandQtyUpdate';
      url += '?sku=' + key;
      url += '&date=' + date.getFullYear() + "-" + getTwoDigit(date.getMonth()+1) + "-" + getTwoDigit(date.getDate());
      url += '&qty=' + (fetchQuantitySupplements(key) - val);
      url += '&table=on_hand';
      $.get(url, updateOnHand);
      
      url = 'http://www.***.com/workoutSupplements/servlet/MerchandiseOutUpdate';
      url += '?sku=' + key;
      url += '&date=' + date.getFullYear() + "-" + getTwoDigit(date.getMonth()+1) + "-" + getTwoDigit(date.getDate());
      url += '&qty=' + val;
      url += '&table=merchandise_out';
      $.get(url, updateOnHand);
    }
  }
    
  //configure confirmation dialog to show the user that order has been completed and supplements are on the way    
  function confirmationDialog(){
    var str = "<div id='thankYouMsg'><h1>Thank you! Your order is complete and your workout supplements are on the way!</h1>" +
          "<input type='button' name='closeConfirmation' class='buttonStyle' value='Close' /></div>";
    
    $('[name="confirmationDialog"]').dialog({
      minHeight: 400,
      width: 1000,
      modal: true,
      autoOpen: false,
      closeText: "x",
      close: function(event, ui){
        location.reload(true);
      }
    });
    
    $('[name="confirmationDialog"]').html(str);
    confirmationButtons();
  }
  
  function confirmationButtons(){
    $('[name="closeConfirmation"]').on('click', function(){
      $('[name="confirmationDialog"]').dialog('close');
    });
  }
  
  //Establish filters for supplements in the shopping area for customer to narrow down search    
  function filters(){
    var query = "";
    var aminoacidsStr = "";
    var creatineStr = "";
    var fatburnersStr = "";
    var postworkoutStr = "";
    var preworkoutStr = "";
    var proteinStr = "";
    var vitaminsStr = "";
    var firstChecked = false;
    var url = "";
    
    
    //CHECKBOXES FOR SUPPLEMENT FILTERS
    //Aminoacids checkbox filter
    $('[name="aminoacids"]').on('click', function(){
      if($(this).is(':checked')){
        aminoacidsChecked = true;
        hideOtherSupplements();
      }
      else if($(this).attr('checked', false)){
        aminoacidsChecked = false;
        hideSupplement();
      }
    });
      //Creatine checkbox filter
    $('[name="creatine"]').on('click', function(){
      if($(this).is(':checked')){
        creatineChecked = true;
        hideOtherSupplements();
      }
      else if($(this).attr('checked', false)){
        creatineChecked = false;
        hideSupplement();
      }
    });
      //fatburners checkbox filter
    $('[name="fatburners"]').on('click', function(){
      if($(this).is(':checked')){
        fatburnersChecked = true;
        hideOtherSupplements();
      }
      else if($(this).attr('checked', false)){
        fatburnersChecked = false;
        hideSupplement();
      }
    });
      //Post-workout checkbox filter
    $('[name="postworkout"]').on('click', function(){
      if($(this).is(':checked')){
        postworkoutChecked = true;
        hideOtherSupplements();
      }
      else if($(this).attr('checked', false)){
        postworkoutChecked = false;
        hideSupplement();
      }
    });
      //Pre-workout checkbox filter
    $('[name="preworkout"]').on('click', function(){
      if($(this).is(':checked')){
        preworkoutChecked = true;
        hideOtherSupplements();
      }
      else if($(this).attr('checked', false)){
        preworkoutChecked = false;
        hideSupplement();
      }
    });
      //Protein checkbox filter
    $('[name="protein"]').on('click', function(){
      if($(this).is(':checked')){
        proteinChecked = true;
        hideOtherSupplements();
      }
      else if($(this).attr('checked', false)){
        proteinChecked = false;
        hideSupplement();
      }
    });
      //Vitamins checkbox filter
    $('[name="vitamins"]').on('click', function(){
      if($(this).is(':checked')){
        vitaminsChecked = true;
        hideOtherSupplements();
      }
      else if($(this).attr('checked', false)){
        vitaminsChecked = false;
        hideSupplement();
      }
    });
  }
  
  function queryResponse(response){
    alert("Your query is: " + response);
  }
  
  //Show all supplements to the customer
  function displaySupplements(){
    for(var i = 0; i < imageSupplements.length; i++){
      $('[name="preview_' + imageSupplements[i].getAttribute("name") + '"]').show();
    }
  }
  
  
  //Hide supplements whose checkboxes are checked and display supplements whose checkboxes are not checked    
  function hideSupplement(){
    if((!aminoacidsChecked) && (!creatineChecked) && (!fatburnersChecked) && (!postworkoutChecked) && (!preworkoutChecked) && (!proteinChecked) && 
       (!vitaminsChecked)){
          displaySupplements();
          return;
    }
    for(var i = 0; i < imageSupplements.length; i ++){        
      if((!aminoacidsChecked && (ctgSupplements[i] == 1)) || (!creatineChecked && (ctgSupplements[i] == 2)) || (!fatburnersChecked && (ctgSupplements[i] == 3)) || (!postworkoutChecked && (ctgSupplements[i] == 4)) || (!preworkoutChecked && (ctgSupplements[i] == 5)) || (!proteinChecked && (ctgSupplements[i] == 6)) || (!vitaminsChecked && (ctgSupplements[i] == 7))){
            $('[name="preview_' + imageSupplements[i].getAttribute("name") + '"]').hide();
      }
      else{
        $('[name="preview_' + imageSupplements[i].getAttribute("name") + '"]').show();
      }
    }
  }
  

  //Hide supplements whose checkboxes are not checked and display supplements whose checkboxes are checked
  function hideOtherSupplements(){
    $(".widget-dialog-container").css("border", "0px solid #FFF");
    for(var i = 0; i < imageSupplements.length; i ++){        
      if((aminoacidsChecked && (ctgSupplements[i] == 1)) || (creatineChecked && (ctgSupplements[i] == 2)) || (fatburnersChecked && (ctgSupplements[i] == 3)) || 
         (postworkoutChecked && (ctgSupplements[i] == 4)) || (preworkoutChecked && (ctgSupplements[i] == 5)) || (proteinChecked && (ctgSupplements[i] == 6)) || (vitaminsChecked && (ctgSupplements[i] == 7))){
            $('[name="preview_' + imageSupplements[i].getAttribute("name") + '"]').show();
      }
      else{
        $('[name="preview_' + imageSupplements[i].getAttribute("name") + '"]').hide();
      }
    }
  }
  
 function fetchRetailSupplements(sku){
    for(var i = 0; i < imageSupplements.length; i++){
      if(imageSupplements[i].getAttribute("name") == sku){
        return retailSupplements[i].innerHTML;
      }
    }
    return null;
  }
  
  function fetchTitleSupplements(sku){
    for(var i = 0; i < imageSupplements.length; i++){
      if(imageSupplements[i].getAttribute("name") == sku){
        return titleSupplements[i].innerHTML;
      }
    }
    return null;
  }
  
  function fetchQuantitySupplements(sku){
    for(var i = 0; i < onHandSupplements.length; i++){
      if(sku == (onHandSupplements[i].innerHTML)){
        return quantitySupplements[i].innerHTML;
      }
    }
    return null;
  }
  
  function updateQuantitySupplements(sku, qty){
    for(var i = 0; i < onHandSupplements.length; i++){
      if(sku == (onHandSupplements[i].innerHTML)){
        quantitySupplements[i].innerHTML = Number(fetchQuantitySupplements(sku)) - Number(qty);
      }
    }
    quantitySupplements = document.getElementsByClassName("qty");
  }
  
  function populateSupplements(){
    var url = "";
    for(var i = 0; i < ctgSupplements.length; i++){
      getSupplements(imageSupplements[i].getAttribute("name"));
    }
  }
  
  //Get supplements for a particular sku number in the Product table by connecting to the database in the server fetching by category ID
  function getSupplements(sku){
    var urlStr = "http://www.***.com/workoutSupplements/servlet/FetchDetails?sku=" + sku + "&field=catID&table=product";
    $.ajax({
      url: urlStr,
      async: false,
      success: handleSupplements
    });
  }
  
  //Add supplements to category supplements
  function handleSupplements(response){
    ctgSupplements[ctgSupplementsIndex++]= response;
  }
  
  //Convert one digit number into two digit numbers
  function getTwoDigit(num){
    if(Number(num) < 10){
      return "0" + num;
    }
    return num;
  }
  
  //Focus handlers for credit card fields and shipping address fields
  function focusHandler(){
    $('[name="cardExpMon"]').on('keyup', function(){
      if($('[name="cardExpMon"]').val().trim().length == 2){
        $('[name="cardExpYear"]').focus();
      }       
    });
    $('[name="cardExpYear"]').on('keyup', function(){
      if($('[name="cardExpYear"]').val().trim().length == 4){
        $('[name="securityCode"]').focus();
      }       
    });
    $('[name="state"]').on('keyup', function(){
      if($('[name="state"]').val().trim().length == 2){
        $('[name="zip"]').focus();
      }       
    });
    $('[name="zip"]').on('keyup', function(){
      if($('[name="zip"]').val().trim().length == 5){
        $('[name="phoneArea"]').focus();
      }       
    });
    $('[name="phoneArea"]').on('keyup', function(){
      if($('[name="phoneArea"]').val().trim().length == 3){
        $('[name="phonePrefix"]').focus();
      }       
    });
    $('[name="phonePrefix"]').on('keyup', function(){
      if($('[name="phonePrefix"]').val().trim().length == 3){
        $('[name="phoneSuffix"]').focus();
      }       
    });
    $('[name="phoneSuffix"]').on('keyup', function(){
      if($('[name="phoneSuffix"]').val().trim().length == 4){
        $('[name="reuseInfo"]').focus();
      }       
    });
    $('[name="stateShipping"]').on('keyup', function(){
      if($('[name="stateShipping"]').val().trim().length == 2){
        $('[name="zipShipping"]').focus();
      }       
    });
    $('[name="zipShipping"]').on('keyup', function(){
      if($('[name="zipShipping"]').val().trim().length == 5){
        $('[name="phoneAreaShipping"]').focus();
      }       
    });
    $('[name="phoneAreaShipping"]').on('keyup', function(){
      if($('[name="phoneAreaShipping"]').val().trim().length == 3){
        $('[name="phonePrefixShipping"]').focus();
      }       
    });
    $('[name="phonePrefixShipping"]').on('keyup', function(){
      if($('[name="phonePrefixShipping"]').val().trim().length == 3){
        $('[name="phoneSuffixShipping"]').focus();
      }       
    });
  }
  
  //Error handlers
  function errorHandler(item){
    item.css("background-color", "pink");
    item.css("border", "1px solid red");
  }
  
  function clearError(item){
    item.css("background-color", "#FFF");
    item.css("border", "1px solid #19363F");
  }
  
  //Validation for customer credit card information and address text fields in the order form
  function validCustomer(){
    if($('[name="cardType"]').val() == "default"){
      errorHandler($('[name="cardType"]'));
      $('[name="showError"]').html("You must select a credit card from the dropdown menu");
      return false;
    }
    if(isNaN($('[name="cardNum"]').val()) || $('[name="cardNum"]').val().trim().length == 0){
      errorHandler($('[name="cardNum"]'));
      $('[name="showError"]').html("You must enter a valid credit card number in order to proceed");
      return false;
    }
    if(isNaN($('[name="cardExpMon"]').val()) || $('[name="cardExpMon"]').val().trim().length > 2){
      errorHandler($('[name="cardExpMon"]'));
      $('[name="showError"]').html("You must enter an expiration month");
      return false;
    }
    if(!validMonth($('[name="cardExpMon"]').val().trim())){
      errorHandler($('[name="cardExpMon"]'));
      $('[name="showError"]').html("You must provide a valid expiration month");
      return false;
    }
    if(isNaN($('[name="cardExpYear"]').val()) || $('[name="cardExpYear"]').val().trim().length != 4){
      errorHandler($('[name="cardExpYear"]'));
      $('[name="showError"]').html("You must enter an expiration year");
      return false;
    }
    if(!validYear($('[name="cardExpYear"]').val().trim())){
      errorHandler($('[name="cardExpYear"]'));
      $('[name="showError"]').html("You must provide a valid expiration year");
      return false;
    }
    if(!validDate($('[name="cardExpMon"]').val().trim(), $('[name="cardExpYear"]').val().trim())){
      errorHandler($('[name="cardExpMon"]'));
      $('[name="showError"]').html("Expiration month must be current");
      return false;
    }
    if(isNaN($('[name="securityCode"]').val()) || $('[name="securityCode"]').val().trim().length == 0){
      errorHandler($('[name="securityCode"]'));
      $('[name="showError"]').html("You must enter the security code in the back of your credit card");
      return false;
    }
    if($('[name="firstname"]').val().trim().length == 0){
      errorHandler($('[name="firstname"]'));
      $('[name="showError"]').html("You must enter your first name");
      return false;
    }
    if(invalidCharacter($('[name="firstname"]').val().trim())){
      errorHandler($('[name="firstname"]'));
      $('[name="showError"]').html("The ; character cannot be used");
      return false;
    }
    if(invalidCharacter($('[name="middlename"]').val().trim())){
      errorHandler($('[name="middlename"]'));
      $('[name="showError"]').html("The ; character cannot be used");
      return false;
    }
    if($('[name="lastname"]').val().trim().length == 0){
      errorHandler($('[name="lastname"]'));
      $('[name="showError"]').html("You must enter your last name");
      return false;
    }
    if(invalidCharacter($('[name="lastname"]').val().trim())){
      errorHandler($('[name="lastname"]'));
      $('[name="showError"]').html("The ; character cannot be used");
      return false;
    }
    if($('[name="address1"]').val().trim().length == 0){
      errorHandler($('[name="address1"]'));
      $('[name="showError"]').html("You must enter your address");
      return false;
    }
    if(invalidCharacter($('[name="address1"]').val().trim())){
      errorHandler($('[name="address1"]'));
      $('[name="showError"]').html("The ; character cannot be used");
      return false;
    }
    if(invalidCharacter($('[name="address2"]').val().trim())){
      errorHandler($('[name="address2"]'));
      $('[name="showError"]').html("The ; character cannot be used");
      return false;
    }if($('[name="city"]').val().trim().length == 0){
      errorHandler($('[name="city"]'));
      $('[name="showError"]').html("You must enter your city");
      return false;
    }
    if(invalidCharacter($('[name="city"]').val().trim())){
      errorHandler($('[name="city"]'));
      $('[name="showError"]').html("The ; character cannot be used");
      return false;
    }
    if($('[name="state"]').val().trim().length != 2){
      errorHandler($('[name="state"]'));
      $('[name="showError"]').html("You must enter your state in the correct abbreviation form");
      return false;
    }
    if(validState($('[name="state"]').val().trim())){
      errorHandler($('[name="state"]'));
      $('[name="showError"]').html("You must enter a valid state");
      return false;
    }
    if(isNaN($('[name="zip"]').val()) || $('[name="zip"]').val().trim().length != 5){
      errorHandler($('[name="zip"]'));
      $('[name="showError"]').html("You must enter a valid zip code");
      return false;
    }
    if(isNaN($('[name="phoneArea"]').val()) || $('[name="phoneArea"]').val().trim().length != 3){
      errorHandler($('[name="phoneArea"]'));
      $('[name="showError"]').html("You must enter a valid area code");
      return false;
    }
    if(isNaN($('[name="phonePrefix"]').val()) || $('[name="phonePrefix"]').val().trim().length != 3){
      errorHandler($('[name="phonePrefix"]'));
      $('[name="showError"]').html("You must enter a valid phone number prefix");
      return false;
    }
    if(isNaN($('[name="phoneSuffix"]').val()) || $('[name="phoneSuffix"]').val().trim().length != 4){
      errorHandler($('[name="phoneSuffix"]'));
      $('[name="showError"]').html("You must enter a valid phone number suffix");
      return false;
    }
    if($('[name="firstShipping"]').val().trim().length == 0){
      errorHandler($('[name="firstShipping"]'));
      $('[name="showError"]').html("You must enter your first name");
      return false;
    }
    if(invalidCharacter($('[name="firstShipping"]').val().trim())){
      errorHandler($('[name="firstShipping"]'));
      $('[name="showError"]').html("The ; character cannot be used");
      return false;
    }
    if(invalidCharacter($('[name="middleShipping"]').val().trim())){
      errorHandler($('[name="middleShipping"]'));
      $('[name="showError"]').html("The ; character cannot be used");
      return false;
    }
    if($('[name="lastShipping"]').val().trim().length == 0){
      errorHandler($('[name="lastShipping"]'));
      $('[name="showError"]').html("You must enter your last name");
      return false;
    }
    if(invalidCharacter($('[name="lastShipping"]').val().trim())){
      errorHandler($('[name="lastShipping"]'));
      $('[name="showError"]').html("The ; character cannot be used");
      return false;
    }
    if($('[name="address1Shipping"]').val().trim().length == 0){
      errorHandler($('[name="address1Shipping"]'));
      $('[name="showError"]').html("You must enter your address");
      return false;
    }
    if(invalidCharacter($('[name="address1Shipping"]').val().trim())){
      errorHandler($('[name="address1Shipping"]'));
      $('[name="showError"]').html("The ; character cannot be used");
      return false;
    }
    if(invalidCharacter($('[name="address2Shipping"]').val().trim())){
      errorHandler($('[name="address2Shipping"]'));
      $('[name="showError"]').html("The ; character cannot be used");
      return false;
    }if($('[name="cityShipping"]').val().trim().length == 0){
      errorHandler($('[name="cityShipping"]'));
      $('[name="showError"]').html("You must enter your city");
      return false;
    }
    if(invalidCharacter($('[name="cityShipping"]').val().trim())){
      errorHandler($('[name="cityShipping"]'));
      $('[name="showError"]').html("The ; character cannot be used");
      return false;
    }
    if($('[name="stateShipping"]').val().trim().length != 2){
      errorHandler($('[name="stateShipping"]'));
      $('[name="showError"]').html("You must enter your state in the correct abbreviation form");
      return false;
    }
    if(validState($('[name="stateShipping"]').val().trim())){
      errorHandler($('[name="stateShipping"]'));
      $('[name="showError"]').html("The state must be valid");
      return false;
    }
    if(isNaN($('[name="zipShipping"]').val()) || $('[name="zipShipping"]').val().trim().length != 5){
      errorHandler($('[name="zipShipping"]'));
      $('[name="showError"]').html("You must enter a valid zip code");
      return false;
    }
    if(isNaN($('[name="phoneAreaShipping"]').val()) || $('[name="phoneAreaShipping"]').val().trim().length != 3){
      errorHandler($('[name="phoneAreaShipping"]'));
      $('[name="showError"]').html("You must enter a valid area code");
      return false;
    }
    if(isNaN($('[name="phonePrefixShipping"]').val()) || $('[name="phonePrefixShipping"]').val().trim().length != 3){
      errorHandler($('[name="phonePrefixShipping"]'));
      $('[name="showError"]').html("You must enter a valid phone number prefix");
      return false;
    }
    if(isNaN($('[name="phoneSuffixShipping"]').val()) || $('[name="phoneSuffixShipping"]').val().trim().length != 4){
      errorHandler($('[name="phoneSuffixShipping"]'));
      $('[name="showError"]').html("You must enter a valid phone number suffix");
      return false;
    }
    return true;
  }
  
  //Clear error messages in credit card fields and shipping information text fields    
  function infoErrors(){
    $("[name='cardType']").on('focus', function(){
      clearError($("[name='cardType']"));
      $('[name="showError"]').html("&nbsp;");
    });
    $("[name='cardNum']").on('focus', function(){
      clearError($("[name='cardNum']"));
      $('[name="showError"]').html("&nbsp;");
    });
    $("[name='cardExpMon']").on('focus', function(){
      clearError($("[name='cardExpMon']"));
      $('[name="showError"]').html("&nbsp;");
    });
    $("[name='cardExpYear']").on('focus', function(){
      clearError($("[name='cardExpYear']"));
      $('[name="showError"]').html("&nbsp;");
    });
    $("[name='securityCode']").on('focus', function(){
      clearError($("[name='securityCode']"));
      $('[name="showError"]').html("&nbsp;");
    });
    $("[name='cardType']").on('focus', function(){
      clearError($("[name='cardType']"));
      $('[name="showError"]').html("&nbsp;");
    });
    $("[name='firstname']").on('focus', function(){
      clearError($("[name='firstname']"));
      $('[name="showError"]').html("&nbsp;");
    });
    $("[name='middlename']").on('focus', function(){
      clearError($("[name='middlename']"));
      $('[name="showError"]').html("&nbsp;");
    });
    $("[name='lastname']").on('focus', function(){
      clearError($("[name='lastname']"));
      $('[name="showError"]').html("&nbsp;");
    });
    $("[name='address1']").on('focus', function(){
      clearError($("[name='address1']"));
      $('[name="showError"]').html("&nbsp;");
    });
    $("[name='address2']").on('focus', function(){
      clearError($("[name='address2']"));
      $('[name="showError"]').html("&nbsp;");
    });
    $("[name='city']").on('focus', function(){
      clearError($("[name='city']"));
      $('[name="showError"]').html("&nbsp;");
    });
    $("[name='state']").on('focus', function(){
      clearError($("[name='state']"));
      $('[name="showError"]').html("&nbsp;");
    });
    $("[name='zip']").on('focus', function(){
      clearError($("[name='zip']"));
      $('[name="showError"]').html("&nbsp;");
    });
    $("[name='phoneArea']").on('focus', function(){
      clearError($("[name='phoneArea']"));
      $('[name="showError"]').html("&nbsp;");
    });
    $("[name='phonePrefix']").on('focus', function(){
      clearError($("[name='Prefix']"));
      $('[name="showError"]').html("&nbsp;");
    });
    $("[name='phoneSuffix']").on('focus', function(){
      clearError($("[name='phoneSuffix']"));
      $('[name="showError"]').html("&nbsp;");
    });
    $("[name='firstShipping']").on('focus', function(){
      clearError($("[name='firstShipping']"));
      $('[name="showError"]').html("&nbsp;");
    });
    $("[name='middleShipping']").on('focus', function(){
      clearError($("[name='middleShipping']"));
      $('[name="showError"]').html("&nbsp;");
    });
    $("[name='lastShipping']").on('focus', function(){
      clearError($("[name='lastShipping']"));
      $('[name="showError"]').html("&nbsp;");
    });
    $("[name='address1Shipping']").on('focus', function(){
      clearError($("[name='address1Shipping']"));
      $('[name="showError"]').html("&nbsp;");
    });
    $("[name='address2Shipping']").on('focus', function(){
      clearError($("[name='address2Shipping']"));
      $('[name="showError"]').html("&nbsp;");
    });
    $("[name='cityShipping']").on('focus', function(){
      clearError($("[name='cityShipping']"));
      $('[name="showError"]').html("&nbsp;");
    });
    $("[name='stateShipping']").on('focus', function(){
      clearError($("[name='stateShipping']"));
      $('[name="showError"]').html("&nbsp;");
    });
    $("[name='zipShipping']").on('focus', function(){
      clearError($("[name='zipShipping']"));
      $('[name="showError"]').html("&nbsp;");
    });
    $("[name='phoneAreaShipping']").on('focus', function(){
      clearError($("[name='phoneAreaShipping']"));
      $('[name="showError"]').html("&nbsp;");
    });
    $("[name='phonePrefixShipping']").on('focus', function(){
      clearError($("[name='PrefixShipping']"));
      $('[name="showError"]').html("&nbsp;");
    });
    $("[name='phoneSuffixShipping']").on('focus', function(){
      clearError($("[name='phoneSuffixShipping']"));
      $('[name="showError"]').html("&nbsp;");
    });
  }
  
  function clearShopCartError(){
    $('[name="cartErrorMsg"]').html("&nbsp;");
  }
  
  function noInput(inputValue){
    return $.trim(inputValue).length == 0;
  }
  
  function invalidCharacter(str){
    return str.match(/[;]/);
  }
  
  //Array for validation of two-letter state nomenclature with for-loop that iterates through the array for all states
  function validState(state){
    var stateArray = new Array("AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI",
                               "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI",
                               "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC",
                               "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT",
                               "VT", "VA", "WA", "WV", "WI", "WY");

    for(var j=0; j < stateArray.length; j++){
      if(($.trim(state)).toUpperCase() == stateArray[j]){
        return false;
      }
    }
    return true;
  }
  
  //Array for validation of one and two-digit number month with for-loop that iterates through the array
  function validMonth(month){
    var monthArray = new Array("1", "2", "3", "4", "5", "6", "7", "8", "9", "01", "02", "03", "04",
                               "05", "06", "07", "08", "09", "10", "11", "12");
    
    for(var j = 0; j < monthArray.length; j++){
      if(($.trim(month)) == monthArray[j]){
        return true;
      }
    }
    return false;
  }
  
  //Validate and make sure expiration year is correct
  function validYear(year){
    var valid = new Date();
    if(Number(year) < valid.getFullYear())
      return false;
    else
      return true;
  }
  
  //Validate and make sure the date entered is correct
  function validDate(month, year){
    var valid = new Date();
    if(year == valid.getFullYear() && Number(month) >= valid.getMonth()){
      return true;
    }
    if(Number(year) > valid.getFullYear()){
      return true;
    } 
    return false;
  }
});