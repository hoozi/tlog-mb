
const state = {
  
}

const reducers = {
  save(state, payload) {
    return Object.assign(state, payload)
  }
}

const effects = dispatch => ( {
  async fetchNews(payload) {
    dispatch.news.fetchNews(payload);
  },
  async fetchProduct(payload) {
    dispatch.product.fetchProduct(payload);
  },
  async fetchCargo(payload) {
    dispatch.cargo.fetchCargo({status: 30, ...payload});
  }
})


export default {
  state,
  reducers,
  effects
}