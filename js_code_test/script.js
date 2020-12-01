
jQuery(document).ready(function($){
    $.get("https://jsonplaceholder.typicode.com/users/", function(data, status){
        for (i=0; i<data.length; i++){
            $('#myTable tr:last').after('<tr name-'+ data[i]['id'] +'="'+ data[i]['name'] +'" email-'+ data[i]['id'] +'="'+ data[i]['email'] +'" class="test option-'+ data[i]['id'] +'"><td class="td-'+data[i]['id']+'"><input type="checkbox" value="'+ data[i]['id'] +'" class="check_input" name="check"></td><td class=user-id-'+data[i]['id']+'>'+ data[i]['id'] +'</td><td class=user-name-'+data[i]['id']+'>'+ data[i]['name'] +'</td><td class=user-email-'+data[i]['id']+'>'+ data[i]['email'] +'</td></tr>');
        }
    });

    $(".add-user-btn").click(function(e){
        var user_name = $(".user-name").val();
        var user_email = $(".user-email").val();

        $.ajax({
            url: "https://jsonplaceholder.typicode.com/users/",
            method: "POST",
            body: JSON.stringify({
                name: user_name,
                email: user_email,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            success: function (data) {
                $('#addUser').modal('hide');
                $('#myTable tr:last').after('<tr name-'+ data['id'] +'="'+ user_name +'" email-'+ data['id'] +'="'+ user_email +'" class="test option-'+ data['id'] +'"><td class="td-'+data['id']+'"><input type="checkbox" value="'+ data['id'] +'" class="check_input" name="check"></td><td class=user-id-'+data['id']+'>'+ data['id'] +'</td><td class=user-name-'+data['id']+'>'+ user_name +'</td><td class=user-email-'+data['id']+'>'+ user_email +'</td></tr>');
                showTr();
            }
        });
    })


    $("#checkAll").click(function () {
        $('input:checkbox').not(this).prop('checked', this.checked);
    });

    $('.user-delete-btn').click(function(event){
        event.preventDefault();
        var searchIDs = [];
        $("#myTable input:checkbox:checked").map(function(){
            searchIDs.push($(this).val());
        });
        $.each(searchIDs, function(i){
            $.ajax({
                url: "https://jsonplaceholder.typicode.com/users/"+searchIDs[i],
                method: "DELETE",
                body: JSON.stringify({
                    id: searchIDs[i],
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                success: function (data) {
                    $(".option-"+searchIDs[i]).remove();
                    showTr();
                }
            })
        })
    });

    $(document).on('click','.check_input',function(){

        var searchIDs = [];
        $("#myTable input:checkbox:checked").map(function(){
            searchIDs.push($(this).val());
        });

        if(searchIDs.length == 1){
            $(".edit-btn").prop('disabled', false);
        }
        else {
            $(".edit-btn").prop('disabled', true);
        }
    });

    $(document).on('click','.edit-btn',function(){
    // $(".edit-btn").click(function(){
        var user_id = $("#myTable input:checkbox:checked").val();
        var userName = $(".option-"+user_id).attr('name-'+user_id);
        var userEmail = $(".option-"+user_id).attr('email-'+user_id);
        
        $(".edit-user-name").val(userName);
        $(".edit-user-email").val(userEmail);
        $(".update-user-btn").attr('user_id', user_id);

    })

    $(document).on('click','.update-user-btn',function(){
    // $(".update-user-btn").click(function(){
        var userId = $(this).attr('user_id');
        var userName = $(".edit-user-name").val();
        var userEmail = $(".edit-user-email").val();

        $.ajax({
            url: "https://jsonplaceholder.typicode.com/users/"+userId,
            method: "PUT",
            body: JSON.stringify({
                id: userId,
                name: userName,
                email: userEmail,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            success: function (data) {
                console.log(data);
                $('#editUser').modal('hide');

                $(".user-name-"+userId).text(userName);
                $(".user-email-"+userId).text(userEmail);

                $(".option-"+userId).attr('name-'+userId, userName);
                $(".option-"+userId).attr('email-'+userId, userEmail);
            }
        });
        
    })


    setTimeout(showTr, 1000)

    function showTr() {
        $("body").show();
        $('#nav').remove();
        $('#myTable').after('<div class="text-right" id="nav"></div>');
        var rowsShown = 5;
        var rowsTotal = $('#myTable tr.test').length;
        var numPages = rowsTotal/rowsShown;
        for(i = 0;i < numPages;i++) {
            var pageNum = i + 1;
            $('#nav').append('<a href="#" rel="'+i+'">'+pageNum+'</a> ');
        }
        $('#myTable tr.test').slice(0, rowsShown).show();
        $('#nav a:first').addClass('active');
        $('#nav a').bind('click', function(){
            $('#nav a').removeClass('active');
            $(this).addClass('active');
            var currPage = $(this).attr('rel');
            var startItem = currPage * rowsShown;
            var endItem = startItem + rowsShown;
            $('#myTable tr.test').css('opacity','0.0').hide().slice(startItem, endItem).
            css('display','table-row').animate({opacity:1}, 300);
        });
    }

    
    
})