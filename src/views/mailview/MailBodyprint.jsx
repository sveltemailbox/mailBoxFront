import React, { useEffect } from "react";

function MailBodyPrint({ body, mail_id }) {
  useEffect(() => {}, [mail_id]);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  );
}

export default MailBodyPrint;
