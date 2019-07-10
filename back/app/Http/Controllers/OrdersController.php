<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Order;
use App\Http\Controllers\WebServiceController;
use Validator;
use Config;
use DB;

class OrdersController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try 
        {
            $rows = $request->input('rows');
            $search = $request->input('search');

            $orders = Order::where('customer_name', 'like', '%'.$search.'%')
                            ->orWhere('customer_email', 'like', '%'.$search.'%')
                            ->orWhere('customer_mobile', 'like', '%'.$search.'%')
                            ->paginate($rows);

            $this->_response = $orders;
        } 
        catch (Exception $e) 
        {
            //Write error in log
            Log::error($e->getMessage() . ' line: ' . $e->getLine() . ' file: ' . $e->getFile());
            return response()->json([], self::STATUS_INTERNAL_SERVER_ERROR);
        }

        return response()->json($this->_response, self::STATUS_OK);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        
        $id = $request->input('id');

        $validator = Validator::make($request->all(), [
            'customer_name' => 'required|alpha|max:80',
            'customer_surname' => 'required|alpha|max:80',
            'customer_email' => 'required|email|max:120',
            'customer_type_document'=> 'required|max:4',
            'customer_mobile' => 'required|numeric',
            'customer_document'=> 'required|numeric',
            'total_order' => 'required|numeric',
            'iva_order' => 'required|numeric',
            'total_with_iva' => 'required|numeric',
            'currency'=> 'required|alpha',
            'product' => 'required',
            'description' => 'required',
        ]);

        if ($validator->fails()) 
        {
            $errors = $validator->errors();
            return response()->json(['success' => false, 'message' => $errors->all()]);
        }

        try 
        {
            DB::beginTransaction();

            $order = Order::find($id);
    
            if (null == $order)
            {
                $order = new Order;
            }

            $order->customer_name = $request->input('customer_name');
            $order->customer_surname = $request->input('customer_surname');
            $order->customer_type_document = $request->input('customer_type_document');
            $order->customer_document = $request->input('customer_document');
            $order->customer_mobile = $request->input('customer_mobile');
            $order->customer_email = $request->input('customer_email');
            $order->product = $request->input('product');
            $order->description = $request->input('description');
            
            $order->total_order = $request->input('total_order');
            $order->iva_order = $request->input('iva_order');
            $order->total_with_iva = $request->input('total_with_iva');
            $order->currency = $request->input('currency');
            $order->total_with_iva = $request->input('total_with_iva');
            $order->status = 'CREATED';
            $order->request_id = '';
            

            if (!$order->save())
            {
                DB::rollBack();
                return response()->json(['success'=> false, 'message' => trans('messages.error_on_save_order')], self::STATUS_INTERNAL_SERVER_ERROR);
            }

            //We need auth data to make request
            $auth =  (new WebServiceController)->makeAuth();
            $expiration = date('c');
            $expiration = date('c' , strtotime($expiration."+ 1 days"));
            $ip = (new WebServiceController)->getRealIpAddr();
            
            $requestBody = array(
                'auth'   => $auth,
                'locale' => 'en_CO',
                'buyer'  => array(
                    'name'=> $request->input('customer_name'),
                    'surname'=> $request->input('customer_surname'),
                    'email'=> $request->input('customer_email'),
                    'document'=> $request->input('customer_document'),
                    'documentType'=> $request->input('customer_type_document'),
                    'mobile'=> $request->input('customer_mobile')
                ), 
                'payment' => array(
                    'reference'   => $request->input('product'),
                    'description' => $request->input('description'),
                    'amount'      => array(
                        'currency' => 'COP',
                        'total'    => $request->input('total_with_iva'),
                    ),
                    'allowPartial'=> 'false'
                ),
                'expiration' => $expiration,
                'returnUrl'  => env('RETURN_URL').'/4ere31='.$order->id,
                'ipAddress'  => $ip,
                'userAgent'  => $_SERVER['HTTP_USER_AGENT']
            );
            
            $responseRequest = (new WebServiceController)->makeRequest('api/session/', $requestBody);

            if($responseRequest['status']['status'] == 'OK'){
                
                $order->request_id = $responseRequest['requestId'];
                $order->save();
                DB::commit();
                $message = $responseRequest['status']['message'];
                $url = $responseRequest['processUrl'];
                $this->_response = ['success' => true, 'message' => $message, 'url'=> $url];
            
            }else{
                DB::rollBack();
                return response()->json(['success' => false, 'message' => trans('messages.failed_create_request')]);
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

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try{
            $order = Order::find($id);
            $this->_response = $order;
        }catch(\Exception $e){
            \Log::error($e->getMessage(). 'Line: '.$e->getLine().' file: '.$e->getFile());
            return response()->json([$e->getMessage()], self::STATUS_INTERNAL_SERVER_ERROR);
        }
        return response()->json($this->_response, self::STATUS_OK);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
