<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import axiosInstance from '@/plugins/axios'

interface PaymentRequest {
  id: number
  amount: string
  createdAt: string
  note: string
  status: string
}

const userId = localStorage.getItem('userId') || ''
const loading = ref(false)
const title = ref<string>(localStorage.getItem('title') || '')
const description = ref<string>(localStorage.getItem('description') || '')
const history = ref<PaymentRequest[]>([])

const router = useRouter()

const getHistory = async () => {
  loading.value = true
  const { data } = await axiosInstance.get(`/pos/payment-request/${userId}`)
  history.value = data.data
  loading.value = false
}

const signOut = () => {
  localStorage.removeItem('masterUserId')
  localStorage.removeItem('title')
  localStorage.removeItem('tokensData')
  localStorage.removeItem('description')
  router.push('/')
}

onMounted(async () => {
  const { data } = await axiosInstance.get('/tokens')
  localStorage.setItem('tokensData', JSON.stringify(data.data))

  await getHistory()
})

onBeforeMount(() => {
  if (localStorage.getItem('masterUserId') === null) {
    router.push('/')
  }
})
</script>

<template>
  <div class="absolute right-0 top-4 flex z-50">
    <v-btn
      class="!border-[1px] !border-solid !border-black !rounded-full !w-[38px] !h-[38px] !min-w-[38px] !min-h-[38px]"
      @click="signOut"
    >
      <v-icon>mdi-power</v-icon>
    </v-btn>
    <img
      class="relative left-0 ml-[15px]"
      src="@/assets/img/left-triangle-no-right.svg"
      alt="Img"
    />
  </div>

  <div class="mt-[87px] mx-auto max-w-[330px]">
    <h1 class="text-[45px]">UP3</h1>

    <div
      class="relative mt-[27px] border-[1px] border-dotted border-black w-[205px] h-[39px] rounded-[10px] text-[10px] flex flex-col items-start justify-center pl-[12px]"
    >
      <span class="block">{{ title }}</span>
      <span>Descripción: {{ description }}</span>
      <div class="absolute right-0 left-0 bottom-[-66px] flex justify-center">
        <img src="@/assets/img/arrow-up-down.png" alt="" />
      </div>
    </div>

    <div
      class="mt-[65px] border-[1px] border-black rounded-[20px] h-[375px] max-h-[375px] py-[24px] px-[27px]"
    >
      <div v-for="item of history" :key="item.id" class="flex flex-col">
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <span class="text-xs font-bold">{{ item.amount }}</span>
            <span class="text-[9px]">{{ item.createdAt }}</span>
            <span v-show="item.note !== ''" class="text-[9px]">Nota: {{ item.note }}</span>
          </div>

          <div class="flex items-center gap-2.5">
            <span class="text-[9px]">{{ item.status }}</span>
          </div>
        </div>
        <div class="border-t-[1px] border-dotted border-black my-2"></div>
      </div>
    </div>

    <div class="flex justify-center mt-[27px]">
      <v-btn
        flat
        class="!text-sm !tracking-normal !normal-case !font-normal !bg-[#662483] !text-white !rounded-[10px] !min-h-[39px] !w-[161px]"
        @click="router.push('/pay')"
      >
        Iniciar cobro
      </v-btn>
    </div>
  </div>
</template>
