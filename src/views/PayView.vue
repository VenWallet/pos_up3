<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Socket, io } from 'socket.io-client'

import PaymentRequestTokens from '@/components/views/pos/PaymentRequestTokens.vue'
import PaymentRequest from '@/components/views/pos/PaymentRequest.vue'
import PaymentQR from '@/components/views/pos/PaymentQR.vue'
import TransactionInProgress from '@/components/views/pos/TransactionInProgress.vue'
import TransactionCompleted from '@/components/views/pos/TransactionCompleted.vue'

let socket: Socket

onMounted(() => {
  socket = io(import.meta.env.VITE_WEB_SOCKET)

  socket.on('payment-request:pay-status', (data) => {
    mount.value = data.amount

    if (data.status === 'Procesando') {
      stepDeposito.value = 4
    }

    if (data.status === 'Completado') {
      stepDeposito.value = 5
    }
  })
})

onBeforeUnmount(() => {
  if (socket) {
    socket.disconnect()
  }

  if (localStorage.getItem('masterUserId') === null) {
    router.push('/')
  }
})

const stepDeposito = ref(1)
const networkName = ref()
const tokenName = ref()
const tokenId = ref()
const mount = ref()
const orderId = ref()
const address = ref('')
const mountMin = ref(0)

const router = useRouter()

function updateTokenName(newTokenName: string) {
  tokenName.value = newTokenName
}

function updateNetworkName(newNetworkName: string) {
  networkName.value = newNetworkName
}

function updateTokenId(newTokenId: string) {
  tokenId.value = newTokenId
}

function updateMount(newMount: string) {
  mount.value = newMount
}

function updateOrderId(newOrderId: string) {
  orderId.value = newOrderId
}

function updateAddress(newAddress: string) {
  address.value = newAddress
}

function payStatus() {
  socket.emit('payment-request:pay', JSON.stringify({ paymentRequestId: orderId.value }))

  stepDeposito.value = 3
}

const navigationMethods = () => {
  if (stepDeposito.value === 1) {
    router.go(-1)
  } else if (stepDeposito.value === 2) {
    stepDeposito.value = 1
  } else if (stepDeposito.value === 3) {
    stepDeposito.value = 2
  } else if (stepDeposito.value === 4) {
    stepDeposito.value = 3
  }
}
</script>

<template>
  <div id="pos">
    <div v-if="stepDeposito !== 2" class="adviser-right">
      <v-btn class="btn-arrow" @click="navigationMethods()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <img class="img-arrow-2" src="@/assets/img/left-triangle-no-right.svg" alt="Img" />
    </div>

    <v-window v-model="stepDeposito" disabled>
      <v-window-item :value="1">
        <PaymentRequestTokens
          :tokenName="tokenName"
          :tokenId="tokenId"
          @updateNetworkName="updateNetworkName"
          @updateTokenName="updateTokenName"
          @updateTokenId="updateTokenId"
          @next-screen="stepDeposito = 2"
          @min-mount="mountMin = $event"
        />
      </v-window-item>

      <v-window-item :value="2">
        <PaymentRequest
          :tokenName="tokenName"
          :network="networkName"
          :token="tokenId"
          :minMount="mountMin"
          @updateMount="updateMount"
          @preview="stepDeposito = 1"
          @next-screen="payStatus"
          @order-id="updateOrderId"
          @updateAddress="updateAddress"
        />
      </v-window-item>

      <v-window-item :value="3">
        <PaymentQR :network="tokenName" :mount="mount" :address="address" />
      </v-window-item>

      <v-window-item :value="4">
        <TransactionInProgress />
      </v-window-item>

      <v-window-item :value="5">
        <TransactionCompleted />
      </v-window-item>
    </v-window>
  </div>
</template>

<style lang="scss">
#pos {
  .v-window-item {
    padding: 16px 20px 32px 16px;
    position: relative;
    display: grid;
    place-items: center;
    margin-bottom: 20px;
    width: 375px;
    margin: 0 auto;
  }

  .adviser-right {
    position: absolute;
    right: 0px;
    top: 16px;
    display: flex;
    z-index: 99;

    .text-div {
      background-color: #ffffff;
      border: 2px solid #000000;
      border-radius: 13px;
      width: 150px;
      height: 40px;
      display: grid;
      place-items: center;
      span {
        font-weight: 400;
        font-size: 14px;
      }
    }

    .img-wallet-div {
      background-color: #000;
      border-radius: 13px;
      width: 40px;
      height: 40px;
      display: grid;
      place-items: center;
      position: relative;
      left: -1px;
    }

    .img-arrow {
      position: relative;
      left: -2px;
    }

    .img-arrow-2 {
      position: relative;
      left: none;
      margin-left: 15px;
    }

    .btn-arrow {
      border: 1px solid #000000;
      border-radius: 50%;
      width: 38px;
      height: 38px;
      min-height: 38px;
      min-width: 38px;
    }
  }

  .h2-div {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    align-items: center;
    min-width: 380px;

    @media (max-width: 500px) {
      min-width: 100%;
    }
  }
  h2 {
    margin-top: 64px;
    text-align: left;
    font-size: 45px;
    margin-bottom: 6px;
    line-height: 54px;
  }
}
</style>
