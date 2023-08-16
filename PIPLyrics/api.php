<?php
require __DIR__ . '/vendor/autoload.php';

$get = file_get_contents("http://localhost:5000/songID");
echo $get;
$data = json_decode($get, true);
echo $data;
$songID = $data["SongID"];
$match = $data["match"];
if($match == True){
    return 1;
}

$spotify = new SpotifyLyricsApi\Spotify("AQCKaQKikYd_Q1E5cLsqHrqGs-ELeW1eqGN_c9X_Y5YZNLIvZN1NdESXNBrVym7m5kqLsle1jOC99ukb_Xj53biwWYmAHfIt6LzxAY0ynSKYZ5PLUqQltlhXImOwt0Vrnh6j8ly4X06WRLM9djg9mRfQKxxRv1dK");
$spotify->checkTokenExpire();
$track = $songID;
$response = $spotify -> getLyrics(track_id: $track);
if(empty($response)){  
    $url = "http://localhost:5000/error";
    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_URL, $url);   
    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($curl, CURLOPT_POSTFIELDS, "Lyrics Unavailable");
    curl_setopt($curl, CURLOPT_HTTPHEADER, array(
        'Content-Type: text/plain'
    )); 
    $response = curl_exec($curl);
    curl_close($curl); 
    return "Lyrics Unavailable";
}
//Just to pretty print JSON
$json = $response;
$data = json_decode($json, true);
$data[] = ['trackID' => $track];
$pretty_json = json_encode($data, JSON_PRETTY_PRINT);
echo $pretty_json;

$url = "http://localhost:5000/data";
$curl = curl_init($url);
curl_setopt($curl, CURLOPT_URL, $url);

curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($curl, CURLOPT_POSTFIELDS, $pretty_json);
curl_setopt($curl, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json'
));

$response = curl_exec($curl);
curl_close($curl);
?>
