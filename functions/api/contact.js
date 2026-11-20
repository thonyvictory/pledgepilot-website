
const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);

const signature = `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0"
    style="width:100%;max-width:620px;margin-top:26px;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;">
    <tr>
      <td style="border-top:1px solid #dbe3ef;padding-top:18px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;">
          <tr>
            <td width="165" valign="middle" style="width:165px;padding:8px 18px 8px 0;border-right:2px solid #1764df;">
              <a href="https://pledgepilot.online" target="_blank" style="text-decoration:none;">
                <img src="https://pledgepilot.online/images/pledgepilot-logo.png"
                  alt="PledgePilot — pledgepilot.online"
                  width="145"
                  style="display:block;width:145px;max-width:145px;height:auto;border:0;outline:none;text-decoration:none;">
              </a>
              <div style="padding-top:7px;">
                <a href="https://pledgepilot.online" target="_blank"
                  style="color:#1764df;font-size:12px;font-weight:bold;text-decoration:none;">
                  pledgepilot.online
                </a>
              </div>
            </td>

            <td valign="middle" style="padding:6px 0 6px 20px;">
              <div style="font-size:25px;line-height:1.2;font-weight:700;letter-spacing:-0.5px;color:#14264f;">
                <span style="color:#1764df;">Pledge</span>Pilot Team
              </div>

              <div style="padding-top:8px;font-size:15px;line-height:1.5;color:#14264f;">
                Crowdfunding Growth &amp; Marketing
              </div>

              <div style="padding-top:3px;font-size:15px;line-height:1.5;font-weight:700;color:#14264f;">
                Kickstarter <span style="color:#1764df;">|</span> Indiegogo
              </div>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0"
                style="margin-top:14px;border-collapse:collapse;">
                <tr>
                  <td style="padding:0 10px 0 0;">
                    <a href="https://www.instagram.com/pledgepilot/" target="_blank" aria-label="Instagram">
                      <img src="https://cdn.simpleicons.org/instagram/E4405F"
                        width="27" height="27" alt="Instagram"
                        style="display:block;width:27px;height:27px;border:0;">
                    </a>
                  </td>

                  <td style="border-left:1px solid #aab6ca;padding:0 10px;">
                    <a href="https://web.facebook.com/profile.php?id=61594922333588" target="_blank" aria-label="Facebook">
                      <img src="https://cdn.simpleicons.org/facebook/1877F2"
                        width="27" height="27" alt="Facebook"
                        style="display:block;width:27px;height:27px;border:0;">
                    </a>
                  </td>

                  <td style="border-left:1px solid #aab6ca;padding:0 10px;">
                    <a href="https://www.tiktok.com/@pledgepilot" target="_blank" aria-label="TikTok">
                      <img src="https://cdn.simpleicons.org/tiktok/111111"
                        width="27" height="27" alt="TikTok"
                        style="display:block;width:27px;height:27px;border:0;">
                    </a>
                  </td>

                  <td style="border-left:1px solid #aab6ca;padding:0 10px;">
                    <a href="https://x.com/PledgePilot" target="_blank" aria-label="X">
                      <img src="https://cdn.simpleicons.org/x/111111"
                        width="27" height="27" alt="X"
                        style="display:block;width:27px;height:27px;border:0;">
                    </a>
                  </td>

                  <td style="border-left:1px solid #aab6ca;padding:0 0 0 10px;">
                    <a href="https://wa.me/15709271401" target="_blank" aria-label="WhatsApp">
                      <img src="https://cdn.simpleicons.org/whatsapp/25D366"
                        width="27" height="27" alt="WhatsApp"
                        style="display:block;width:27px;height:27px;border:0;">
                    </a>
                  </td>
                </tr>
              </table>

              <div style="margin-top:14px;padding:9px 14px;background:#0758d8;color:#ffffff;font-size:14px;line-height:1.4;font-weight:700;letter-spacing:2px;text-align:center;">
                ELEVATE YOUR SUCCESS
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
`;

export async function onRequestPost({ request, env }) {
  try {
    if (!env.RESEND_API_KEY) {
      return Response.json(
        { success: false, message: "Email service is not configured." },
        { status: 500 }
      );
    }

    const data = await request.json();

    const name = String(data.name || "").trim();
    const email = String(data.email || "").trim();
    const link = String(data.link || "").trim();
    const stage = String(data.stage || "").trim();
    const message = String(data.message || "").trim();

    if (!name || !email || !stage || !message) {
      return Response.json(
        { success: false, message: "Please complete all required fields." },
        { status: 400 }
      );
    }

    if (
      name.length > 120 ||
      email.length > 254 ||
      link.length > 2048 ||
      stage.length > 100 ||
      message.length > 5000
    ) {
      return Response.json(
        { success: false, message: "One or more fields are too long." },
        { status: 400 }
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return Response.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (link) {
      let parsedLink;

      try {
        parsedLink = new URL(link);
      } catch {
        return Response.json(
          { success: false, message: "Please enter a valid project link." },
          { status: 400 }
        );
      }

      if (!["http:", "https:"].includes(parsedLink.protocol)) {
        return Response.json(
          { success: false, message: "Please enter a valid project link." },
          { status: 400 }
        );
      }
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeLink = escapeHtml(link);
    const safeStage = escapeHtml(stage);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

    const sendEmail = async (payload) => {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Email delivery failed.");
      }

      return result;
    };

    // Send enquiry notification to PledgePilot.
    await sendEmail({
      from: "PledgePilot <contact@pledgepilot.online>",
      to: ["contact@pledgepilot.online"],
      reply_to: email,
      subject: `New project enquiry from ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;color:#1e293b;line-height:1.7;">
          <h2 style="color:#142d50;">New Project Enquiry</h2>
          <p>You have received a new enquiry through the PledgePilot website.</p>
          <p><strong>Creator name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Project link:</strong> ${safeLink || "Not provided"}</p>
          <p><strong>Campaign stage:</strong> ${safeStage}</p>
          <p><strong>Project requirements:</strong><br>${safeMessage}</p>
          ${signature}
        </div>
      `,
      text: `New PledgePilot enquiry

Creator: ${name}
Email: ${email}
Project link: ${link || "Not provided"}
Campaign stage: ${stage}

Requirements:
${message}`
    });

    // Send confirmation email to the creator.
    let confirmationSent = false;

    try {
      await sendEmail({
        from: "PledgePilot <contact@pledgepilot.online>",
        to: [email],
        subject: "We've received your PledgePilot enquiry",
        html: `
          <div style="font-family:Arial,sans-serif;color:#334155;line-height:1.7;">
            <h2 style="color:#142d50;">
              Thank you for contacting PledgePilot, ${safeName}.
            </h2>
            <p>We've successfully received your project enquiry.</p>
            <p>Our team will review the information you've shared and get back to you regarding the next steps.</p>
            <p>Thank you for considering PledgePilot for your crowdfunding journey.</p>
            ${signature}
          </div>
        `,
        text: `Hello ${name},

Thank you for contacting PledgePilot. We've received your project enquiry and our team will review it and get back to you regarding the next steps.

PledgePilot Team
https://pledgepilot.online`
      });

      confirmationSent = true;
    } catch (error) {
      console.error("Visitor confirmation email failed:", error.message);
    }

    return Response.json({
      success: true,
      message: "Your enquiry has been received successfully.",
      confirmationSent
    });

  } catch (error) {
    console.error("Contact form error:", error.message);

    return Response.json(
      {
        success: false,
        message: "We couldn't process your enquiry. Please try again."
      },
      { status: 502 }
    );
  }
}
