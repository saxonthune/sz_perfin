function tran_delete(id){
    $.ajax({
        url: '/transactions/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
