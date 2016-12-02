<?php
$servername = "localhost:8889";
$username = "roottest";
$password = "";
$dbname = "storyboard";
$course = $_POST['course'];
$module = $_POST['module'];
$lesson = $_POST['lesson'];
$mainpoint = $_POST['mainpoint'];
$number = $_POST['number'];
//$response = "";
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "SELECT title, pageType, screenText, instructDev, audio, instructUser, graphicsComments, graphics, buttons, choices, dragElements, question, incorrectFeedback, correctFeedback FROM pages WHERE course = '$course' AND module = '$module' AND lesson = '$lesson' AND mainpt = '$mainpoint' AND number = '$number'";

$result = $conn->query($sql);
if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
		$response[0] = $row["title"];
		$response[1] = $row["pageType"];
		$response[2] = $row["instructDev"];
		$response[3] = $row["graphicsComments"];
		$response[4] = $row["question"];
		$response[5] = $row["incorrectFeedback"];
		$response[6] = $row["correctFeedback"];
		$i = 7; 
		
		// put image information into array
		$simple =  "<graphics>".$row["graphics"]."</graphics>";
		$images = simplexml_load_string($simple);
		foreach ($images->image as $image){
			$path = (string)$image->link;
			// THIS WILL NEED TO BE CHANGED ONCE WE HAVE A DOMAIN
			$isUpload = strncmp("www.exportertool.com/js/", $path, 24);
			if ($isUpload == 0)
				$response[$i]["tag"] = "upload";
			else
				$response[$i]["tag"] = "link";
			$response[$i]["type"] = (string)$image->type;
			$response[$i]["value"] = str_replace("www.exportertool.com/", "",$path);
			$i++;
		}
		
		// put audio information into array
		$simple = $row["audio"];
		$p = xml_parser_create();
		xml_parse_into_struct($p, $simple, $vals, $index);
		xml_parser_free($p);
		for ($j = 1; $j < (count($vals)-1); $j++){
			$response[$i]["tag"] = $vals[$j]["tag"];
			$response[$i]["value"] = $vals[$j]["value"];
			$i++;
		}
		
		// put user instruction information into array
		$simple = $row["instructUser"];
		$p = xml_parser_create();
		xml_parse_into_struct($p, $simple, $vals, $index);
		xml_parser_free($p);
		for ($j = 1; $j < (count($vals)-1); $j++){
			$response[$i]["tag"] = $vals[$j]["tag"];
			$response[$i]["value"] = $vals[$j]["value"];
			$i++;
		}
		
		// put screen text information into array
		$simple = $row["screenText"];
		$p = xml_parser_create();
		xml_parse_into_struct($p, $simple, $vals, $index);
		xml_parser_free($p);
		for ($j = 1; $j < (count($vals)-1); $j++){
			$response[$i]["tag"] = $vals[$j]["tag"];
			$response[$i]["value"] = $vals[$j]["value"];
			$i++;
		}
		
		// put choice information into array
		// put image information into array
		$simple =  $row["choices"];
		$choices = simplexml_load_string($simple);
		foreach ($choices->choice as $choice){
			if ($row["pageType"] == "Progress Check - Multiple Choice" || $row["pageType"] == "Progress Check - True/False")
				$response[$i]["tag"] = "radio";
			else
				$response[$i]["tag"] = "checkbox";
			$response[$i]["value"] = (string)$choice->value;
			$response[$i]["answer"] = (string)$choice->answer;
			$i++;
		}
	
		// put drag/drop information into array
		$simple = $row["dragElements"];
		$dragElements = simplexml_load_string($simple);
		foreach ($dragElements->dragElement as $dragElement){
			$path = (string)$dragElement->link;
			// THIS WILL NEED TO BE CHANGED ONCE WE HAVE A DOMAIN
			$isUpload = strncmp("www.exportertool.com/js/", $path, 24);
			if ($isUpload == 0)
				$response[$i]["tag"] = "uploadDrag";
			else
				$response[$i]["tag"] = "linkDrag";
			$response[$i]["term"] = (string)$dragElement->term;
			$response[$i]["description"] = (string)$dragElement->description;
			$response[$i]["value"] = str_replace("www.exportertool.com/", "",$path);
			$i++;
		}
		
		// put button information into array
		$simple = $row["buttons"];
		$buttons = simplexml_load_string($simple);
		if ($row["pageType"] == "Hub Page")
			$type = "Hub";
		else if ($row["pageType"] == "Pop Page")
			$type = "Pop";
		foreach ($buttons->button as $button){
			$path = (string)$button->link;
			// THIS WILL NEED TO BE CHANGED ONCE WE HAVE A DOMAIN
			$isUpload = strncmp("www.exportertool.com/js/", $path, 24);
			if ($isUpload == 0)
				$response[$i]["tag"] = "upload".$type;
			else{
				if ($path == "none")
					$response[$i]["tag"] = "trad".$type;
				else
					$response[$i]["tag"] = "link".$type;
			}
			$response[$i]["label"] = (string)$button->label;
			if ($type == "Hub")
				$response[$i]["pageDestination"] = (string)$button->pageDestination;
			else if ($type == "Pop")
				$response[$i]["description"] = (string)$button->description;
			$response[$i]["value"] = str_replace("www.exportertool.com/", "",$path);
			$i++;
		}
	
	
	
		
    } 
} else {
    $response = "0 results";
}

echo json_encode($response);
$conn->close();
?>
