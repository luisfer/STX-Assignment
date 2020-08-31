<style scoped>

input {
    border: 1px solid silver;
    border-radius: 4px;
    background: white;
    padding: 5px 10px;
    width: 300px;
}

.select,
.control,
select {
    min-width: 300px;
    float: right;
}

.panel {
    background: #ace;
}

input {
    width: 50px;
}

textarea {
  min-width: 250px;
  padding: 20px;
}

</style>

<template>

<div class="ml-6 mr-3 px-6 py-5 panel is-info">
    <p class="is-4 title">Items</p>
    <div v-for="(item, index) in items" :key="item.id" v-bind:value="item.id" class="panel pt-4 mr-3">
      <div class="columns">
        <div class="column is-3 ml-2">
            <span class="mr-2">Product Name</span>
            <b-select @input="onChange(index)" v-model="item.product.name" :required="true" placeholder="Select Product Name">
                <option v-for="product in products" :key="product.id" v-bind:value="product.id">
                    {{ product.name }}
                </option>
            </b-select>
        </div>
        <div class="column is-1">
            <span class="mr-2">Price</span>
            <input @input="onChange(index)" v-model="$v.items.$each[index].$model.price" v-bind:class="{error: $v.items.$each[index].price.$error || $v.items.$each[index].price.$invalid, valid: !$v.items.$each[index].price.$dirty && !$v.items.$each[index].price.$invalid}" placeholder="0.0" />
        </div>
        <div class="column is-1">
            <span class="mr-2">Amount</span>
            <input @input="onChange(index)" v-model="$v.items.$each[index].$model.amount" v-bind:class="{error: $v.items.$each[index].amount.$error || $v.items.$each[index].amount.$invalid, valid: !$v.items.$each[index].amount.$dirty && !$v.items.$each[index].amount.$invalid}" placeholder="0" />
        </div>
        <div v-if="item.deliveryType" class="column is-3">
            <span class="mr-2">Delivery Type</span>
            <b-select @input="onChange(index)" v-model="item.deliveryType.name" :required="true" placeholder="Select Delivery Type">
                <option v-for="deliveryType in deliveryTypes" :key="deliveryType.id" v-bind:value="deliveryType.id">
                    {{ deliveryType.name }}
                </option>
            </b-select>
        </div>
        <div v-if="item.comments !== undefined" class="column is-3">
            <span class="mr-2">Comments</span><br/>
            <textarea @input="onChange(index)" v-model="$v.items.$each[index].$model.comments" v-bind:class="{error: $v.items.$each[index].comments.$error || $v.items.$each[index].comments.$invalid, valid: !$v.items.$each[index].comments.$dirty && !$v.items.$each[index].comments.$invalid}" placeholder="Enter your comments here" />
        </div>
      </div>
      <div class="pt-4 pb-4 level">
          <div class="level-left">
            <p><span v-if="errorsWhenSaving" class="error-message ml-3">Validation Errors prevent Saving Item</span></p>
        </div>
          <div class="level-right is-pulled-right mr-2 pr-2">
              <b-button v-on:click="deleteItem(index)" class="is-pulled-right is-danger is-light mr-3">Delete</b-button>
              <b-button v-if="!isSaved(index)" v-on:click="submitItem(index)" class="is-pulled-right is-info">Save</b-button>
              <b-button v-if="isSaved(index)" class="is-pulled-right is-info is-light">Saved</b-button>
          </div>
      </div>
    </div>
    <div class="pt-4 pb-4 level">
        <div class="level-left">
          <b-button v-on:click="addItem(0)" class="mt-1 is-primary is-light">Add Generic</b-button>
          <b-button v-on:click="addItem(1)" class="ml-2 mt-1 is-warning is-light">Add Special</b-button>
        </div>
        <div class="level-right">
        </div>
    </div>

</div>

</template>

<script>

import {
    required, numeric, maxLength
}
from 'vuelidate/lib/validators'
import axios from 'axios'
import moment from 'moment'


export default {
    props: ['orderId'],
    data() {
            return {
                products: [],
                deliveryTypes: [],
                saved: false,
                errorsWhenSaving: false,
                items: []
            }
        },
        created() {
            axios.get("/api/products").then(({
                data
            }) => {
                this.products = data;
            });
            axios.get("/api/delivery-type").then(({
                data
            }) => {
                this.deliveryTypes = data;
            });

        },
        validations() {
            return {
                items: {
                    $each: {
                        product: {
                            required
                        },
                        price: {
                            required,
                            isFloat(value) {
                                if (Number.isNaN(parseFloat(value))) {
                                    return false;
                                }
                                return true;
                            },
                            isPositive(value){
                              return this.isPositive(value);
                            }
                        },
                        amount: {
                          required,
                          isInteger(value) {
                              if (Number.isNaN(parseInt(value))) {
                                  return false;
                              }
                              return true;
                          },
                          isPositive(value){
                            return this.isPositive(value);
                          }
                        },
                        comments: {
                          maxLength: maxLength(250)
                        }
                    }
                }
            }
        },
        methods: {
            isSaved(index){
              return this.items[index].saved
            },
            isPositive(value){
              return parseInt(value) >= 0
            },
            addItem(type) {
                let itemType = '';
                if(type>0){
                  itemType = "Special";
                } else {
                  itemType = "Generic";
                }

                let itemObj = {
                    "product": this.products[0].id,
                    "price": 0.00,
                    "amount": 0,
                    "type": itemType,
                    "id": this.items.length + 1,
                    "saved": false
                };
                if (type>0){
                  itemObj = {
                    ...itemObj,
                    "deliveryType": this.deliveryTypes[0].id,
                    "comments": ""
                  }
                }
                this.items.push(itemObj);
            },
            async deleteItem(index){

              const response = await axios.delete("/api/order/" + this.orderId + "/item/" + this.items[index].id, this.items[index])
              if (response){
                this.items.splice(index,1);
              }
            },
            onChange(index){
              this.items[index].saved = false;
              this.errorsWhenSaving = false;
            },
            async submitItem(index){
              if (!this.$v.items.$each[index].$invalid &&  !this.$v.items.$each[index].$error) {
                const response = await axios.put("/api/order/" + this.orderId + "/item/" + this.items[index].id, this.items[index])
                if (response){
                  console.log("Submitted item " + index)
                  this.items[index].saved = true;
                  return true;
                }
              } else {
                this.errorsWhenSaving = true;
                return false;
              }
            }
        }
}

</script>
