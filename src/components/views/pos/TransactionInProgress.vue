<script setup lang="ts"></script>

<template>
  <div class="header">
    <span> El pago se encuentra pendiente de confirmaciones </span>
  </div>

  <section>
    <div class="title-page">
      <img class="title-page-imgs cloud" src="@/assets/img/cloud.svg" alt="" />
      <img class="title-page-imgs warning" src="@/assets/img/cloud-conversation.svg" alt="" />
      <img
        class="title-page-imgs warning"
        src="@/assets/img/warning.svg"
        alt=""
        style="margin: 18px 33px"
      />

      <img
        class="title-page-imgs rectangle"
        src="@/assets/img/rectangle-border-dashed.svg"
        alt=""
      />

      <span>
        transacción <br />
        <span class="second-line">en proceso</span>
      </span>
    </div>

    <img src="@/assets/img/arrow-large-going-to-up.svg" height="64" alt="Img" />

    <div class="details">
      <span class="details-title">Información de la transacción</span>
      <div class="details-row">
        <span>Código de la transacción</span>
        <span>#8378791983773</span>
      </div>
      <div class="separator"></div>
      <div class="details-row">
        <span>Altura del bloque</span>
        <span>974993</span>
      </div>
      <div class="separator"></div>
      <div class="details-row">
        <span>Número de confirmaciones</span>
        <span>2</span>
      </div>
    </div>

    <div class="timeout">
      <div class="timeout-text">Tiempo estimado de completación</div>
      <img src="@/assets/img/left-right-triangle.svg" width="16px" alt="Img" />

      <div class="timeout-number">30:43</div>
    </div>

    <div class="new-payment">
      <v-btn class="new-payment-btn" flat>Nuevo Pago</v-btn>
    </div>
  </section>
</template>

<style scoped>
.header {
  margin-top: 60px;
  width: 100%;
  border-radius: 9999px;
  padding: 8px 0;
  border: 1px solid #000;
  span {
    font-size: 10px;
    line-height: 10px;
  }
}

section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

section > img {
  margin-left: 145px;
  margin-top: -1px;
}

.title-page {
  position: relative;
  display: flex;
  margin-top: 120px;
  border: 1px solid #000;
  padding: 18px 34px;
  border-radius: 20px;
  background-color: #fff;

  span {
    font-size: 45px;
    text-align: left;
    line-height: 54px;
  }
}

.title-page-imgs {
  position: absolute;
}

.cloud {
  top: -50%;
  left: 0;
}

.warning {
  top: -65%;
  right: 10%;
}

.rectangle {
  z-index: -1;
  right: -16%;
  top: -50%;
}

.second-line {
  font-weight: 700;
}

.details {
  width: 100%;
  border: 1px solid #000;
  padding: 26px 30px;
  border-radius: 20px;
}

.details-title {
  display: flex;
  font-size: 14px;
  margin-bottom: 16px;
}

.details-row {
  font-weight: 300;
  font-size: 10px;
  display: flex;
  justify-content: space-between;
}

.separator {
  border-top: 1px dashed #000;
  margin-top: 12px;
  margin-bottom: 12px;
}

.timeout {
  width: 100%;
  display: flex;
  justify-content: end;
  margin-top: -1px;
}

.timeout > img {
  margin-left: -1px;
  margin-right: -1px;
}

.timeout-text {
  font-size: 10px;
  border: 1px solid #000;
  padding: 14px;
  border-radius: 13px;
}

.timeout-number {
  font-size: 10px;
  padding: 15px;
  background-color: #000;
  color: #fff;
  border-radius: 13px;
}

.new-payment {
  width: 100%;
  margin-top: 60px;
  display: flex;
  justify-content: center;
}

.new-payment-btn {
  background-color: #662483;
  color: #fff;
  width: 160px;
  min-height: 40px;
  border-radius: 10px;
}
</style>
