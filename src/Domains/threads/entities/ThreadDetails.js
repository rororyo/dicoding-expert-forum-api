class ThreadDetails {
  constructor(payload){
    this._verifyPayload(payload)
    this.thread = {
      id: payload.thread.id,
      title: payload.thread.title,
      body: payload.thread.body,
      date: payload.thread.date,
      username: payload.thread.username,
    }
  }
  _verifyPayload(payload) {
    const {thread} = payload
    if(!thread || !thread.id || !thread.title || !thread.body || !thread.date || !thread.username ) {
      throw new Error('THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY')
    }
    if(typeof thread.id !== 'string' || typeof thread.title !== 'string' || typeof thread.body !== 'string'  || typeof thread.username !== 'string') {
      throw new Error('THREAD_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = ThreadDetails