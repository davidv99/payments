<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Products;
use App\Library\General;
use App\User;
use Validator;
use Config;
use DB;

class ProductsController extends Controller
{   
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['index', 'show']]);
    }

    /**
     * @api {get} /products?rows=10&search List of products
     * @apiName Products index
     * @apiGroup Products
     * @apiVersion 0.0.1
     * @apiHeader {String} authorization Authorization value.
     * 
     * @apiParam {int} rows Rows number to list
     * @apiParam {string} search Word to search in products list
     * 
     * @apiSuccessExample Success-Response:
     *  HTTP/1.1 200 ok
     * {
     *       "current_page": 1,
     *       "data": [
     *           {
     *               "id": 1,
     *               "category_id": 1,
     *               "user_id": 1,
     *               "title": "Producto",
     *               "description": "0",
     *               "principal_image": "imagen",
     *               "status": 0,
     *               "value": 12.32,
     *               "created_at": "2018-10-26 23:47:09",
     *               "updated_at": "2018-10-26 23:47:09"
     *           }
     *       ],
     *       "first_page_url": "http://www.gracias.local/api/v1/products?page=1",
     *       "from": 1,
     *       "last_page": 1,
     *       "last_page_url": "http://www.gracias.local/api/v1/products?page=1",
     *       "next_page_url": null,
     *       "path": "http://www.gracias.local/api/v1/products",
     *       "per_page": "10",
     *       "prev_page_url": null,
     *       "to": 1,
     *       "total": 1
     *   } 
     */
    public function index(Request $request)
    {
        try 
        {
            $rows = $request->input('rows');
            $search = $request->input('search');

            $products = Products::where('title', 'like', '%'.$search.'%')
                            ->orWhere('description', 'like', '%'.$search.'%')
                            ->paginate($rows);
            foreach ($products as $value) {
              $value->principal_image = env('API_URL').env('DONATIONS_FOLDER').$value->principal_image;
              $data_usuario = User::find($value->user_id);

              $value->user_image =  env('API_URL').env('USERS_FOLDER').$data_usuario->image;

            }
            $this->_response = $products;
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
     * @api {get} /products create or update some product
     * @apiName Products store
     * @apiGroup Products
     * @apiVersion 0.0.1
     * @apiHeader {String} authorization Authorization value.
     * 
     * @apiParam {int} id  You can send 0 if you want to create a new product, or you can send id=? if you want to update
     * @apiParam {int} category_id Category id of product
     * @apiParam {int} user_id Id of user
     * @apiParam {string} title Title or name of product
     * @apiParam {string} description Text decription of product
     * @apiParam {double} value Product value
     * @apiParam {int} status status of product, 1 is active, 0 is inactive
     * 
     * 
     * @apiSuccessExample Success-Response:
     *  HTTP/1.1 200 ok
     * {
     *      "success": true,
     *      "message": "Product created"
     * } 
     * 
     */
    public function store(Request $request)
    {
        $id = $request->input('id');

        $validator = Validator::make($request->all(), [
            'category_id' => 'required|integer',
            'user_id' => 'required|integer',
            'title' => 'required',
            'description' => 'required|max:255|',
            'value' => 'required',
            'status' => 'required|integer'
        ]);
        
        if ($validator->fails()) 
        {
            $errors = $validator->errors();

            return response()->json(['success' => false, 'message' => $errors->all()]);
        }

        try 
        {
            $product = Products::find($id);
            $message = trans('messages.updated_product');
            if(null == $product)
            {
                $product = new Products;
                $message = trans('messages.created_product');
            }

            $product->category_id = $request->input('category_id');
            $product->user_id = $request->input('user_id');
            $product->title = $request->input('title');
            $product->description = $request->input('description');
            $product->value = $request->input('value');
            $product->status = $request->input('status');

        
            if (\Request::hasFile('principal_image')) {
                $imageFile = \Request::file('principal_image');
                $settings = Config::get('filesconfig.donations');
                $fileExtension = strtolower($imageFile->getClientOriginalExtension());
                $imageName = General::fileName($fileExtension);
                $path = $settings['images'] . $imageName;
                \Storage::disk('local')->put($path, \File::get($imageFile));
                $product->principal_image = $imageName;
            } 
            

            if(false === $product->save())
            {
                return response()->json([], self::STATUS_INTERNAL_SERVER_ERROR);
            }

            $this->_response = ['success' => true, 'message' => $message];
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
     * @api {get} /products/{id} Show some product by id
     * @apiName Products show
     * @apiGroup Products
     * @apiVersion 0.0.1
     * @apiHeader {String} authorization Authorization value.
     * 
     * @apiParam {int} id  Product id
     *
     * @apiSuccessExample Success-Response:
     *  HTTP/1.1 200 ok
     * {
     *      "id": 1,
     *       "category_id": 1,
     *       "user_id": 1,
     *       "title": "Producto",
     *       "description": "0",
     *       "principal_image": "imagen",
     *       "status": 0,
     *       "value": 12.32,
     *       "created_at": "2018-10-26 23:47:09",
     *       "updated_at": "2018-10-26 23:47:09"     
     * } 
     */
    public function show($id)
    {
        try{
            $product = Products::find($id);
            $this->_response = $product;
        }catch(\Exception $e){
            \Log::error($e->getMessage(). 'Line: '.$e->getLine().' file: '.$e->getFile());
            return response()->json([$e->getMessage()], self::STATUS_INTERNAL_SERVER_ERROR);
        }
        return response()->json($this->_response, self::STATUS_OK);
    }

    public function donationsUser($id){
        try{
            $product = Products::where('user_id',$id)->get();
            foreach ($product as $value) {
              $value->principal_image = env('API_URL').env('DONATIONS_FOLDER').$value->principal_image;
            }
            $this->_response = $product;
        }catch(\Exception $e){
            \Log::error($e->getMessage(). 'Line: '.$e->getLine().' file: '.$e->getFile());
            return response()->json([$e->getMessage()], self::STATUS_INTERNAL_SERVER_ERROR);
        }
        return response()->json($this->_response, self::STATUS_OK);
    }



    /**
     * @api {get} /products/{id} Delete some product by id
     * @apiName Products Delete
     * @apiGroup Products
     * @apiVersion 0.0.1
     * @apiHeader {String} authorization Authorization value.
     * 
     * 
     * @apiParam {int} id  Product id
     *
     * @apiSuccessExample Success-Response:
     * 
     *  HTTP/1.1 200 ok
     * {
     *      "success": true,
     *      "message": "Product deleted"
     * } 
     */
    public function destroy($id)
    {
        try{
            $product = Products::find($id);

            if(!$product->delete()){
                return response()->json([$e->getMessage()], self::STATUS_INTERNAL_SERVER_ERROR);
            }
            $this->_response = ['success' => true, 'message' => trans('messages.deleted_product')];
        }catch(\Exception $e){
            \Log::error($e->getMessage(). 'Line: '.$e->getLine().' file: '.$e->getFile());
            return response()->json([$e->getMessage()], self::STATUS_INTERNAL_SERVER_ERROR);
        }
        return response()->json($this->_response, self::STATUS_OK);
    }
}
