<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
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
        <img src="../assets/img/qr.png" class="absolute" alt="" />
      </div>

      <div
        class="border-[1px] border-black mt-[20px] mx-[26px] py-[10px] px-[14px] rounded-[13px] flex items-center"
      >
        <input
          type="text"
          placeholder="Pegar código de punto de venta"
          class="text-[12px] w-full"
        />
        <button>
          <img src="../assets/img/paste.png" alt="" />
        </button>
      </div>

      <div class="absolute left-0 right-0 bottom-[-24px] flex justify-center">
        <v-btn
          flat
          color="#662483"
          class="text-white py-[12px] !rounded-[13px] text-sm w-[160px] min-h-[39px] tracking-normal !normal-case !font-normal"
          @click="router.push('/historial')"
        >
          Iniciar
        </v-btn>
      </div>
    </div>
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
