export type Lang = "english" | "spanish" | "portuguese";
type LocalizedTemplate = Record<Lang, string>;

export const getTemplate = (template: LocalizedTemplate, lang?: string | null): string =>
  template[(lang ?? "english") as Lang] ?? template.english;

const RECIPIENT_TEXT = "[Recipient]";

const REASON_TEXT = "[Reason]";

const PORTAL_LINK = "[PortalLink]";

const AUTHOR_NAME = "[AuthorName]";

const ANNOUNCEMENT_TITLE = "[AnnouncementTitle]";

const ANNOUNCEMENT_MESSAGE = "[AnnouncementMessage]";

const ANNOUNCEMENT_URL = "[AnnouncementUrl]";

const REPLIER_NAME = "[ReplierName]";

const DISCUSSION_TITLE = "[DiscussionTitle]";

const REPLY_MESSAGE = "[ReplyMessage]";

const DISCUSSION_URL = "[DiscussionUrl]";

const SIGN_OFF_HTML: LocalizedTemplate = {
  english: `
<p style="margin-bottom: 20px;"> <strong> This is an automated email. Please do not reply to this email. For any inquiries contact us at <a href="mailto:info@splagen.org" style="color: blue;">info@splagen.org</a> </strong> </p>

<p style="margin-bottom: 20px;"> Sincerely, </p>

<p style="margin-bottom: 20px;"> The Latin American Professional Society for Genetic Counseling (SPLAGen) </p>

<p style="font-size: 10px;">
   <strong>Latin American Professional Society of Genetic Counseling</strong><br>
   Sociedad Profesional Latinoamericana de Asesoramiento Genético<br>
   Sociedade Profissional Latino-americana de Aconselhamento Genético<br>
   <a href="https://www.splagen.org/" style="color: blue;">https://www.splagen.org</a> |
   <a href="mailto:info@splagen.org" style="color: blue;">info@splagen.org</a>
</p>
<img src="cid:splagen_logo.png" alt="SPLAGen Logo" width="120" height="120" />`,

  spanish: `
<p style="margin-bottom: 20px;"> <strong> Este es un correo electrónico automático. Por favor, no responda a este correo. Para cualquier consulta, contáctenos en <a href="mailto:info@splagen.org" style="color: blue;">info@splagen.org</a> </strong> </p>

<p style="margin-bottom: 20px;"> Atentamente, </p>

<p style="margin-bottom: 20px;"> La Sociedad Profesional Latinoamericana de Asesoramiento Genético (SPLAGen) </p>

<p style="font-size: 10px;">
   <strong>Latin American Professional Society of Genetic Counseling</strong><br>
   Sociedad Profesional Latinoamericana de Asesoramiento Genético<br>
   Sociedade Profissional Latino-americana de Aconselhamento Genético<br>
   <a href="https://www.splagen.org/" style="color: blue;">https://www.splagen.org</a> |
   <a href="mailto:info@splagen.org" style="color: blue;">info@splagen.org</a>
</p>
<img src="cid:splagen_logo.png" alt="SPLAGen Logo" width="120" height="120" />`,

  portuguese: `
<p style="margin-bottom: 20px;"> <strong> Este é um e-mail automático. Por favor, não responda a este e-mail. Para quaisquer dúvidas, entre em contato conosco em <a href="mailto:info@splagen.org" style="color: blue;">info@splagen.org</a> </strong> </p>

<p style="margin-bottom: 20px;"> Atenciosamente, </p>

<p style="margin-bottom: 20px;"> A Sociedade Profissional Latino-americana de Aconselhamento Genético (SPLAGen) </p>

<p style="font-size: 10px;">
   <strong>Latin American Professional Society of Genetic Counseling</strong><br>
   Sociedad Profesional Latinoamericana de Asesoramiento Genético<br>
   Sociedade Profissional Latino-americana de Aconselhamento Genético<br>
   <a href="https://www.splagen.org/" style="color: blue;">https://www.splagen.org</a> |
   <a href="mailto:info@splagen.org" style="color: blue;">info@splagen.org</a>
</p>
<img src="cid:splagen_logo.png" alt="SPLAGen Logo" width="120" height="120" />`,
};

