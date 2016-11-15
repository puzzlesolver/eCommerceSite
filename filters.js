/*  This JavaScript file includes three different filters as part of an online store which allows a user to filter the displayed items.
    Items can be filtered by Vendor, Category, and Price. The user can filter the items by selecting checkboxes which trigger the filters.
    After selecting specific checkboxes as filters the items displayed on the right-hand side of the page will change dinamically.
*/

valid = false;

$(document).ready(function() {
    var cart = new shopping_cart("workoutSupplements");
    $('#cartSize').html("("+cart.size()+")");
    product_data = new Array();
    $( "#dialog-modal" ).dialog({
         height: 500,
         width: 600,
         modal: true,
         autoOpen: false,
         open: function() {
       		 $('.ui-widget-overlay').addClass('custom-overlay').bind('click', function() { $("#dialog-modal").dialog('close'); });
         },
         close: function() {
                $('.ui-widget-overlay').removeClass('custom-overlay');
            },
     });
    
    $.get('http://www.***.com/workoutSupplements/servlet/FetchVendors',
        handleVendor);
    $.get('http://www.***.com/workoutSupplements/servlet/FetchCategories',
        handleCategory);
    $.get('http://www.***.com/workoutSupplements/servlet/FetchSupplements',
        handleProducts);
        
    $('[name="sku"]').focus();
    catID = document.URL.indexOf('?catId=');
    venID = document.URL.indexOf('?venId=');
    
    if (catID !== -1 && catID != null) {
         var string = document.URL.split('?');
         var my_category = decodeURI(string[1]);
         var required = my_category.split('=');
         cat_id = required[1];
         displayProductsByCategory(cat_id);
    }
    
    if (venID !== -1 && venID != null) {
         var string = document.URL.split('?');
         var my_vendor = decodeURI(string[1]);
         var required = my_vendor.split('=');
         ven_id = required[1];
         displayProductsByVendor(ven_id);
     }
    
    function displayProductsByCategory(id){
        highlightCategory(id);
        var url = 'http://www.***.com/workoutSupplements/servlet/FilterSupplements';
        var data={catIds : id}
        $.get(url,data,handleProducts);
    }
    
    function highlightCategory(id){
        $("input[name='category']").each(function() {
            if($.trim($(this).val())==$.trim(id)){
			this.checked=true;
            }
        });
    }
    
     function displayProductsByVendor(id){
         var url = 'http://www.***.com/workoutSupplements/servlet/FilterSupplements';
         var data={venIds : id}
         $.get(url,data,handleProducts);
         highlightVendor(id);
     }
    
    function highlightVendor(name){
        $("input[name='vendor']").each(function() {
            if($.trim($(this).val())==$.trim(name)){
			this.checked=true;
            }
        });
    }                           
    
    function handleVendor(response) {
        var items = response.split('||');
        var vendorHandle = $('#vendorList');
        for(var i=0; i < items.length; i++) {
            var pairs = items[i].split('='); 
            vendorHandle.append( "<input type='checkbox' class='filterCheckbox' id='ven"+pairs[0]+"' name='vendor' value='"+pairs[0]+"'/><label>"+pairs[1]+"</label> <br />");  attachFilterHandler("ven"+pairs[0]);
        }
    }
	
	function filterProducts() {
        selectedVendors  = new Array();
        selectedCategories  = new Array();
		    selectedVendors.splice(0, selectedVendors.length);
		    selectedCategories.splice(0, selectedCategories.length);
        $("input[name='vendor']:checked").each(function() {
            selectedVendors.push($(this).val());
		});
		
		$("input[name='category']:checked").each(function() {
            selectedCategories.push($(this).val());
		});
		var price_Upper = null;
		var price_Lower = null;
		if ($("input[name='price']:checked").val()) {
                   var price = $("input[name='price']:checked").val().split("-");
        	    price_Lower = price[0];
		    price_Upper = price[1];
        }
		var url = 'http://www.***.com/workoutSupplements/servlet/FilterSupplements';
        var data={venIds : selectedVendors.join(","), catIds:selectedCategories.join(","), priceUpper : price_Upper, priceLower : price_Lower}
        $.get(url,data,  handleProducts);
    }
    
    $("input[name='price']").on('click', function(){
        filterProducts();
    });
	
function attachFilterHandler(id){
    $('#'+id).on('change', function(){
        filterProducts();
    });
}

function handleCategory(response) {
    var items = response.split('||');
    var categoryHandle = $('#categoryList');
    for(var i=0; i < items.length; i++) {
        var pairs = items[i].split('='); 
	      categoryHandle.append( "<input type='checkbox' class='filterCheckbox' id='cat"+pairs[0]+"' name='category' value='"+pairs[0]+"'/><label>"+pairs[1]+"</label> <br />");    
        attachFilterHandler("cat"+pairs[0]);
    }
}
	
function attachCategoryHandler(id){
    $('#'+id).on('change', function(){
        selectedVendors  = new Array();
        selectedCategories  = new Array();
        selectedVendors.splice(0, selectedVendors.length);
		    selectedCategories.splice(0, selectedCategories.length);
		
		$("input[name='vendor']:checked").each(function() {
            selectedVendors.push($(this).val());
		});
		
		$("input[name='category']:checked").each(function() {
            selectedCategories.push($(this).val());
		});
        
        var url = 'http://www.***.com/workoutSupplements/servlet/FilterSupplements';
        var data={venIds : selectedVendors.join(","), catIds:selectedCategories.join(",")}
        $.get(url,data,  handleProducts);
    });
}
        
function handleSKU(response) {
    if($.trim(response) == "ok") {
    	valid = true;
        return;
    }
    $('[name="sku"]').addClass("error");
}
    
function handleProducts(response) {
    if($.trim(response)=="INVALID"){
        $('#products').html("These supplements are not avaliable or do not exist for this filter.");
    }else{
        product_data.splice(0, product_data.length);
        var tmpArray = explodeArray(response,'#');
        for(var i=0; i < tmpArray.length; i++) {
        innerArray = explodeArray(tmpArray[i],'|');
        product_data[i] = innerArray;
        }
        viewAllItems(product_data);
    }
}
 
//Shows details of all supplements including image, name, and retail price of the supplement. It also attaches a button to send user to shopping page    
function viewAllItems(product_data){
    var tmpString = "<div class='contentInfo'></div>";
    for(var i=0; i < product_data.length; i++) {
        tmpString += "<div class='item'>";
		    tmpString += "<div class='prodImg'>";
		    tmpString += "<div id='img_"+product_data[i][6]+"'>";
		    tmpString += "<img src=\"/~workoutSupplements/onlineStore/images/" +(product_data[i][6]).toUpperCase()+"\" alt=\""+product_data[i][6]+"\""+" width=\"150px\" height='200px'  /></div>";
		    tmpString += "</div>";
        tmpString += "<p style='font-size:1.5em;text-align:center'><strong>"+ product_data[i][2] + "</strong></p>";
        tmpString += "<p style='text-align:center'><strong>$"+product_data[i][5]+ "</strong></p>"; 
        
        if(product_data[i][7]>0){
            tmpString += "<p style='color:green;text-align:center'><strong>In Stock ("+product_data[i][7]+") </strong></p>";
            tmpString += " <input type=\"button\" class='buttonStyle' style='text-align:center'value=\"Start Shopping!\" id=\""+product_data[i][6]+"\"/> ";
        }else if(product_data[i][7]==0){
            tmpString += "<p style='color:red;text-align:center'><strong>More on the way!</strong></p>";
        }else{
            tmpString += "<p style='color:orange;text-align:center'><strong>Coming soon!</strong></p>";
        }
        tmpString += "</div>";
    }
    $('#products').html(tmpString);
    for(var i=0; i < product_data.length; i++) {
        attachAddHandler(product_data[i][6]);
        attachImgHandler("img_"+product_data[i][6], product_data[i]);
    }
}

//Send the customer to the shopping page after the "Start Shopping!" button is clicked    
function attachAddHandler(id){
 	$('#'+id).on('click',function(){
        window.location="http://www.***.com/workoutSupplements/servlet/AllSupplements";
    });
 }
 
//Send the customer to the shopping page after the image of the supplement is clicked    
function attachImgHandler(id, product_data){
    $('#'+id).on('click',function(){
        window.location="http://www.***.com/workoutSupplements/servlet/AllSupplements";
	});
 } 
    
function explodeArray(item,delimiter) {
    tempArray=new Array(1);
    var Count=0;
    var tempString=new String(item);
    while (tempString.indexOf(delimiter)>0) {
        tempArray[Count]=tempString.substr(0,tempString.indexOf(delimiter));
        tempString=tempString.substr(tempString.indexOf(delimiter)+1,tempString.length-tempString.indexOf(delimiter)+1);
        Count=Count+1
    }
    tempArray[Count]=tempString;
    return tempArray;
} 
});
