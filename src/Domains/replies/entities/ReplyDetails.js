class ReplyDetails{
  constructor(payload){
    this._verifyPayload(payload)
    this.id = payload.id
    this.content = payload.content
    this.date = payload.date
    this.username = payload.username
    this._formatReply(payload)
  }
  _verifyPayload(payload){
    const { id, content, date, username } = payload
    if(!id || !content || !date || !username){
      throw new Error('REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY')
    }
    if(typeof id !== 'string' || typeof content !== 'string' || typeof username !== 'string'){
      throw new Error('REPLY_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
  _formatReply(reply) {
    this.id = reply.id
    this.content = reply.is_delete === 1 ? '**balasan telah dihapus**' : reply.content;
    this.date = reply.date;
    this.username = reply.username
  }

}
module.exports = ReplyDetails