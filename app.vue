<template>
  <div class="font-sans text-base">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
.dp__action_cancel {
  display: flex !important;
  align-items: center !important;
}

.dp__action_cancel:hover {
  border-color: #285430 !important;
}

.dp__action_select {
  display: flex !important;
  align-items: center !important;
  background: #285430 !important;
}

.dp__action_select:hover {
  background: #285430 !important;
}

.dp__action_button {
  line-height: inherit !important;
}

.dp__active_date {
  background: #285430 !important;
}

.dp__inc_dec_button:hover {
  color: #285430 !important;
}

.dp__today {
  border: 1px solid #285430 !important;
}

.dp__overlay_cell_active {
  background: #285430 !important;
}

.dp__overlay_cell_disabled {
  cursor: not-allowed !important;
  background: gray !important;
}

.dp__range_start,
.dp__range_end {
  background: #285430 !important;
}

.dp__range_between {
  background: #5f8d4e !important;
}
</style>