const DIRECTORY_APPROVAL_EMAIL: LocalizedTemplate = {
  english: `
<p style="margin-bottom: 20px;">Dear [Recipient],</p>

<p style="margin-bottom: 20px;"> We are delighted to inform you that you have been added to the Latin American Professional Society for Genetic Counseling (SPLAGen) directory. </p>

<p style="margin-bottom: 20px;"> You can view the information posted in our directory here: <a href="https://www.splagen.org/en/en/directory">https://www.splagen.org/en/en/directory</a> </p>

<p style="margin-bottom: 20px;"> Your information for the directory can always be edited by going to the membership portal and clicking your profile picture in the top right corner. </p>

<p style="margin-bottom: 20px;"> If you have any questions, please don't hesitate to contact us at <a href="mailto:info@splagen.org" style="color: blue;">info@splagen.org</a>. </p>

<p style="margin-bottom: 20px;"> We look forward to your active participation in SPLAGen!</p>
`,

  spanish: `
<p style="margin-bottom: 20px;">Estimado/a [Recipient],</p>

<p style="margin-bottom: 20px;"> Nos complace informarle que ha sido añadido/a al directorio de la Sociedad Profesional Latinoamericana de Asesoramiento Genético (SPLAGen). </p>

<p style="margin-bottom: 20px;"> Puede ver la información publicada en nuestro directorio aquí: <a href="https://www.splagen.org/en/es/directory">https://www.splagen.org/en/es/directory</a> </p>

<p style="margin-bottom: 20px;"> Su información en el directorio siempre puede editarse accediendo al portal de membresía y haciendo clic en su foto de perfil en la esquina superior derecha. </p>

<p style="margin-bottom: 20px;"> Si tiene alguna pregunta, no dude en contactarnos en <a href="mailto:info@splagen.org" style="color: blue;">info@splagen.org</a>. </p>

<p style="margin-bottom: 20px;"> ¡Esperamos su activa participación en SPLAGen!</p>
`,

  portuguese: `
<p style="margin-bottom: 20px;">Prezado/a [Recipient],</p>

<p style="margin-bottom: 20px;"> Temos o prazer de informar que você foi adicionado/a ao diretório da Sociedade Profissional Latino-americana de Aconselhamento Genético (SPLAGen). </p>

<p style="margin-bottom: 20px;"> Você pode visualizar as informações publicadas em nosso diretório aqui: <a href="https://www.splagen.org/en/pt/directory">https://www.splagen.org/en/pt/directory</a> </p>

<p style="margin-bottom: 20px;"> Suas informações no diretório sempre podem ser editadas acessando o portal de membros e clicando na sua foto de perfil no canto superior direito. </p>

<p style="margin-bottom: 20px;"> Se tiver alguma dúvida, não hesite em nos contatar em <a href="mailto:info@splagen.org" style="color: blue;">info@splagen.org</a>. </p>

<p style="margin-bottom: 20px;"> Aguardamos sua participação ativa no SPLAGen!</p>
`,
};

