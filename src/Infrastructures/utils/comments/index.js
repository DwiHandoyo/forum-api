class CommentsMapDb{
    filterDeletedComments(comment){
        if(comment.is_delete){
            const {id, username, date} = comment;
            return {id, username, date, content: "**komentar telah dihapus**"}
        }
        else{
            const {id, username, date, content} = comment;
            return {id, username, date, content}
        }
    }
}

module.exports = new CommentsMapDb();