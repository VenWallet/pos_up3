<!-- eslint-disable prefer-const -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  tokenName: String,
  tokenId: String,
})

const emit = defineEmits([
  'updateNetworkName',
  'updateTokenName',
  'updateTokenId',
  'nextScreen',
  'minMount',
])

const selectedNetwork = ref<string | null>(null)
const selectedToken = ref<string | null>(null)
const loading = ref<boolean>(false)

const tokensDataString = localStorage.getItem('tokensData')
let networks: string[] = []
let networkTokensData: string[] = []

if (tokensDataString) {
  const tokensData = JSON.parse(tokensDataString) as any

  const filteredTokensData = tokensData
    .filter((n: { index: string }) => ['near', 'arbitrum', 'solana', 'tron'].includes(n.index))
    .map((n: { tokens: any[] }) => {
      let allowedSymbols: string | any[] = []

      n.tokens = n.tokens.filter((t) => allowedSymbols.includes(t.tokenData.symbol.toLowerCase()))
      return n
    })

  networks = filteredTokensData.map((token: { index: any }) => token.index)
}

function onNetworkSelected() {
  if (tokensDataString) {
    const tokensData = JSON.parse(tokensDataString) as any

    let allowedSymbols: string | any[] = []
    if (selectedNetwork.value === 'near') allowedSymbols = ['usdt', 'usdc', 'wbtc', 'weth']
    if (selectedNetwork.value === 'arbitrum') allowedSymbols = ['usdt', 'usdc']
    if (selectedNetwork.value === 'solana') allowedSymbols = ['usdt', 'usdc']
    if (selectedNetwork.value === 'tron') allowedSymbols = ['usdt']

    const filter = tokensData
      .find((token: { index: string | null }) => token.index === selectedNetwork.value)
      .tokens.filter((t: { tokenData: { symbol: string } }) =>
        allowedSymbols.includes(t.tokenData.symbol.toLowerCase()),
      )

    networkTokensData = filter.map(
      (token: { tokenData: { symbol: any } }) => token.tokenData.symbol,
    )
  }

  emit('updateNetworkName', selectedNetwork.value)
}

async function onTokenSelected() {
  if (tokensDataString) {
    const tokensData = JSON.parse(tokensDataString) as any

    const filter = tokensData.find(
      (token: { index: string | null }) => token.index === selectedNetwork.value,
    ).tokens

    const tokenData = filter.find(
      (token: { tokenData: { symbol: string | null } }) =>
        token.tokenData.symbol === selectedToken.value,
    )

    emit('updateTokenName', tokenData.tokenData.symbol)
    emit('updateTokenId', tokenData.id)

    // const { data: response } = await axiosInstance.post(
    //   '/pos/payment-request/amount-min-max',
    //   {
    //     network: selectedNetwork.value,
    //     token: tokenData.id,
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    //     },
    //   },
    // )
    // console.log(response)

    // minMount.value = response.data.withdrawMin
    emit('minMount', 11)
  }
}

function continueNextScreen() {
  if (!selectedNetwork.value || !selectedToken.value) return

  emit('nextScreen')
}
</script>

<template>
  <div class="max-w-[330px] mx-auto">
    <h2>Solicitud de <strong>pago</strong></h2>

    <div
      class="border-[1px] border-solid border-black rounded-[20px] px-[26px] py-[16px] text-left text-[9px] leading-none mt-8"
    >
      Elija la Blockchain y el token que el cliente está usando para realizar el pago.
    </div>
    <div
      class="relative border-[1px] border-solid border-black rounded-[20px] px-[26px] pt-[25px] pb-[38px] flex flex-col gap-[16px]"
    >
      <div
        class="border-[1px] border-solid border-black py-[8px] px-[18px] flex justify-between items-center rounded-[13px]"
      >
        <span class="text-[12px]">Seleccionar blockchain</span>
        <div class="inline-flex items-center">
          <v-select
            v-model="selectedNetwork"
            :items="networks"
            variant="solo"
            flat
            menu-icon="mdi-menu-right"
            hide-details
            class="select-field"
            @update:modelValue="onNetworkSelected()"
          ></v-select>
        </div>
      </div>
      <div
        class="border-[1px] border-solid border-black py-[8px] px-[18px] flex justify-between items-center rounded-[13px]"
      >
        <span class="text-[12px]">Seleccionar token</span>

        <div class="inline-flex items-center">
          <v-select
            v-model="selectedToken"
            :items="networkTokensData"
            variant="solo"
            flat
            menu-icon="mdi-menu-right"
            hide-details
            class="select-field"
            @update:modelValue="onTokenSelected()"
          ></v-select>
        </div>
      </div>
      <div class="absolute left-0 right-0 bottom-[-20px] w-full flex justify-center">
        <v-btn
          flat
          @click="continueNextScreen()"
          :loading="loading"
          class="!w-[161px] !min-h-[39px] !bg-[#662483] !text-white !normal-case !tracking-normal !font-normal !rounded-[10px]"
        >
          Continuar
        </v-btn>
      </div>
    </div>

    <div class="flex justify-center">
      <!-- <div
        v-if="minMount"
        class="border-[1px] border-black border-solid rounded-[13px] py-4 px-8 flex gap-8 mt-16"
      >
        <div class="flex gap-2">
          <div class="text-[12px]">Monto mínimo:</div>
          <div class="text-[12px] font-bold">{{ minMount }} {{ selectedToken }}</div>
        </div>
      </div> -->
    </div>
  </div>
</template>
