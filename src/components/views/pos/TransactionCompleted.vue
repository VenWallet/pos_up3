<script setup lang="ts"></script>

<template>
  <div class="header">
    <span class="top">felicidades</span>
    <span>su pago ha sido</span>
    <span class="bold">completado</span>
  </div>
  <section>
    <div class="img-group">
      <img class="absolute-img" src="@/assets/img/group-exitoso.svg" />
      <img src="@/assets/img/group-trofeo.svg" />
    </div>

    <div class="footer-id">
      <div class="footer-id-intern">
        <span> ID </span>
      </div>
    </div>

    <div class="footer-window-11">
      <v-btn class="footer-btn" flat>Nuevo pago</v-btn>
    </div>
  </section>
</template>

<style scoped>
.header {
  margin-top: 36px;
  width: 100%;
  text-align: start;
  display: flex;
  flex-direction: column;
  font-size: 45px;
  line-height: 54px;
}

section {
  width: 100%;
}

.top {
  font-size: 64px;
  line-height: 77px;
}

.bold {
  font-weight: 700;
}

.img-group {
  margin-top: 43px;
  position: relative;
  display: flex;
  justify-content: end;
  width: 95%;
}

.absolute-img {
  position: absolute;
  top: -7.5%;
  right: 20%;
}

.footer-id {
  margin-top: 10px;
  border: 1px dashed #000;
  padding: 27px;
  border-radius: 20px;
}

.footer-id-intern {
  display: flex;
  width: 100%;
  border: 1px solid #000;
  padding: 13px 17px;
  border-radius: 13px;
}

.footer-id-intern > span {
  font-size: 10px;
}

.footer-window-11 {
  margin-top: 27px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.footer-btn {
  background-color: #662483;
  color: #fff;
  width: 160px;
  min-height: 40px;
  border-radius: 10px;
}
</style>
