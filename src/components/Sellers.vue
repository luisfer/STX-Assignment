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
    background: #ffe;
    min-height: 400px;
}

input {
    width: 50px;
}

</style>

<template>

<div class="ml-4 mr-3 px-6 py-5 container panel is-info">
    <p class="is-4 title">Sellers</p>
    <div v-for="(localSeller, index) in localSellers" :key="localSeller.id" v-bind:value="localSeller.id" class="level pt-4 mr-3">
        <div class="level-left">
            <span class="mr-2">Seller Name</span>
            <b-select @input="onChange" v-model="localSellers.name" :required="true" placeholder="Select Seller Name">
                <option v-for="seller in sellers" :key="seller.id" v-bind:value="seller.id">
                    {{ seller.name }}
                </option>
            </b-select>
        </div>
        <div class="level-right">
            <span class="mr-2">Bonus Percentage</span>
            <input @input="onChange" v-model="$v.localSellers.$each[index].$model.bonus" v-bind:class="{error: $v.localSellers.$each[index].bonus.$error || $v.localSellers.$each[index].bonus.$invalid, valid: !$v.localSellers.$each[index].bonus.$dirty && !$v.localSellers.$each[index].bonus.$invalid}"
            placeholder="0.0" />
        </div>
    </div>
    <div class="pt-4 pb-4 level">
        <div class="level-left">
            <p><span v-if="errorsWhenSaving" class="error-message">Bonus Sum of Sellers needs to be 100%</span></p>
        </div>
    </div>
    <div class="pt-4 pb-4 level">
        <div class="level-left">
            <b-button v-on:click="addSeller" class="mt-1 is-primary is-light">Add seller</b-button>
        </div>
        <div class="level-right">
            <b-button v-if="!saved" v-on:click="submitSellers" class="is-pulled-right is-info">Save</b-button>
            <b-button v-if="saved" class="is-pulled-right is-info is-light">Saved</b-button>
        </div>
    </div>

</div>

</template>

<script>

import {
    required, between
}
from 'vuelidate/lib/validators'
import axios from 'axios'


export default {
    props: ['orderId'],
    data() {
        return {
            sellerName: null,
            contactPerson: null,
            sellers: [],
            contacts: [],
            saved: false,
            errorsWhenSaving: false,
            localSellers: []
        }
    },
    created() {
        axios.get("/api/sellers").then(({
            data
        }) => {
            this.sellers = data;
        });

    },
    validations() {
        return {
            localSellers: {
                $each: {
                    name: {
                        required
                    },
                    bonus: {
                        required,
                        between: between(0, 100),
                            isFloat(value) {
                                console.log(parseFloat(value))
                                if (Number.isNaN(parseFloat(value))) {
                                    return false;
                                }
                                return true;
                            }
                    }
                }
            }
        }
    },
    methods: {
            addSeller() {
                this.saved = false;
                let localSellerObj = {
                    ...this.sellers[0],
                        "bonus": 0.0,
                        id: this.localSellers.length + 1
                };
                this.localSellers.push(localSellerObj);
            },
            onChange() {
                this.saved = false;
                this.errorsWhenSaving = false;
            },
            async submitSellers() {
                let totalBonus = 0;
                this.localSellers.map(elem => {
                    totalBonus += parseFloat(elem.bonus)
                })
                if (parseFloat(totalBonus) !== 100 && this.localSellers.length > 0) {
                    this.errorsWhenSaving = true;
                    return false;
                } else {
                    if (!this.$v.localSellers.$error) {
                        this.errorsWhenSaving = false;
                        let order = {...this.localSellers, id: this.orderId};
                        const response = await axios.put("/api/order/" + this.orderId + "/seller", order);
                        if (response){
                          this.saved = true;
                          console.log("Sellers submitted");
                          return true;
                        }
                    } else {
                      return false;
                    }
                }
            }
    }
}

</script>
