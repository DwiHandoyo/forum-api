const DetailedComment = require('../../../Domains/comments/entities/DetailedComment');
const commentUtils = require('../comments');

describe('CommentUtil', () => {
  it('should return Detailed Comment correctly', async () => {
    // arrange
    const availableComment = {
                              id: 'comment-abc',
                              username: 'dicoding',
                              date: '2021',
                              content: 'comment A',
                              is_delete: false,
                            }
    const deletedComment = {
                            id: 'comment-def',
                            username: 'john',
                            date: '31-12-2020',
                            content: 'comment B',
                            is_delete: true,
                          }

    // action
    const availableCommentDetail = await commentUtils.filterDeletedComments(availableComment);
    const deletedCommentDetail = await commentUtils.filterDeletedComments(deletedComment);
    // assert
    expect(availableCommentDetail).toEqual(new DetailedComment({
      id: 'comment-abc',
      username: 'dicoding',
      date: '2021',
      content: 'comment A',
    }));
    expect(deletedCommentDetail).toEqual(new DetailedComment({
      id: 'comment-def',
      username: 'john',
      date: '31-12-2020',
      content: "**komentar telah dihapus**",
    }));
  });
});
