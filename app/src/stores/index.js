import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    isLive: false,
    currentEvent: null
  }),
  actions: {
    setLiveStatus(status, event) {
      this.isLive = status;
      this.currentEvent = event;
    }
  }
})
