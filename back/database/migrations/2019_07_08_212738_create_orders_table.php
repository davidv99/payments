<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->increments('id');
            $table->string('customer_name', 80);
            $table->string('customer_surname', 80);
            $table->string('customer_email', 120);
            $table->string('customer_type_document', 4);
            $table->integer('customer_document', false, true)->length(40);
            $table->string('customer_mobile', 100);
            $table->string('product', 100);
            $table->string('description', 250);
            $table->float('total_order', 20);
            $table->float('iva_order', 20);
            $table->float('total_with_iva', 20);
            $table->string('currency', 20);
            $table->string('status', 20);
            $table->string('request_id', 60)->nullable();
            $table->string('request_url', 200)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
}
