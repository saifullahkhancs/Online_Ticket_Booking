    // sign up and login transitions
    $('#signIn').hide();

    $('.loginBtn').click(function () {
        $('#signUp').hide();
        $('#signIn').show(); 
        $('#log_user_message').hide();
        $('#password_message').hide();  
        
    });

    $('.signUpBtn').click(function (e) {
        e.preventDefault();
        $('#signUp').show();
        $('#signIn').hide();
        $('#n_message').hide();
        $('#user_message').hide();
        $('#pass_message').hide();
        $('#email_message').hide();
        $('#ph_message').hide();

    });


//  Front_End Validataion
    
    // signup  

    $("#submit").click(function (e) { 
        e.preventDefault(false);
        
        check($("#fn").val(), $("#ln").val(), $("#un").val(), $("#email").val(),
        $("#pass").val(), $("#ph_num").val())
        
    });

    function check(first_name, last_name ,  user_name, email, pass, phone_num) {

    console.log(first_name, last_name, user_name, email, pass, phone_num);
        
    if (first_name.length < 3 && last_name.length < 3) {
        $('#n_message').html("Names must contain 3 or more words") 
        $('#n_message').show();
        cond1 = false    }
    else {
        $('#n_message').html("")      
        cond1 = true        }

    if (user_name.length < 3) {
        $('#user_message').html("User_Name must contain 3 or more words ") 
        $('#user_message').show();
        cond2 = false        }
    else {
        $('#user_message').html("")      
        cond2 = true        }
    
    if (email.length < 1) {
        $('#email_message').html("Email field can not be empty ") 
        $('#email_message').show();
        cond3 = false        }
    else {
        $('#email_message').html("")      
        cond3 = true        }

    if (pass.length < 8) {
        $('#pass_message').html("Password must contain 8 or more words ") 
        $('#pass_message').show();
        cond4 = false        }
    else {
        $('#pass_message').html("")      
        cond4 = true        }
    
    if (phone_num.length != 11 ) {
        $('#ph_message').html("Numbers must contain 11 digits ") 
        $('#ph_message').show();
        cond5 = false        }
    else {
        $('#ph_message').html("")      
        cond5 = true        }

    console.log(cond1 , cond2 , cond3 ,  cond4 , cond5); 
    if (cond1 && cond2 && cond3 && cond4 && cond5) {
        $.ajax({
           type: "POST",
           url: "http://127.0.0.1:5000/signup",
           data: {'first_name':first_name,'last_name': last_name ,'sig_username':user_name, 
           'email':email,'sign_pass': pass, 'phone':phone_num },
           headers: {'Access-Control-Allow-Origin': '*',    },

           success: function (response) {

              stats = response['status']

              if ( stats != "ok" ) {
                alert("User name is already taken")
                //  $('#final_message').html("something went wrong ") 
                                 }
              else {
                $('#final_message').html("")                              
                
                alert("You will now be redirected.");
                window.location = "/dashboard";
                     
                    }         
                                         }
    });       }     }  

    // login   

    $("#log_submit").click(function (e) { 
        e.preventDefault();
        
        check2($("#username").val(), $("#password").val(),)
        
    });

    function check2( log_username,  password) {

    console.log( log_username, password);
    
    if (log_username.length < 3) {
        $('#log_user_message').html("User_Name can not be empty or just 2 words ") 
        $('#log_user_message').show();
        log_cond1 = false        }
    else {
        $('#log_user_message').html("")      
        log_cond1 = true        }
    

    if (password.length < 8) {
        $('#password_message').html("Password must not be empty & contain 8 or more words  ") 
        $('#password_message').show();
        log_cond2 = false        }
    else {
        $('#password_message').html("")      
        log_cond2 = true        }

        console.log(log_cond1, log_cond2)

    if (log_cond1 && log_cond2 ) {
        $.ajax({
           type: "POST",
           url: "http://127.0.0.1:5000/login",
           data: {'username': log_username,'password': password },

           success: function (response) {
            stats = response['status']

            if ( stats != "ok" ) {
              alert("Username or Password is Incorrect")
              //  $('#final_message').html("something went wrong ") 
                               }
            else {
            //   $('#final_message').html("")                              
              
              alert("You will now be redirected.");
              window.location = "/dashboard"
                        
                                         }
                                        }
    });
    }
     }  

        // if (user_messages != "True" ) {
        //     $('#user_message').html(user_messages) }
        // else {
        //     $('#user_message').html("")        }



        // $("#email").val(), $("#password").val(),

        // sendRequest($("#email").val(), $("#password").val(), $("#device1").is(':checked'),  $("#device2").is(':checked'), $("#device3").is(':checked'), 
        // $("#html").is(':checked'),  $("#css").is(':checked'), $("#javascript").is(':checked')  );  
        
        
    //  function sendRequest(email, password,device1,device2,device3, html,css,javascript) {
    //     
    //  }


