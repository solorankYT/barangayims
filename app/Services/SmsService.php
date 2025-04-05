<?php

namespace App\Services;

use Exception;

class SmsService
{
    const SERVER = "https://sms.rootscratch.com";
    const API_KEY = "420fed6f3c78daa374ba9e04bf40b20ae156317f";
    
    const USE_SPECIFIED = 0;
    const USE_ALL_DEVICES = 1;
    const USE_ALL_SIMS = 2;

    public function sendBulkMessages(array $messages, int $option = self::USE_SPECIFIED, array $devices = [], $schedule = null, $useRandomDevice = false)
    {
        $url = self::SERVER . "/services/send.php";
        $postData = [
            'messages' => json_encode($messages),
            'schedule' => $schedule,
            'key' => self::API_KEY,
            'devices' => json_encode($devices),
            'option' => $option,
            'useRandomDevice' => $useRandomDevice
        ];
        
        return $this->sendRequest($url, $postData)["messages"];
    }

    private function sendRequest($url, $postData)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        
        if (curl_errno($ch)) {
            throw new Exception(curl_error($ch));
        }
        curl_close($ch);
        
        if ($httpCode == 200) {
            $json = json_decode($response, true);
            if ($json == false) {
                if (empty($response)) {
                    throw new Exception("Missing data in request. Please provide all the required information to send messages.");
                } else {
                    throw new Exception($response);
                }
            } else {
                if ($json["success"]) {
                    return $json["data"];
                } else {
                    throw new Exception($json["error"]["message"]);
                }
            }
        } else {
            throw new Exception("HTTP Error Code : {$httpCode}");
        }
    }
}