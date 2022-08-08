$("button").click(function (e) { 
    e.preventDefault();
    

    console.log( $("#from").val(), $("#to").val(), $("#airline").val(), $("#class").val(),
    $("#a-option").is(':checked'), $("#b-option").is(':checked' ),
    $("#name").val(),  $("#Phone_no").val() ,$("#Email").val()   )
    check( $("#from").val(), $("#to").val(), $("#airline").val(), $("#class").val(),
    $("#a-option").is(':checked'), $("#b-option").is(':checked' ),
    $("#name").val(),  $("#Phone_no").val() , $("#Email").val()  )
    // sendRequest($("#from").val(), $("#password").val(), $("#device1").is(':checked'),  $("#device2").is(':checked'), $("#device3").is(':checked'), 
    // $("#html").is(':checked'),  $("#css").is(':checked'), $("#javascript").is(':checked')  );  
    
 });


 function check(from, to , airline,classs,first_option,
     second_option, name , phone , email ) {
    
    console.log(from, to , airline,classs,first_option,
        second_option, name , phone , email)

    if (from != "From" && to != "To" && airline != "Preferred_Airline"
    &&    classs !=  "Preferred_Class" && name.length > 2 && phone.length > 10
    && email.length > 2  )
    {    cond1 = true      }
    else  {
        cond1 = false
        alert("Some fields are empty or not selected") 

    }  

    if (first_option || second_option) {
        cond2 = true
    }
    else
    {
        cond2 = false
    }

    console.log(cond1, cond2)
    if (cond1 && cond2) {
    
        $.ajax({
           type: "POST",
           url: "http://127.0.0.1:5000/dashboard",
           data: {'from': from, 'to': to ,'airline': airline,
           'class': classs, 'one': first_option, 'two':second_option,
           'name': name , 'phone':phone , 'email': email },
           headers: {'Access-Control-Allow-Origin': '*',    },

           success: function (response) {

              stats = response['status']

              if ( stats != "ok" ) {
                alert("Some fields are eempty") 
                  
                                 }
              else {
                                             
                
                alert("You will now be redirected.");
                window.location = "/ticket";
                    }

           }
        });



    }
 } 





//  function sendRequest(email, password,device1,device2,device3, html,css,javascript) {
//     $.ajax({
//        type: "POST",
//        url: "http://127.0.0.1:5000/data",
//        data: {'username': email, 'password': password, 'device1': device1, 'device2': device2 , 'device3': device3 , 
//                 'lang1':html, 'lang2':css ,'lang3':javascript, },

//        success: function (response) {
//           emails = response['name']
//           pass_messages = response['pass_mess']
//           check_messages = response['check_mess']
//           radio_messages = response['radio_mess']
//           user_messages = response['user']
//           final_messages = response['final']

//           if (user_messages != "True" ) {
//              $('#user_message').html(user_messages) 
//                              }
//           else {
//              $('#user_message').html("")              
//                }
//           if (pass_messages != "True" ) {
 
//              $('#pass_message').html(pass_messages) 
//                              }
//           else {
//              $('#pass_message').html("")
//           }
//           if (check_messages != "True" ) {
//              $('#check_message').html(check_messages) 
//                              }
//           else {
//              $('#check_message').html("")
//           }
          
//           if (radio_messages != "True" ) {
//              $('#radio_message').html(radio_messages) 
//                              }
//           else {
//              $('#radio_message').html("")
//           }

//           if (final_messages != "True" ) {
//              $('#final_message').html(final_messages) 
//                              }
//           else {
//              $('#final_message').html("")
//           }                              
//           console.log(response);           
//                                     }
//     });