<script setup lang="ts">
import { onBeforeMount, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import QrScanner from 'qr-scanner'

const router = useRouter()

const pasteInput = ref<HTMLInputElement | null>(null)
const loading = ref(false)
const codeUP3 = ref('')
const userId = ref(localStorage.getItem('userId'))
const scanning = ref(false)

onBeforeMount(() => {
  if (localStorage.getItem('masterUserId')) {
    router.push('/historial')
  }

  if (localStorage.getItem('userId') === null) {
    userId.value = uuidv4()
    localStorage.setItem('userId', userId.value)
  }
})

async function pasteClipboard() {
  try {
    const text = await navigator.clipboard.readText()
    if (pasteInput.value) {
      pasteInput.value.value = text
      codeUP3.value = text
    }
  } catch (error) {
    console.error('Failed to paste clipboard content:', error)
  }
}

async function handleSubmit() {
  loading.value = true

  try {
    const { data } = await axios.post(
      'https://app.venwallet.xyz/venwallet/api/v1/pos/link/connect',
      {
        userId: userId.value,
        posLinkId: codeUP3.value,
      },
    )

    localStorage.setItem('userId', data.data.userLinked)
    localStorage.setItem('description', data.data.description)
    localStorage.setItem('title', data.data.title)
    localStorage.setItem('masterUserId', data.data.userId)

    router.push('/historial')
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

function openCamera() {
  scanning.value = true
  nextTick(async () => {
    const videoElem = document.createElement('video')
    const scanner = new QrScanner(videoElem, (result) => {
      codeUP3.value = result
      scanning.value = false
      scanner.stop()
    })
    await scanner.start()
  })
}
</script>

<template>
  <div class="max-w-[330px] mx-auto mt-[200px]">
    <div class="relative border-[1px] border-black rounded-[20px] h-[394px]">
      <div class="absolute left-0 right-0 top-[-20px] flex justify-center">
        <div
          class="bg-white border-[1px] border-dotted border-black max-w-max py-[13px] px-[24px] rounded-[20px] inline-flex items-center gap-2.5"
        >
          <img src="../assets/img/asterisco.png" alt="" />
          <span class="text-[9px] leading-none">
            Requisito obligatorio para todos los usuarios
          </span>
        </div>
      </div>

      <div class="relative mt-[45px] flex justify-center items-center">
        <img src="../assets/img/border-rounded-pounts.png" alt="" />
        <img src="../assets/img/qr.png" class="absolute" alt="" @click="openCamera" />
      </div>

      <div
        class="border-[1px] border-black mt-[20px] mx-[26px] py-[10px] px-[14px] rounded-[13px] flex items-center"
      >
        <input
          type="text"
          placeholder="Pegar código de punto de venta"
          class="text-[12px] w-full focus:outline-none"
          ref="pasteInput"
          v-model="codeUP3"
        />
        <button>
          <img src="../assets/img/paste.png" @click="pasteClipboard" alt="" />
        </button>
      </div>

      <div class="absolute left-0 right-0 bottom-[-24px] flex justify-center">
        <v-btn
          class="!bg-[#662483] !text-white !rounded-[13px] !text-sm !w-[160px] !min-h-[39px] !tracking-normal !font-normal !normal-case"
          @click="handleSubmit"
        >
          Iniciar
        </v-btn>
      </div>
    </div>
    <div v-if="scanning" id="qr-scanner"></div>
    <div class="mt-[130px] flex justify-between items-center">
      <span class="text-sm">
        Escanea para <br />
        conectar la <br />
        aplicación
      </span>

      <div class="inline-flex flex-col items-end">
        <img src="../assets/img/dots.png" alt="" />
        <h1 class="text-[64px]">UP3</h1>
      </div>
    </div>
  </div>
</template>
