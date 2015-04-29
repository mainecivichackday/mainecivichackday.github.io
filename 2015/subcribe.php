<?php
if(isset($_POST['action'])) { // Checking for submit form
	$file	= "data/subcribers.xml";
	$xml 	= new SimpleXMLElement($file,null,true);
	if($_POST['action']=='add') {
		$email_address	= trim(strip_tags(addslashes($_POST['email_address'])));
		$date		= date("Y-m-d H:i:s");
		$num		= (int) count($xml->user) - 1;
		$id			= ($num < 0) ? 1 : (int) $xml->user[$num]->id + 1;
		$pattern	= '/^[^\W][a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*\@[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*\.[a-zA-Z]{2,4}$/';
		
		$user 		= $xml->addChild('subcriber');
		$user->addChild('id',$id);
		$user->addChild('email',$email_address);
		$user->addChild('date',$date);
		
		if(preg_match($pattern,$email_address)) {
		$xpath	= "/subcribers/subcriber[email='$email_address']";
		if((int) count($xml->xpath($xpath))-1 == 0) {
		file_put_contents($file,$xml->asXML());
		echo "success|Subscribe process completed....";
		} else
		echo "error|Email is already registered....";
		} else {
		echo "error|Please enter a valid email address....";		
		}
	}
} else { // Submit form false
	header("Location: index.html");	
}
?>