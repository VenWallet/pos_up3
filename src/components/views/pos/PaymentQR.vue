<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import QRCode from 'qrcode'

import { useMountPosStore } from '@/store/use-mount-pos-store'

const props = defineProps<{
  network: string
  address: string
}>()

const qrcode = ref<HTMLCanvasElement | null>(null)
const copyIconAddress = ref('mdi-content-copy')
const copyIconMount = ref('mdi-content-copy')

const mountStore = useMountPosStore()

const generateQRCode = () => {
  if (qrcode.value) {
    const text = props.address
    QRCode.toCanvas(qrcode.value, text, (error: unknown) => {
      if (error) console.error(error)
    })
  }
}

const timeLeft = ref(600)
const timer = ref<number | undefined>()
const router = useRouter()

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const copyAddress = () => {
  navigator.clipboard.writeText(props.address)
  copyIconAddress.value = 'mdi-check'
  setTimeout(() => {
    copyIconAddress.value = 'mdi-content-copy'
  }, 1500)
}

const copyMount = () => {
  navigator.clipboard.writeText(mountStore.state.toString())
  copyIconMount.value = 'mdi-check'
  setTimeout(() => {
    copyIconMount.value = 'mdi-content-copy'
  }, 1500)
}

onMounted(() => {
  generateQRCode()

  timer.value = window.setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timer.value)
      router.push('/pos-dashboard')
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer.value) clearInterval(timer.value)
})
</script>

<template>
  <div class="payment-container">
    <div class="h2-div">
      <h2 style="text-align: start; width: 100%">pagar</h2>
    </div>

    <div class="timer-container">
      <div class="timer-message">
        <span>
          Tienes 10 minutos para ejecutar esta <br />
          transacción
        </span>
      </div>
      <img
        src="@/assets/img/up-down-arrow.svg"
        alt="Arrows"
        style="margin-top: -1px; margin-bottom: -2px"
      />

      <div class="timer">{{ formatTime(timeLeft) }}</div>
    </div>

    <div class="payment-container-qr">
      <div class="amount-container">
        <div class="amount">
          <div class="near-amount">{{ mountStore.state }} {{ props.network }}</div>
        </div>
      </div>

      <div class="qr-container">
        <canvas ref="qrcode"></canvas>
      </div>
    </div>

    <div class="flex flex-col items-center justify-center mt-4">
      <div class="border-[1px] border-dashed border-rose-600 px-6 py-2 rounded-[20px]">
        <span class="text-[12px] text-rose-600">
          El monto a depositar debe ser exactamente al solicitado
        </span>
      </div>
      <img src="@/assets/img/up-down-arrow.svg" alt="Arrows" style="margin-bottom: -2px" />
    </div>

    <div class="payment-details">
      <div class="detail-row">
        <span>Monto a pagar</span>
        <div class="value-container">
          <span>{{ mountStore.state }}</span>
          <v-icon @click="copyMount" style="cursor: pointer">
            {{ copyIconMount }}
          </v-icon>
        </div>
      </div>

      <div class="detail-row">
        <span>Token</span>
        <span class="token-value">{{ props.network }}</span>
      </div>

      <div class="detail-row">
        <span>Dirección del pago</span>
        <div class="value-container">
          <span class="address">{{ props.address.substring(0, 20) }}...</span>
          <v-icon @click="copyAddress" style="cursor: pointer">
            {{ copyIconAddress }}
          </v-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.payment-container-qr {
  position: relative;
  padding: 20px;
  display: flex;
  justify-content: end;
  width: 100%;
}

h2 {
  text-align: left;
  margin-bottom: 20px;
  font-size: 2.5em;
}

.timer-container {
  margin-top: 25px;
  display: flex;
  flex-direction: column;
  align-items: end;

  img {
    margin-right: 4.1rem;
  }
}

.timer-message {
  font-size: 10px;
  border-radius: 20px;
  text-align: right;

  border-radius: 13px;
  padding: 10px 15px;
  border: 1px solid #000;
}

.timer {
  max-width: 52px;
  background: black;
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 10px;
  margin-right: 3rem;
}

.amount-container {
  text-align: start;
  top: -10%;
  left: 5%;
  position: absolute;
  min-width: 147px;
  border: 1px dashed #000;
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 20px;
}

.amount {
  font-size: 24px;
}

.near-amount {
  font-size: 16px;
  font-weight: 700;
}

.qr-container {
  background-color: #fff;
  z-index: 10;
  max-width: 200px;
  border: 1px solid #000;
  padding: 5px;
  border-radius: 15px;
  margin-bottom: 20px;
  text-align: center;
}

.qr-container img {
  max-width: 200px;
  height: auto;
}

.payment-details {
  max-width: 380px;
  border: 1px solid #000;
  background: white;
  padding: 27px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row {
  background-color: #f6f5f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  font-size: 12px;
  border-radius: 13px;
  border: 1px solid #cbcbe2;
}

.detail-row:last-child {
  margin: 0;
}

.value-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.copy-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.token-value {
  font-size: 10px;
}

.address {
  font-size: 10px;
}
</style>