const DIRECTORY_DENIAL_EMAIL: LocalizedTemplate = {
  english: `
<p style="margin-bottom: 20px;">Dear [Recipient],</p>

<p style="margin-bottom: 20px;">Thank you for your interest in joining the Latin American Professional Society for Genetic Counseling (SPLAGen) directory. We appreciate you taking the time to apply.</p>

<p style="margin-bottom: 20px;">After careful review of your application, we regret to inform you that we are unable to include you in our directory at this time due to the following reason: </p>

<p style="margin-bottom: 20px;">[Reason]</p>

<p style="margin-bottom: 20px;">If you believe there has been a misunderstanding or if you have questions about the application process, please don't hesitate to contact us at <a href="mailto:info@splagen.org" style="color: blue;">info@splagen.org</a>.</p>

<p style="margin-bottom: 20px;">We appreciate your understanding and we look forward to your active participation in SPLAGen! </p>
`,

  spanish: `
<p style="margin-bottom: 20px;">Estimado/a [Recipient],</p>

<p style="margin-bottom: 20px;">Gracias por su interés en unirse al directorio de la Sociedad Profesional Latinoamericana de Asesoramiento Genético (SPLAGen). Agradecemos el tiempo que tomó para postularse.</p>

<p style="margin-bottom: 20px;">Tras una revisión cuidadosa de su solicitud, lamentamos informarle que en este momento no podemos incluirle en nuestro directorio debido al siguiente motivo: </p>

<p style="margin-bottom: 20px;">[Reason]</p>

<p style="margin-bottom: 20px;">Si cree que ha habido un malentendido o si tiene preguntas sobre el proceso de solicitud, no dude en contactarnos en <a href="mailto:info@splagen.org" style="color: blue;">info@splagen.org</a>.</p>

<p style="margin-bottom: 20px;">Agradecemos su comprensión y esperamos su activa participación en SPLAGen. </p>
`,

  portuguese: `
<p style="margin-bottom: 20px;">Prezado/a [Recipient],</p>

<p style="margin-bottom: 20px;">Obrigado pelo seu interesse em ingressar no diretório da Sociedade Profissional Latino-americana de Aconselhamento Genético (SPLAGen). Agradecemos pelo tempo dedicado à sua candidatura.</p>

<p style="margin-bottom: 20px;">Após uma cuidadosa revisão de sua inscrição, lamentamos informar que não podemos incluí-lo/a em nosso diretório no momento, pelo seguinte motivo: </p>

<p style="margin-bottom: 20px;">[Reason]</p>

<p style="margin-bottom: 20px;">Se acredita que houve um mal-entendido ou se tiver dúvidas sobre o processo de inscrição, não hesite em nos contatar em <a href="mailto:info@splagen.org" style="color: blue;">info@splagen.org</a>.</p>

<p style="margin-bottom: 20px;">Agradecemos sua compreensão e aguardamos sua participação ativa no SPLAGen! </p>
`,
};

const ADMIN_INVITE_EMAIL: LocalizedTemplate = {
  english: `
<p style="margin-bottom: 20px;">Dear [Recipient],</p>

<p style="margin-bottom: 20px;">You have been invited to be an admin on the SPLAGen membership portal! You can now manage counselors, create announcements, and moderate discussions.</p>

<p style="margin-bottom: 20px;">You can access the membership portal at [PortalLink].</p>

<p style="margin-bottom: 20px;"> We look forward to your active participation in SPLAGen!</p>
`,

  spanish: `
<p style="margin-bottom: 20px;">Estimado/a [Recipient],</p>

<p style="margin-bottom: 20px;">¡Ha sido invitado/a a ser administrador/a en el portal de membresía de SPLAGen! Ahora puede gestionar consejeros, crear anuncios y moderar discusiones.</p>

<p style="margin-bottom: 20px;">Puede acceder al portal de membresía en [PortalLink].</p>

<p style="margin-bottom: 20px;"> ¡Esperamos su activa participación en SPLAGen!</p>
`,

  portuguese: `
<p style="margin-bottom: 20px;">Prezado/a [Recipient],</p>

<p style="margin-bottom: 20px;">Você foi convidado/a a ser administrador/a no portal de membros do SPLAGen! Agora você pode gerenciar conselheiros, criar anúncios e moderar discussões.</p>

<p style="margin-bottom: 20px;">Você pode acessar o portal de membros em [PortalLink].</p>

<p style="margin-bottom: 20px;"> Aguardamos sua participação ativa no SPLAGen!</p>
`,
};

