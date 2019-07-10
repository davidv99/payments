<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Config;

class WebServiceController extends Controller
{
    public function makeRequest($path, $body){

        $route = Config("app.BASE_URL_SERVICE").$path;
        
        $curl = curl_init();
        curl_setopt_array($curl, array(
          CURLOPT_URL=> $route,
          CURLOPT_SSL_VERIFYHOST => 0,                    // don't verify ssl 
          CURLOPT_SSL_VERIFYPEER => 0,                    // 
          CURLOPT_RETURNTRANSFER => true,                 // return web page 
          CURLOPT_ENCODING       => "",                   // handle all encodings 
          CURLOPT_MAXREDIRS      => 10,                   // stop after 10 redirects
          CURLOPT_TIMEOUT        => 3000,                 // timeout on response 
          CURLOPT_HTTP_VERSION   => CURL_HTTP_VERSION_1_1,
          CURLOPT_POST           => 1,                    // i am sending post data 
          CURLOPT_POSTFIELDS     => json_encode($body),   // this are my post vars 
          CURLOPT_HTTPHEADER     => array(
                                "Content-Type: application/json",
                                ),
        ));

        $response = curl_exec($curl);
        $error = curl_error($curl);
        curl_close($curl);

        return json_decode($response, true);
    }


    public function makeAuth(){
        $seed = date('c');
        $nonce = mt_rand();
        $nonceBase64 = base64_encode($nonce);
        $tranKey = base64_encode(sha1($nonce . $seed . config('app.TRANKEY_CREDENTIAL'), true));

        $auth = array(
            'login' => config('app.LOGIN_CREDENTIAL'),
            'tranKey' => $tranKey,
            'nonce' => $nonceBase64,
            'seed' => $seed
        );

        return $auth;
    }


    function getRealIpAddr()
    {
        if (!empty($_SERVER['HTTP_CLIENT_IP']))   //check ip from share internet
        {
        $ip=$_SERVER['HTTP_CLIENT_IP'];
        }
        elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))   //to check ip is pass from proxy
        {
        $ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
        }
        else
        {
        $ip=$_SERVER['REMOTE_ADDR'];
        }
        return $ip;
    }
}
