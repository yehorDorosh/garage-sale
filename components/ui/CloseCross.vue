<template>
  <button class="cross" @click="$emit('click', $event)" />
</template>

<style scoped>
.cross {
  position: absolute;
  top: 12px;
  right: 12px;
  height: 16px;
  width: 16px;
  opacity: 0.3;
  cursor: pointer;
  border: none;
  background: none;
  display: block;
  background-color: rgb(192 192 192 / 70%);
  border-radius: 12px;
  padding: 12px;
}

.cross:hover {
  opacity: 1;
}

.cross::before,
.cross::after {
  position: absolute;
  top: 4px;
  left: 11px;
  content: " ";
  height: 17px;
  width: 2px;
  background-color: #333;
}

.cross::before {
  transform: rotate(45deg);
}

.cross::after {
  transform: rotate(-45deg);
}
</style>
