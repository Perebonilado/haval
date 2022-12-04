exports.signupNotification = ({name}) => {
    return `   
<!DOCTYPE html
PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Escalation Notification</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Raleway:wght@200;400;500;600;700;800;900&display=swap"
    rel="stylesheet">
</head>

<body style="margin: 0; padding: 0; font-family:  'Raleway', sans-serif;">
<table border="0" cellpadding="0" cellspacing="0" width="100%">

    <tr>
        <td style="padding: 0px 0 30px 0;">

            <!-- MAIN TABLE CONTENT -->
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"
                style="border: 1px solid #cccccc; border-collapse: collapse;">

                <tr>
                    <td>
                        <div style="background-color: #CCE4FF; padding-top: 2rem;">
                            <div>
                                <h1 style="color: #2F2E7C; text-align: center; font-weight: 800; margin: 0;">Welcome to Haval</h1>
                            </div>
                            <div
                                style="width: 300px; border-radius: 10px; margin: auto; margin-top: 3rem; min-height: 200px;">
                                <img width="100%" height="auto"
                                    src="https://res.cloudinary.com/dt0wfaxft/image/upload/v1663939367/Teamwork_Business_Illustration_7_v9sagn.png"
                                    alt="illustration">
                            </div>

                        </div>
                        <div style="width: 100%; height: 4px; background-color: #FDB72B;"></div>
                        <div style="width: 100%; height: 4px; background-color: #007BFF;"></div>
                    </td>
                </tr>

                <tr>
                    <td bgcolor="#ffffff" style="">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">

                            <table style="width:100%; margin:0 auto;">
                                <tr>
                                    <td>
                                        <div style="padding: 3.5rem 2.5rem; color: #495057;">
                                            <p>Dear ${name},</p>
                                            <p>Your Haval Merchant Account has successfully been created! Start selling, and earning!</p>
                                            <p style="margin-top: 4rem;">Best regards,</p>
                                            <p>Haval</p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </table>
                    </td>
                </tr>
            </table>
            <!-- footer -->
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"
                style="border-collapse: collapse;">
                <tr>
                    <td>
                        <p style="text-align: center; margin: 0; padding-bottom: 2rem; font-size: 12px; color: #495057;">powered by <b
                                style="color: skyblue; font-weight: 800;">Haval</b></p>
                    </td>
                </tr>
            </table>
            <!-- footer -->

        </td>
    </tr>
</table>
</body>

</html>
    `
}