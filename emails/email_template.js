module.exports =
function(name, subject, message) {
	return (
 `
 <html>
    <head>       
        <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,900" rel="stylesheet">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">
    
     <style>
		 :root {
		    --main-text-color: #354052;
		}

		* {
		    box-sizing: border-box;
		}

		.row::after {
		    content: "";
		    clear: both;
		    display: table;
		}

		[class*="col-"] {
		    float: left;
		    padding: 10px;
		}

		html {
		    font-family: 'Source Sans Pro', sans-serif;
		    color: var(--main-text-color);   
		}

		body {
		    padding: 0px;
		    margin: 0px;
		}

		[class*="col-"] {
		    width: 100%;
		}

		/*------------------------------------*\
		Mobile Main content
		\*------------------------------------*/

		.wrapper {
		    padding: 0px 3%;
		}

		.heading {
		    margin-top: 58px;    
		    font-size: 60px;
		    font-weight: 900;
		    color: #6B3DE4;
		}

		.image {
		    width: 100%;
		    height: 196px;
		    margin-top: 51px;
		    margin-left: auto;
		    margin-right: auto;
		    background: #F5E9F3;
		    position: relative;
		}

		.image-resize-heading {
		    width: 200px;
		    margin-left: auto;
		    margin-right: auto;
		    display: block;
		    position: absolute;               
		    top: 50%;                         
		    transform: translate(-50%, -50%);
		    left: 50%;
		}    

		.image-resize {  
		    width: 160px;
		    margin-left: auto;
		    margin-right: auto;
		    display: block;
		    position: absolute;               
		    top: 50%;                         
		    transform: translate(-50%, -50%);
		    left: 50%;
		}

		.image-resize-tub {
		    width: 120px;
		}

		.intro-text-1 {    
		    font-size: 30px;
		    margin-bottom: 30px;
		}

		.intro-text-2 {
		    font-size: 26px;
		    font-weight: 300;
		}

		.card {

		}

		.card__title {
		    text-align: center;
		    font-size: 20px;
		    font-weight: 600;
		    margin-top: 10px;
		    margin-bottom: 5px;
		}

		.card__body {
		    text-align: center;
		    font-size: 18px;
		    font-weight: 300;
		}

		input[type="button"] {
		    color: #FFFFFF;
		    background: #007AC2;
		    height: 80px;
		    width: 100%;
		    font-size: 25px;
		    font-weight: 600;
		    border: none;
		    border-radius: 4px;
		    white-space: normal;
		    margin: 61px 0px;
		}

		.footer {
		    padding-top: 20px;
		    background: #F5F5F5;
		    text-align: center;
		    padding-bottom: 50px;
		    padding-left: 3%;
		    padding-right: 3%;
		}

		.footer__title {    
		    font-size: 30px;
		    font-weight: 700;    
		}

		.footer__body {
		    font-size: 22px;
		    font-weight: 300;
		}

		.footer__social-links {
		    margin-top: 18px;
		    margin-bottom: 24px;
		}

		.icon {
		    font-size: 24px;
		    margin-left: 9px;
		    margin-right: 9px;
		}

		.footer__copyright {
		    font-size: 16px;
		    font-weight: 300;
		}

		.footer__contact {
		    font-size: 16px;
		    font-weight: 600;
		}


		/*------------------------------------*\
		Desktop Main content
		\*------------------------------------*/
		@media only screen and (min-width: 500px) {


		    .wrapper {
		        padding: 0px 20px;
		        max-width: 750px;
		        margin-left: auto;
		        margin-right: auto;
		    }

		    .heading {
		        margin-top: 58px;    
		        font-size: 80px;
		        font-weight: 900;
		        color: #6B3DE4;
		    }

		    .image {        
		        width: 100%;
		        height: 356px;
		        position: relative;
		    }

		    .image-resize-heading {
		        width: 400px;
		        margin-left: auto;
		        margin-right: auto;
		        display: block;
		        position: absolute;               
		        top: 50%;                         
		        transform: translate(-50%, -50%);
		        left: 50%;
		    }    


		    .image-resize {  
		        width: 200px;
		        margin-left: auto;
		        margin-right: auto;
		        display: block;
		        position: absolute;               
		        top: 50%;                         
		        transform: translate(-50%, -50%);
		        left: 50%;

		    }

		    .image-resize-tub {
		        width: 120px;
		    }

		    .intro-text-1 {    
		        font-size: 30px;
		        margin-bottom: 30px;
		        margin-top: 30px;
		    }

		    .intro-text-2 {
		        font-size: 26px;
		        font-weight: 300;
		        margin-bottom: 24px;
		    }

		    .card {
		        height: 330px;
		    }

		    .card .image {        
		        height: 242px;    
		        margin-top: 0px;
		    }

		    .card__title {
		        text-align: center;
		        font-size: 20px;
		        font-weight: 600;
		        margin-top: 10px;
		        margin-bottom: 5px;
		    }

		    .card__body {
		        text-align: center;
		        font-size: 18px;
		        font-weight: 300;
		    }

		    input[type="button"] {        
		        height: 85px; 
		        margin-top: 81px;
		        margin-bottom: 54px;
		    }

		    .footer {
		        padding-top: 60px;
		        background: #F5F5F5;
		        text-align: center;
		        padding-bottom: 50px;
		        padding-left: 20px;
		        padding-right: 20px;
		    }

		    .footer__title {    
		        font-size: 45px;
		        font-weight: 700;    
		    }

		    .footer__body {
		        font-size: 22px;
		        font-weight: 300;
		    }

		    .footer__social-links {
		        margin-top: 18px;
		        margin-bottom: 24px;
		    }

		    .icon {
		        font-size: 24px;
		        margin-left: 9px;
		        margin-right: 9px;
		    }

		    .footer__copyright {
		        font-size: 16px;
		        font-weight: 300;
		    }

		    .footer__contact {
		        font-size: 16px;
		        font-weight: 600;        
		    }

		    .col-6 {
		        margin-left: 0px;
		        margin-right: 0px;
		        width: 50%;
		    }
		}
 </style>


    </head>
    <body>

        <div class="wrapper">

            <div class="heading">${name}</div>

            <div class="image"><img class="image-resize-heading" src="https://preview.ibb.co/eSK8FJ/Group_40_2x.png" alt="Group_40_2x"></div>

            <div class="intro-text-1">
            	We got your message with the subject "${subject}" and the message:
            </div>

            <div class="intro-text-2">
                ${message}
            </div>

  
            <div class="card col-6">
                <div class="image"><img class="image-resize" src="https://image.ibb.co/g654pd/Group_33_2x.png" alt="Group_33_2x"></div>
                <div class="card__title">Help is on the way</div>
            </div>


        </div>

        <div class="footer">
            <div class="footer__body">Talk to you soon!</div>                
            
            <div class="footer__copyright">Copyright © 2019 <span style="font-weight: 900">Amp It Up</span> All Rights Reserved.</div>
            <div class="footer__contact">support@ampitup.io | <a href="tel:+972533308841">+972 53-330-8841</a></div>
        </div>

    </body>
</html>

<!-- Developer - Martin Brown -->
<!-- Designer - https://www.uplabs.com/posts/12-responsive-email-templates -->

 `
)};