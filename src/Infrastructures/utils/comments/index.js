const DetailedComment = require('../../../Domains/comments/entities/DetailedComment');

class CommentsMapDb {
  filterDeletedComments(comment) {
    if (comment.is_delete) {
      const { id, username, date } = comment;
      return new DetailedComment({
        id, username, date, content: '**komentar telah dihapus**',
      });
    }

    const {
      id, username, date, content,
    } = comment;
    return new DetailedComment({
      id, username, date, content,
    });
  }
}

module.exports = new CommentsMapDb();
