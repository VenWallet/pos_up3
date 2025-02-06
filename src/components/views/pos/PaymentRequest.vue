<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useMountPosStore } from '@/store/use-mount-pos-store'
import axiosInstance from '@/plugins/axios'

const props = defineProps({
  network: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  tokenName: {
    type: String,
    required: true,
  },
  minMount: {
    type: Number,
    required: true,
  },
})
const emit = defineEmits(['preview', 'nextScreen', 'orderId', 'updateAddress'])

const amount = ref('0')
const inputValue = ref('')
const note = ref('')
const tokenPrice = ref<number | null>(null)
const loading = ref(false)
const red = ref(false)

const mountStore = useMountPosStore()

const appendNumber = (num: string) => {
  red.value = false
  if (inputValue.value.length < 10) {
    inputValue.value += num
  }
}

const deleteNumber = () => {
  inputValue.value = inputValue.value.slice(0, -1)
}

const convertedToken = computed(() => {
  if (!tokenPrice.value || !inputValue.value) return '0.00'
  return (parseFloat(inputValue.value) / tokenPrice.value).toFixed(2)
})

const pay = async () => {
  if (
    parseFloat(inputValue.value) < props.minMount ||
    parseFloat(convertedToken.value) < props.minMount
  ) {
    red.value = true
    return
  }

  loading.value = true
  try {
    const { data: response } = await axiosInstance.post('/pos/payment-request', {
      userId: localStorage.getItem('userId'),
      network: props.network,
      token: props.token,
      amount: props.tokenName === 'USDT' ? Number(inputValue.value) : Number(convertedToken.value),
      note: note.value || '',
    })

    mountStore.set(response.data.amount)
    emit('updateAddress', response.data.paymentAddress)
    emit('orderId', response.data.id)

    emit('nextScreen')
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
    inputValue.value = ''
    note.value = ''
  }
}

onMounted(async () => {
  try {
    if (props.tokenName === 'near') {
      const response = await axios.get(
        'https://api.binance.com/api/v3/ticker/price?symbol=NEARUSDT',
      )
      tokenPrice.value = parseFloat(response.data.price)
    } else if (props.tokenName === 'USDT') {
      return
    } else if (props.tokenName === 'bitcoin') {
      const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
      tokenPrice.value = parseFloat(response.data.price)
    } else if (props.tokenName === 'tron') {
      const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=TRXUSDT')
      tokenPrice.value = parseFloat(response.data.price)
    } else {
      const response = await axios.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=${props.tokenName}USDT`,
      )
      tokenPrice.value = parseFloat(response.data.price)
    }
  } catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <div class="payment-container">
    <div class="h2-div">
      <h2 style="text-align: start; width: 100%">Solicitud de <br /><b>pago</b></h2>
    </div>

    <div class="flex justify-center">
      <div
        class="border-[1px] border-dashed border-black/50 rounded-[20px] px-6 py-2 text-[9px]"
        :class="{
          'text-red-500': red,
        }"
      >
        Monto mínimo {{ props.minMount }} {{ props.tokenName }}
      </div>
    </div>
    <div class="amount-display">
      <img src="@/assets/img/subtract.svg" alt="" />
      <div class="amount-badge">
        <span class="currency">
          <img src="@/assets/img/arrow-right-left.svg" alt="" />
          ${{ inputValue || amount }}
        </span>
      </div>
      <div v-if="props.tokenName !== 'USDT'" class="near-badge">
        <img src="@/assets/img/edit.svg" alt="" />
        = {{ convertedToken }} {{ props.tokenName }}
      </div>
      <div v-else class="near-badge">
        <img src="@/assets/img/edit.svg" alt="" />
        = {{ inputValue }} {{ props.tokenName }}
      </div>
    </div>

    <div class="numpad-container">
      <div class="numpad">
        <button v-for="n in 9" :key="n" @click="appendNumber(n.toString())">
          {{ n }}
        </button>
        <button @click="appendNumber('.')" class="dot">•</button>
        <button @click="appendNumber('0')">0</button>
        <button @click="deleteNumber">✕</button>
      </div>
    </div>

    <div class="note-input">
      <input type="text" v-model="note" placeholder="Añadir nota (opcional)" />
    </div>

    <div class="action-buttons">
      <v-btn flat style="min-height: 40px" class="cancel-btn" @click="$emit('preview')">
        Cancelar
      </v-btn>
      <v-btn :loading="loading" flat style="min-height: 40px" class="pay-btn" @click="pay">
        Pagar
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.payment-container {
  width: 100%;
}

.header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
}

h2 {
  font-size: 24px;
  margin: 0;
  text-align: start;
}

.amount-display {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 80px;
  margin-bottom: -1px;
}

.amount-badge {
  position: absolute;
  left: 25%;
  top: -75%;
  border-radius: 13px;
  font-size: 24px;
  font-weight: 700;
  border: 1px solid #000;
  padding: 6px 6px;
  background-color: #fff;
}

.amount-badge > span {
  border: 1px dashed #000;
  padding: 10px 18px;
  border-radius: 13px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.near-badge {
  background-color: #fff;
  position: absolute;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 14px;
  right: 0;
  top: -45%;

  font-size: 12px;

  border: 1px solid #000;
  padding: 10px 16px;
}

.numpad-container {
  display: flex;
  justify-content: center;
}

.numpad {
  width: 330px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
  border: 1px solid #000;
  border-radius: 20px;
  padding: 16px;
}

.numpad button {
  background: none;
  border: none;
  font-size: 20px;
  padding: 15px;
  cursor: pointer;
  border-radius: 8px;
  font-weight: 700;
}

.numpad button:hover {
  background: #f5f5f5;
}

.note-input {
  margin-top: -31px;
  margin-bottom: 30px;
  border: 1px dashed #000;
  border-radius: 20px;
  padding: 20px 26px 19px;
}

.note-input input {
  width: 100%;
  padding: 12px;
  border-radius: 13px;
  font-size: 16px;
  border: 1px solid #000;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.action-buttons button {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.cancel-btn {
  background: white;
  border: 1px solid #000;
  border-radius: 13px;
  letter-spacing: 0em;
  text-transform: none;
  font-weight: 400;
}

.pay-btn {
  background: #662483;
  color: #fff;
  border-radius: 13px;
  letter-spacing: 0em;
  text-transform: none;
  font-weight: 400;
}
</style>
