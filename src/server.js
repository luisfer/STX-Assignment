import { Server, Response } from 'miragejs'
import clients from './data/clients'
import contacts from './data/contacts'
import deliveryTypes from './data/deliveryTypes'
import products from './data/products'
import sellers from './data/sellers'

export function makeServer({ environment = 'development' } = {}) {

  let server = new Server({
    environment,

    routes() {

      this.namespace = 'api'

      this.get('/clients', schema => {
        return new Response(200, {}, clients)
      })

      this.get('/clients/:clientId/contacts', (schema, request) => {

        let response = contacts.filter(elem => {
          console.log(elem.clientId, request.params.clientId)
          return elem.clientId === parseInt(request.params.clientId)
        })
        console.log(response)

        return new Response(200, {}, response)
      })
      this.get('/delivery-type', schema => {
        return new Response(200, {}, deliveryTypes)
      })
      this.get('/products', schema => {
        return new Response(200, {}, products)
      })
      this.get('/sellers', schema => {
        return new Response(200, {}, sellers)
      })

      this.post('/order', (schema, request) => {
        const headers = {}
        const order = JSON.parse(request.requestBody)
        return new Response(
          200,
          headers,
          { success: true, id: order.id}
        )
      }, { timing: 2000 })

      this.put('/order/:id', (schema, request) => {
        const headers = {}
        const order = JSON.parse(request.requestBody)
        return new Response(
          200,
          headers,
          { success: true, id: order.id}
        )
      }, { timing: 2000 })

      this.put('/order/:id/finalize', (schema, request) => {
        const headers = {}
        const order = JSON.parse(request.requestBody)
        return new Response(
          200,
          headers,
          { success: true, id: order.id}
        )
      }, { timing: 2000 })

      this.put('/order/:id/seller', (schema, request) => {
        const headers = {}
        const order = JSON.parse(request.requestBody)
        return new Response(
          200,
          headers,
          { success: true, id: order.id}
        )
      }, { timing: 2000 })

      this.post('/order/:id/item', (schema, request) => {
        const headers = {}
        const order = JSON.parse(request.requestBody)
        return new Response(
          200,
          headers,
          { success: true, id: order.id}
        )
      }, { timing: 2000 })

      this.put('/order/:id/item/:itemId', (schema, request) => {
        const headers = {}
        const order = JSON.parse(request.requestBody)
        return new Response(
          200,
          headers,
          { success: true, id: order.id}
        )
      }, { timing: 2000 })

      this.delete('/order/:id/item/:itemId', schema => {
        return new Response(
          200,
          {},
          { success: true}
        )
      }, { timing: 2000 })
    },
  })

  return server
}
