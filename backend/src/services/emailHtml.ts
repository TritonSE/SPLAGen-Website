const RECIPIENT_TEXT = "[Recipient]";

const REASON_TEXT = "[Reason]";

const SIGN_OFF_HTML = `
<p style="margin-bottom: 20px;"> Sincerely, </p>

<p style="margin-bottom: 20px;"> The Latin American Professional Society for Genetic Counseling (SPLAGen) </p>

<p style="font-size: 10px;">
   <strong>Latin American Professional Society of Genetic Counseling</strong><br>
   Sociedad Profesional Latinoamericana de Asesoramiento Genético<br>
   Sociedade Profissional Latino-americana de Aconselhamento Genético<br>
   <a href="https://www.splagen.org/" style="color: blue;">https://www.splagen.org</a> | 
   <a href="mailto:info@splagen.org" style="color: blue;">info@splagen.org</a>
</p>
<img src="cid:splagen_logo.png" alt="SPLAGen Logo" width="120" height="120" />`;

const DIRECTORY_APPROVAL_EMAIL = `
<p style="margin-bottom: 20px;">Dear [Recipient],</p> 

<p style="margin-bottom: 20px;"> We are delighted to inform you that you have been added to the Latin American Professional Society for Genetic Counseling (SPLAGen) directory. </p>

<p style="margin-bottom: 20px;"> You can view the information posted in our directory here: <a href="https://www.splagen.org/en/en/directory">https://www.splagen.org/en/en/directory</a> </p>

<p style="margin-bottom: 20px;"> Your information for the directory can always be edited by going to the membership page by logging into the membership page and clicking the profile picture in the top right corner. </p>

<p style="margin-bottom: 20px;"> If you have any questions, please don't hesitate to contact us at <a href="mailto:info@splagen.org" style="color: blue;">info@splagen.org</a>. </p>

<p style="margin-bottom: 20px;"> We look forward to your active participation in SPLAGen!

<p style="margin-bottom: 20px;"> <strong> This is an automated email. Please do not reply to this email. For any inqueries contact us at <a href="mailto:info@splagen.org" style="color: blue;">info@splagen.org</a> </strong> </p>
`;

const DIRECTORY_DENIAL_EMAIL = `
<p style="margin-bottom: 20px;">Dear [Recipient],</p>

<p style="margin-bottom: 20px;">Thank you for your interest in joining the Latin American Professional Society for Genetic Counseling (SPLAGen) directory. We appreciate you taking the time to apply.</p>

<p style="margin-bottom: 20px;">After careful review of your application, we regret to inform you that we are unable to offer you membership at this time due to the following reason: </p>

<p style="margin-bottom: 20px;">[Reason]</p>

<p style="margin-bottom: 20px;">If you believe there has been a misunderstanding or if you have questions about the application process, please don't hesitate to contact us at <a href="mailto:info@splagen.org" style="color: blue;">info@splagen.org</a>.</p>

<p style="margin-bottom: 20px;">We appreciate your understanding and we look forward to your active participation in SPLAGen! </p>

<p style="margin-bottom: 20px;"> <strong> This is an automated email. Please do not reply to this email. For any inqueries contact us at <a href="mailto:info@splagen.org" style="color: blue;">info@splagen.org</a> </strong> </p>
`;

export {
  DIRECTORY_APPROVAL_EMAIL,
  RECIPIENT_TEXT,
  SIGN_OFF_HTML,
  DIRECTORY_DENIAL_EMAIL,
  REASON_TEXT,
};
