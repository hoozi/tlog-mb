export default {
  state: {},
  reducers: {
    saveCache(state, payload) {
      return Object.assign(state, payload)
    }
  }
}