const ADMIN_REMOVAL_EMAIL: LocalizedTemplate = {
  english: `
<p style="margin-bottom: 20px;">Dear [Recipient],</p>

<p style="margin-bottom: 20px;">We have removed you as an admin on the SPLAGen platform due to the following reason: </p>

<p style="margin-bottom: 20px;">[Reason]</p>

<p style="margin-bottom: 20px;">You are still a genetic counselor, but have lost admin privileges.</p>

<p style="margin-bottom: 20px;">If you believe there has been a misunderstanding or if you have questions, please don't hesitate to contact us at <a href="mailto:info@splagen.org" style="color: blue;">info@splagen.org</a>.</p>
`,

  spanish: `
<p style="margin-bottom: 20px;">Estimado/a [Recipient],</p>

<p style="margin-bottom: 20px;">Hemos eliminado su rol de administrador/a en la plataforma SPLAGen por el siguiente motivo: </p>

<p style="margin-bottom: 20px;">[Reason]</p>

<p style="margin-bottom: 20px;">Usted sigue siendo asesor/a genético/a, pero ha perdido los privilegios de administrador/a.</p>

<p style="margin-bottom: 20px;">Si cree que ha habido un malentendido o si tiene preguntas, no dude en contactarnos en <a href="mailto:info@splagen.org" style="color: blue;">info@splagen.org</a>.</p>
`,

  portuguese: `
<p style="margin-bottom: 20px;">Prezado/a [Recipient],</p>

<p style="margin-bottom: 20px;">Removemos você como administrador/a da plataforma SPLAGen pelo seguinte motivo: </p>

<p style="margin-bottom: 20px;">[Reason]</p>

<p style="margin-bottom: 20px;">Você ainda é um/a conselheiro/a genético/a, mas perdeu os privilégios de administrador/a.</p>

<p style="margin-bottom: 20px;">Se acredita que houve um mal-entendido ou se tiver dúvidas, não hesite em nos contatar em <a href="mailto:info@splagen.org" style="color: blue;">info@splagen.org</a>.</p>
`,
};

const ACCOUNT_DELETION_EMAIL: LocalizedTemplate = {
  english: `
<p style="margin-bottom: 20px;">Dear [Recipient],</p>

<p style="margin-bottom: 20px;">Your account on the SPLAGen platform has been deleted due to the following reason: </p>

<p style="margin-bottom: 20px;">[Reason]</p>

<p style="margin-bottom: 20px;">If you believe there has been a misunderstanding or if you have questions, please don't hesitate to contact us at <a href="mailto:info@splagen.org" style="color: blue;">info@splagen.org</a>.</p>
`,

  spanish: `
<p style="margin-bottom: 20px;">Estimado/a [Recipient],</p>

<p style="margin-bottom: 20px;">Su cuenta en la plataforma SPLAGen ha sido eliminada por el siguiente motivo: </p>

<p style="margin-bottom: 20px;">[Reason]</p>

<p style="margin-bottom: 20px;">Si cree que ha habido un malentendido o si tiene preguntas, no dude en contactarnos en <a href="mailto:info@splagen.org" style="color: blue;">info@splagen.org</a>.</p>
`,

  portuguese: `
<p style="margin-bottom: 20px;">Prezado/a [Recipient],</p>

<p style="margin-bottom: 20px;">Sua conta na plataforma SPLAGen foi excluída pelo seguinte motivo: </p>

<p style="margin-bottom: 20px;">[Reason]</p>

<p style="margin-bottom: 20px;">Se acredita que houve um mal-entendido ou se tiver dúvidas, não hesite em nos contatar em <a href="mailto:info@splagen.org" style="color: blue;">info@splagen.org</a>.</p>
`,
};

