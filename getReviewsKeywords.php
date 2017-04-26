<?php

if( in_array($_GET['HotelCode'], array('9917391', '2280482', '10275336')) ){
    
    $hotelcode = $_GET['HotelCode'];
    sleep(2);
    $json = file_get_contents(__DIR__ . '/resources/api_responses/expedia/hotel_review_analyser/'.$hotelcode.'/reviewsAnalysed.json');
    $json = json_decode($json, true);
    
    $bestWords = array();
    
    foreach($json as $review){
        foreach($review['entities'] as $entity){
            
            if( isset($entity['tokens']) ){
                if( $entity['sentiment'] > 0.6 ){
                    
                    $Tokens = array();
                    $dontParse = array();
                    foreach($entity['tokens'] as $index => $token){
                        if( !in_array($index, $dontParse) ){
                        
                            $entity['tokens'][$index]['word'] = strtolower($entity['tokens'][$index]['word']);
                            
                            //get the next words
                            $string = substr($review['text'], $token['position']);
                            $string = strtolower($string);
                            $exploded = explode(' ', $string);
                            $exploded[1] = preg_replace("/[^A-Za-z0-9?!]/",'',$exploded[1]);
                            
                            //var_dump($entity['tokens'][$index+1]['word'], $exploded[1], '----');
                            
                            if( isset($entity['tokens'][$index+1]['word']) ){
                                
                                $entity['tokens'][$index+1]['word'] = strtolower($entity['tokens'][$index+1]['word']);
                                if($exploded[1] == $entity['tokens'][$index+1]['word'] ){
                                    $entity['tokens'][ $index ]['word'] .= ' '.$entity['tokens'][$index+1]['word'];
                                    // $dontParse[] = $index+1;
                                    unset($entity['tokens'][$index+1]);
                                }
                            }
                        
                        }
                    }
                    
                    foreach($entity['tokens'] as $index => $token){
                    
                        if( !isset($bestWords[ $entity['type'] ]) )
                            $bestWords[ $entity['type'] ] = array();
                            
                        $addWord = true;
                        $token['word'] = preg_replace("/[^A-Za-z0-9?!]/",'', $token['word']);
                        
                        foreach($bestWords[ $entity['type'] ] as $word => $count){
                            if( $token['word'] && $word ){
                                if(strpos($token['word'], $word) !== false || strpos($word, $token['word']) !== false ){
                                    $addWord = false;
                                    $bestWords[ $entity['type'] ][ $token['word'] ]++;
                                }
                            }
                        }
                        
                        if( $addWord && $token['word'] )                        
                            if( !isset($bestWords[ $entity['type'] ][ $token['word'] ]) )
                                $bestWords[ $entity['type'] ][ $token['word'] ] = 1;
                                
                               
                        
                    }
                }
            }
        
        }
    }
    
    
    foreach($bestWords as $type => $words ){
        $keys = array_map('strlen', array_keys($bestWords[ $type ]));
        array_multisort($keys, SORT_DESC, $bestWords[ $type ]);
    }
    
    echo json_encode($bestWords);

}