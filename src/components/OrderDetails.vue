<style scoped>

input {
    border: 1px solid silver;
    border-radius: 4px;
    background: white;
    padding: 5px 10px;
    width: 300px;
}

.select, .control, select {
  min-width: 300px;
  float: right;
}

.panel {
  background: #eef;
  min-width: 400px;
}


</style>

<template>
<div class="ml-6 px-6 py-5 container panel is-info">
        <p class="is-4 title">Order</p>
        <div class="level pt-4">
            <div class="level-left">
                Order Date
            </div>
            <div class="level-right">
                <input @input="onChange" v-model="$v.order.orderDate.$model" v-bind:class="{error: $v.order.orderDate.$error, valid: !$v.order.orderDate.$dirty && !$v.order.orderDate.$invalid}" placeholder="YYYY-MM-DD" />
            </div>
        </div>
    <div class="level pt-4">
        <div class="level-left">

            Client Name
        </div>
        <div class="level-right">

            <b-select v-model="$v.order.clientName.$model" @input="onClientNameChange" :required="true" v-bind:class="{error: $v.order.clientName.$error, valid: !$v.order.clientName.$dirty && !$v.order.clientName.$invalid}" placeholder="Select Client Name">
                <option v-for="client in clients" :key="client.id" v-bind:value="client.id">
                    {{ client.name }}
                </option>
            </b-select>
        </div>
    </div>

    <div class="level pt-4">
        <div class="level-left">
          Contact Person
        </div>
        <div class="level-right">
          <b-select v-model="$v.order.contactPerson.$model" @input="onChange" v-if="clients.length > 0" v-bind:class="{error: $v.order.contactPerson.$error, valid: !$v.order.contactPerson.$dirty && !$v.order.contactPerson.$invalid}" placeholder="Select Contact Person">
              <option v-for="contact in contacts" :key="contact.id" v-bind:value="contact.id">
                  {{ contact.name }}
              </option>
          </b-select>
        </div>
    </div>

    <div class="pt-4 pb-4">
        <div v-if="errorsWhenSaving" class="level-left error-message">
          Validation errors prevent saving order.
        </div>
        <div class="level-right">
            <b-button v-if="!saved" v-on:click="submitOrder" class="is-pulled-right is-info">Save</b-button>
            <b-button v-if="saved" class="is-pulled-right is-info is-light">Saved</b-button>
        </div>
    </div>

</div>

</template>

<script>

import {
    required, minLength
}
from 'vuelidate/lib/validators'
import axios from 'axios'
import moment from 'moment'


export default {
    props: ['orderId'],
    data() {
            return {
                order: {
                  id: this.orderId,
                  orderDate: '',
                  clientName: null,
                  contactPerson: null
                },
                clients: [],
                contacts: [],
                saved: false,
                errorsWhenSaving: false
            }
        },
        created() {
            axios.get("/api/clients").then(({
                data
            }) => {
                this.clients = data;
            });

        },

        validations: {
          order: {
            orderDate: {
                required,
                isDate(value) {
                    return this.isDate(value)
                },
            },
            clientName: {
                required
            },
            contactPerson: {
              required
            }
          }
        },
        methods: {
                isDate(value) {
                    return moment(value, 'YYYY-MM-DD', true).isValid()
                },
                onClientNameChange() {
                    console.log(this.order.clientName);
                    axios.get("/api/clients/" + this.order.clientName + "/contacts/").then(({
                        data
                    }) => {
                        this.contacts = data;
                        console.log(this.contacts);
                    });
                    this.saved = false;
                    this.errorsWhenSaving = false;
                },
                onChange(){
                  this.saved = false;
                  this.errorsWhenSaving = false;
                },
                async submitOrder(){
                  if(!this.$v.order.$invalid && !this.$v.order.$error){
                    const response = await axios.post("/api/order/", this.order);
                    this.saved = true;
                    console.log("Orders submitted");
                    return true;
                  } else {
                    console.log("Here");
                    this.errorsWhenSaving = true;
                    return false;
                  }
                }
        }
}

</script>