const DIRECTORY_REMOVAL_EMAIL: LocalizedTemplate = {
  english: `
<p style="margin-bottom: 20px;">Dear [Recipient],</p>

<p style="margin-bottom: 20px;">We have removed you from the SPLAGen public directory due to the following reason: </p>

<p style="margin-bottom: 20px;">[Reason]</p>

<p style="margin-bottom: 20px;">You are still a genetic counselor, but your information will not show up to people looking for genetic services.</p>

<p style="margin-bottom: 20px;">If you believe there has been a misunderstanding or if you have questions, please don't hesitate to contact us at <a href="mailto:info@splagen.org" style="color: blue;">info@splagen.org</a>.</p>
`,

  spanish: `
<p style="margin-bottom: 20px;">Estimado/a [Recipient],</p>

<p style="margin-bottom: 20px;">Hemos eliminado su información del directorio público de SPLAGen por el siguiente motivo: </p>

<p style="margin-bottom: 20px;">[Reason]</p>

<p style="margin-bottom: 20px;">Usted sigue siendo asesor/a genético/a, pero su información no aparecerá para las personas que buscan servicios genéticos.</p>

<p style="margin-bottom: 20px;">Si cree que ha habido un malentendido o si tiene preguntas, no dude en contactarnos en <a href="mailto:info@splagen.org" style="color: blue;">info@splagen.org</a>.</p>
`,

  portuguese: `
<p style="margin-bottom: 20px;">Prezado/a [Recipient],</p>

<p style="margin-bottom: 20px;">Removemos suas informações do diretório público do SPLAGen pelo seguinte motivo: </p>

<p style="margin-bottom: 20px;">[Reason]</p>

<p style="margin-bottom: 20px;">Você ainda é um/a conselheiro/a genético/a, mas suas informações não aparecerão para pessoas que buscam serviços genéticos.</p>

<p style="margin-bottom: 20px;">Se acredita que houve um mal-entendido ou se tiver dúvidas, não hesite em nos contatar em <a href="mailto:info@splagen.org" style="color: blue;">info@splagen.org</a>.</p>
`,
};

const NEW_ANNOUNCEMENT_EMAIL: LocalizedTemplate = {
  english: `
<p style="margin-bottom: 20px;">Dear [Recipient],</p>

<p style="margin-bottom: 20px;">A new announcement has been posted by <strong>[AuthorName]</strong> in the SPLAGen Membership Portal:</p>

<div style="margin: 30px 0; padding: 20px; background-color: #f5f5f5; border-left: 4px solid #1e40af;">
  <h2 style="margin-top: 0; margin-bottom: 15px; color: #1e40af;">[AnnouncementTitle]</h2>
  <p style="margin-bottom: 0; white-space: pre-wrap;">[AnnouncementMessage]</p>
</div>

<p style="margin-bottom: 20px;">To view this announcement, please visit: <a href="[AnnouncementUrl]" style="color: blue;">[AnnouncementUrl]</a></p>

<p style="margin-bottom: 20px;">We look forward to your active participation in SPLAGen!</p>
`,

  spanish: `
<p style="margin-bottom: 20px;">Estimado/a [Recipient],</p>

<p style="margin-bottom: 20px;">Se ha publicado un nuevo anuncio por <strong>[AuthorName]</strong> en el Portal de Membresía de SPLAGen:</p>

<div style="margin: 30px 0; padding: 20px; background-color: #f5f5f5; border-left: 4px solid #1e40af;">
  <h2 style="margin-top: 0; margin-bottom: 15px; color: #1e40af;">[AnnouncementTitle]</h2>
  <p style="margin-bottom: 0; white-space: pre-wrap;">[AnnouncementMessage]</p>
</div>

<p style="margin-bottom: 20px;">Para ver este anuncio, visite: <a href="[AnnouncementUrl]" style="color: blue;">[AnnouncementUrl]</a></p>

<p style="margin-bottom: 20px;">¡Esperamos su activa participación en SPLAGen!</p>
`,

  portuguese: `
<p style="margin-bottom: 20px;">Prezado/a [Recipient],</p>

<p style="margin-bottom: 20px;">Um novo anúncio foi publicado por <strong>[AuthorName]</strong> no Portal de Membros do SPLAGen:</p>

<div style="margin: 30px 0; padding: 20px; background-color: #f5f5f5; border-left: 4px solid #1e40af;">
  <h2 style="margin-top: 0; margin-bottom: 15px; color: #1e40af;">[AnnouncementTitle]</h2>
  <p style="margin-bottom: 0; white-space: pre-wrap;">[AnnouncementMessage]</p>
</div>

<p style="margin-bottom: 20px;">Para visualizar este anúncio, acesse: <a href="[AnnouncementUrl]" style="color: blue;">[AnnouncementUrl]</a></p>

<p style="margin-bottom: 20px;">Aguardamos sua participação ativa no SPLAGen!</p>
`,
};

