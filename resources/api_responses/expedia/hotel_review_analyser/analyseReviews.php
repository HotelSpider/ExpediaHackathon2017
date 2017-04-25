<?php
// '9917391', 

foreach( array('2280482', '10275336') as $hotelcode){
    
    $json = file_get_contents(__DIR__ . '/../../../test_data/'.$hotelcode.'/reviews.json');
    $json = json_decode($json, true);
    
    $rawAnalysis = array();
    
    foreach($json as $reviews){ 
        if( isset($reviews) ){ die(var_dump($reviews));
            foreach($reviews as $review){
            
                $comment = $review['comments'];
                
                $ch = curl_init();
    
                curl_setopt($ch,CURLOPT_URL, 'https://services.expediapartnercentral.com/hotel-review/service/v1/analyze');
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");                                                                     
                curl_setopt($ch, CURLOPT_POSTFIELDS, $comment);                                                                  
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_USERPWD, "EQC16637524hotel:test1234Test!" );
                curl_setopt($ch, CURLOPT_HTTPHEADER, array(                                                                          
                    'Content-Type: application/json',                                                                                
                    'Content-Length: ' . strlen($comment))                                                                       
                );                                                                                                                   
                                                                                                                                     
                $result = curl_exec($ch);
                
                $result = json_decode($result, true);
                if( isset($result['result']) ){
                    $rawAnalysis[] = $result['result'];
                }
                
                sleep(1);
            
            }
        }
    }
    
    if( !is_dir(__DIR__ . '/../../../api_responses/expedia/hotel_review_analyser/'.$hotelcode) )
        mkdir(__DIR__ . '/../../../api_responses/expedia/hotel_review_analyser/'.$hotelcode);
    
    $fp = fopen(__DIR__ . '/../../../api_responses/expedia/hotel_review_analyser/'.$hotelcode.'/reviewsAnalysed.json', 'w');
    fwrite($fp, json_encode($rawAnalysis));
    fclose($fp);

}