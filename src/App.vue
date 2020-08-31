<style>

#app {
    font-family: 'Nunito Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
}

</style>

<template>

<div id="app">
    <div class="level">
        <div class="level-left">
            <img class="logo ml-6" src="./assets/logo.png" />
            <span class="ml-5 is-3 title">ORDERS</span>
        </div>
        <div class="level-right">
            <button v-if="finalizedOrder" class="mr-4 mt-2 button is-success is-rounded">Order Finalized</button>
            <span v-if="notEnoughItems" class="error-message mr-2">There must be at least one item to finalize order</span>
            <b-button type="submit" @click.prevent="finalizeOrder" class="is-primary mr-6 is-large">Finalize</b-button>
        </div>
    </div>
    <div class="pt-3 columns">
        <div class="column">
            <OrderDetails :orderId="orderId" ref="block1" />
        </div>
        <div class="column mr-1">
            <Sellers :orderId="orderId" ref="block2" />
        </div>
    </div>
    <div class="columns">
        <div class="column">
            <Items :orderId="orderId" ref="block3" />
        </div>
    </div>
</div>

</template>

<script>

import OrderDetails from './components/OrderDetails.vue'
import Items from './components/Items.vue'
import Sellers from './components/Sellers.vue'
export default {
    name: 'App',
    components: {
        OrderDetails,
        Items,
        Sellers
    },
    data() {
        return {
            orderId: null,
            notEnoughItems: false,
            finalizedOrder: false
        }
    },
    created() {
        this.orderId = this.uuidv4();
    },
    methods: {
        uuidv4() {
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            );
        },
        async finalizeOrder(){
          let that = this;
          if (this.$refs.block3.items.length > 0){ // there is at least one item to finalize order
            this.notEnoughItems = false;
            const response1 = await this.$refs.block1.submitOrder()
            if (response1){
              const response2 = await this.$refs.block2.submitSellers()
              if (response2){
                let i = 0;
                for await (let item of this.$refs.block3.items) {
                  let itemResponse = this.$refs.block3.submitItem(i)
                  if (itemResponse){
                    i++;
                  } else {
                    this.finalizedOrder = false;
                    return;
                  }
                }
                this.finalizedOrder = true;
              }
            }
          } else {
            this.notEnoughItems = true;
          }
        }
    }
}

</script>
