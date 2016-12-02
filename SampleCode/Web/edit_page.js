// This script is called when the user selects and views a page or wants to add a new one

// general information is what is always present on any page type, dynamic information is what is unique in quantity and type for each page

function editPage(){

  /* CODE REMOVED FOR SIMPLIFICATION PURPOSES*/
	
	request = $.ajax({ // tell the system which page's information you would like to obtain
		type: 'post',
		url: 'js/database_php_files/get_page_info.php', // this php page is going to return information encoded in JSON
		data:'course=' + courseData + '&module=' + moduleData + '&lesson=' + lessonData + '&mainpoint=' + mpData + '&number=' + pageData,
	}); // end ajax
	
		
	// Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        // Log a message to the console
		if (response == "0 results")
        	console.log(response);
		else{ // the response is a string containing a list of all the page's unique information separated by commas		
			
			number.appendChild(document.createTextNode(pageData));
			var array = JSON.parse(response); // create an array of the information belonging to the page from the JSON encoded responses from the php page
			
			// populate the form with the page's values
			// begin the process of sorting all the information from the returned JSON data that was made into a JS array and filling the page form with it so it is visable and editable 
			scTitle.value = array[0];
			pageTypeSelect.value = array[1];
			switch (array[1]){
				case "Progress Check - Multiple Choice":
					singleAns(additionalInfoArea, fs);
					break;
				case "Progress Check - True/False":
					singleAns(additionalInfoArea, fs);
					break;
				case "Progress Check - Check Box":
					multiAns(additionalInfoArea, fs);
					break;
				case "Full Screen":
					fullScreen();
					break;
				case "Progress Check - Drag/Drop":
					dragDrop(additionalInfoArea, fs);
					break;
				case "Pop Page":
					popPage(additionalInfoArea, fs);
					break;
				case "Hub Page":
					hubPage(additionalInfoArea, fs);
					break;
			 }
			inDev.value = array[2];
			gra.value = array[3];
			$("textarea#question").val(array[4]);
			$("input#incorrect").val(array[5]);
			$("input#correct").val(array[6]);
			var galleryCreated = false;
			for (var iterator = 7; iterator < array.length; iterator++){
				// dynamic information to be added to the page.  The type of information is determined via array[iterator].tag
				switch (array[iterator].tag){
					case "CC":
						var ccElements = addClosedCaptioning();
						var cc = ccElements[0];
						var removebtn = ccElements[1];
						cc.value = array[iterator].value;
						break;
					case "IU":
						var uiElements = addUserInstruction();
						var ui = uiElements[0];
						var removebtn = uiElements[1];
						ui.value = array[iterator].value;
						break;
					// NEEEEEEEDS REMOVE BUTTON CODE LIKE THE REST
					case "SS":
						var sen = addSentence();
						sen.value = array[iterator].value;
						break;
					case "BB":
						var bul = addBullet();
						bul.value = array[iterator].value;
						break;
					case "SB":
						var subBul = addSubBullet();
						subBul.value = array[iterator].value;
						break;
					case "link":
						var lnkElements = addImageLink();
						lnk = lnkElements[0];
						lnk.value = array[iterator].value;
						var typeSel = lnkElements[1];
						typeSel.value = array[iterator].type;
						var removebtn = lnkElements[2];
						break;
					case "linkDrag":
						var lnkElements = addDragImageLink();
						var linkDrag = lnkElements[0];
						linkDrag.value = array[iterator].value;
						var term = lnkElements[1];
						term.value = array[iterator].term;
						var desc = lnkElements[2];
						desc.value = array[iterator].description;
						var removebtn = lnkElements[3];
						break;
					case "linkHub":
						var lnkElements = addHubLinkBasedBtn(array[iterator].pageDestination);
						var label = lnkElements[0];
						label.value = array[iterator].label;
						var pageDest = lnkElements[1];
						var linkHub = lnkElements[2];
						linkHub.value = array[iterator].value;
						var removebtn = lnkElements[3];
						break;
					case "linkPop":
						var lnkElements = addLinkBasedBtn();
						var label = lnkElements[0];
						label.value = array[iterator].label;
						var linkPop = lnkElements[1];
						linkPop.value = array[iterator].value;
						var desc = lnkElements[2];
						desc.value = array[iterator].description;
						var removebtn = lnkElements[3];
						break;
					case "upload":
						if (galleryCreated == false){
							createGallery();
							galleryCreated = true;
						}
						createGalleryElement(array[iterator].value, array[iterator].type);
						break;
					case "uploadDrag":
						uploadDragEdit(array[iterator].value, array[iterator].term, array[iterator].description);
						break;
					case "uploadHub":
						uploadHubEdit(array[iterator].value, array[iterator].label, array[iterator].pageDestination);
						break;
					case "uploadPop":
						uploadPopEdit(array[iterator].value, array[iterator].label, array[iterator].description);
						break;
					case "tradHub":
						var tradElements = addHubTradBtn(array[iterator].pageDestination);
						var label = tradElements[0];
						label.value = array[iterator].label;
						var pageDes = tradElements[1];
						var removebtn = tradElements[2];
						break;
					case "tradPop":
						var tradElements = addTradBtn();
						var label = tradElements[0];
						label.value = array[iterator].label;
						var desc = tradElements[1];
						desc.value = array[iterator].description;
						var removebtn = tradElements[2];
						break;
					case "radio":
						var radioElements = radioBtnAnswer();
						var radio = radioElements[0];
						var input = radioElements[1];
						var removebtn = radioElements[2];
						radio.value = array[iterator].value;
						input.value = array[iterator].value;
						if (array[iterator].answer == "correct"){
							$(radio).attr('checked',true);
						}
					
						break;
					case "checkbox":
						var cbElements = checkBoxAnswer();
						var cb = cbElements[0];
						var input = cbElements[1];
						var removebtn = cbElements[2];
						cb.value = array[iterator].value;
						input.value = array[iterator].value;
						if (array[iterator].answer == "correct"){
							$(cb).attr('checked',true);
						}
						break;
				}
			}		
		}
		
			// check out info stuff
		var result = findCheckOutInfo();
		
		if (result == "0 results"){ // the system could not find the page in the database
			console.log("the system could not find the page in the database");
			divHeading2.appendChild(heading2);
		}
		
		else if (result == "owner"){ // if the page is checked out by the current user, allow only them to edit its info
			var numberSpan = document.createElement("span");
			numberSpan.className = "numbering";
			numberSpan.appendChild(document.createTextNode("check out "));
			var checkBox = document.createElement("input");
			checkBox.setAttribute("type", "checkbox");
			checkBox.id = "checkOut";
			checkBox.checked = true;
			numberSpan.appendChild(checkBox);
			heading2.appendChild(numberSpan);
			divHeading2.appendChild(heading2);
			
			$("input#checkOut").change(function() {
				if(this.checked) {
					checkOutFunction(true);
				}
				else{
					checkOutFunction(false);
				}
			});
		}
		
		else if (result == "none"){ // the page is not checked out by anyone, then allow any user to edit its info
			var numberSpan = document.createElement("span");
			numberSpan.className = "numbering";
			numberSpan.appendChild(document.createTextNode("check out "));
			var checkBox = document.createElement("input");
			checkBox.setAttribute("type", "checkbox");
			checkBox.id = "checkOut";
			numberSpan.appendChild(checkBox);
			heading2.appendChild(numberSpan);
			divHeading2.appendChild(heading2);
			
			$("input#checkOut").change(function() {
				if(this.checked) {
					checkOutFunction(true);
				}
				else{
					checkOutFunction(false);
				}
			});
		}
		
		else{ // the page is currently checked out by someone else, do not allow the current user to edit any information
			var checkedOut = true;
			var numberSpan = document.createElement("span");
			numberSpan.className = "numbering";
			numberSpan.appendChild(document.createTextNode("checked out by "));
			var ownerSpan = document.createElement("span");
			ownerSpan.className = "ownerSpan";
			ownerSpan.appendChild(document.createTextNode(result));
			numberSpan.appendChild(ownerSpan);
			heading2.appendChild(numberSpan);
			divHeading2.appendChild(heading2);
			$("form#newPageForm").find("input:not(:disabled), select:not(:disabled), textarea:not(:disabled)").prop("disabled",true);
		}
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
        // Log the error to the console
        console.log("lesson data transfer fail");
    });
	
  }

}




// check out system
function checkOutFunction(checked){
	var selectPages = document.getElementById("page");
	var pageNumber = selectPages.options[selectPages.selectedIndex].text; // get which page is selected
	request = $.ajax({ // tell the system which module's information you would like to obtain
		type: 'post',
		url: 'js/database_php_files/check_out_system.php',
		data:'checked=' + checked + '&pageNumber=' + pageNumber,
	}); // end ajax
	
	// Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
		console.log(response);
	});
	
	 // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
        // Log the error to the console
        console.log("lesson data transfer fail");
    });
}




// when a user wants to view an existing page, check and see if the page what the checkout information for that page is
function findCheckOutInfo(){
	var selectPages = document.getElementById("page");
  	var pageNumber = selectPages.options[selectPages.selectedIndex].text; // get which page is selected
	var result;
	request = $.ajax({ 
		type: 'post',
		url: 'js/database_php_files/get_checkout_info.php',
		data:'pageNumber=' + pageNumber,
		async: false, 
		success:  function(data) {
			info = data;
		}
	});
	result = info;
	return result;
}



/* CODE REMOVED FOR SIMPLIFICATION PURPOSES */
