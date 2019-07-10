<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\WebServiceController;
use Validator;
use Config;
use DB;

class PaymentsController extends Controller
{
    public function checkPaymentStatus(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'request_id' => 'required|',
        ]);

        if ($validator->fails()) 
        {
            $errors = $validator->errors();
            return response()->json(['success' => false, 'message' => $errors->all()]);
        }

        try 
        {
            $auth =  (new WebServiceController)->makeAuth();
            $requestBody = array(
                'auth'=>$auth
            );
            
            $path = 'api/session/'.$request->input('request_id');
            $responseRequest = (new WebServiceController)->makeRequest($path, $requestBody);
            
            if ($responseRequest['status']['status'] == 'PENDING')
            {
                $this->_response = ['success' => true, 'trans_status' => 'PENDING' ,'message' => trans('messages.transactions_payment_pending'), 'sumary_transaction' => null];
            }

            if ($responseRequest['status']['status'] == 'EXPIRED')
            {
                $this->_response = ['success' => true, 'trans_status' => 'EXPIRED' ,'message' => trans('messages.transactions_payment_expired'),'sumary_transaction' => null];
            }

             if ($responseRequest['status']['status'] == 'SUCCESS')
            {
                $sumary_transaction = $responseRequest;
                $this->_response = ['success' => true, 'trans_status' => 'SUCCESS' ,'message' => trans('messages.transactions_payment_success'), 'sumary_transaction' => $sumary_transaction];
            }


        }
        catch (Exception $e) 
        {
            //Write error in log
            Log::error($e->getMessage() . ' line: ' . $e->getLine() . ' file: ' . $e->getFile());
            return response()->json([], self::STATUS_INTERNAL_SERVER_ERROR);
        }

        return response()->json($this->_response, self::STATUS_OK);
    }
}
