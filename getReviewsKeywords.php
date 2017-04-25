<?php

if( in_array($_GET['HotelCode'], array('9917391', '2280482', '10275336')) ){
    
    $hotelcode = $_GET['HotelCode'];

    $json = file_get_contents(__DIR__ . '/resources/api_responses/expedia/hotel_review_analyser/'.$hotelcode.'/reviewsAnalysed.json');
    $json = json_decode($json, true);
    
    $bestWords = array();
    
    foreach($json as $review){
        foreach($review['entities'] as $entity){
            
            if( isset($entity['tokens']) ){
                foreach($entity['tokens'] as $token){
                    if( $entity['sentiment'] > 0.6 ){
                        
                        if( !isset($bestWords[ $entity['type'] ]) )
                            $bestWords[ $entity['type'] ] = array();
                        
                        if( !isset($bestWords[ $entity['type'] ][ $token['word'] ]) )
                            $bestWords[ $entity['type'] ][ $token['word'] ] = 0;
                        
                        $bestWords[ $entity['type'] ][ $token['word'] ]++;
                    }
                }
            }
        
        }
    }
    
    foreach($bestWords as $type => $words ){
        arsort($bestWords[ $type ]);
    }
    
    echo json_encode($bestWords);

}