const NEW_DISCUSSION_REPLY_EMAIL: LocalizedTemplate = {
  english: `
<p style="margin-bottom: 20px;">Dear [Recipient],</p>

<p style="margin-bottom: 20px;"><strong>[ReplierName]</strong> has replied to the post, "[DiscussionTitle]":</p>

<div style="margin: 30px 0; padding: 20px; background-color: #f5f5f5;">
  <p style="margin: 0; white-space: pre-wrap;">[ReplyMessage]</p>
</div>

<p style="margin-bottom: 20px;">To view the full discussion, reply, or unsubscribe from email notifications, please visit: <a href="[DiscussionUrl]" style="color: blue;">[DiscussionUrl]</a></p>

<p style="margin-bottom: 20px;">We look forward to your active participation in SPLAGen!</p>
`,

  spanish: `
<p style="margin-bottom: 20px;">Estimado/a [Recipient],</p>

<p style="margin-bottom: 20px;"><strong>[ReplierName]</strong> ha respondido a la publicación "[DiscussionTitle]":</p>

<div style="margin: 30px 0; padding: 20px; background-color: #f5f5f5;">
  <p style="margin: 0; white-space: pre-wrap;">[ReplyMessage]</p>
</div>

<p style="margin-bottom: 20px;">Para ver la discusión completa, responder o cancelar la suscripción a las notificaciones por correo electrónico, visite: <a href="[DiscussionUrl]" style="color: blue;">[DiscussionUrl]</a></p>

<p style="margin-bottom: 20px;">¡Esperamos su activa participación en SPLAGen!</p>
`,

  portuguese: `
<p style="margin-bottom: 20px;">Prezado/a [Recipient],</p>

<p style="margin-bottom: 20px;"><strong>[ReplierName]</strong> respondeu à publicação "[DiscussionTitle]":</p>

<div style="margin: 30px 0; padding: 20px; background-color: #f5f5f5;">
  <p style="margin: 0; white-space: pre-wrap;">[ReplyMessage]</p>
</div>

<p style="margin-bottom: 20px;">Para ver a discussão completa, responder ou cancelar a assinatura das notificações por e-mail, acesse: <a href="[DiscussionUrl]" style="color: blue;">[DiscussionUrl]</a></p>

<p style="margin-bottom: 20px;">Aguardamos sua participação ativa no SPLAGen!</p>
`,
};

export {
  ADMIN_INVITE_EMAIL,
  ADMIN_REMOVAL_EMAIL,
  DIRECTORY_APPROVAL_EMAIL,
  RECIPIENT_TEXT,
  SIGN_OFF_HTML,
  DIRECTORY_DENIAL_EMAIL,
  REASON_TEXT,
  PORTAL_LINK,
  NEW_ANNOUNCEMENT_EMAIL,
  AUTHOR_NAME,
  ANNOUNCEMENT_TITLE,
  ANNOUNCEMENT_MESSAGE,
  ANNOUNCEMENT_URL,
  NEW_DISCUSSION_REPLY_EMAIL,
  REPLIER_NAME,
  DISCUSSION_TITLE,
  REPLY_MESSAGE,
  DISCUSSION_URL,
  DIRECTORY_REMOVAL_EMAIL,
  ACCOUNT_DELETION_EMAIL,
};
