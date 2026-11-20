
const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);

const signature = `
  <table cellpadding="0" cellspacing="0" style="margin-top:24px;border-top:1px solid #e5e7eb;padding-top:18px;font-family:Arial,sans-serif;">
    <tr>
      <td>
        <a href="https://pledgepilot.online" style="text-decoration:none;">
          <img src="https://pledgepilot.online/images/pledgepilot-logo.png"
            alt="PledgePilot" width="150"
            style="display:block;border:0;max-width:150px;height:auto;">
        </a>
        <p style="margin:12px 0 4px;color:#142d50;font-size:15px;font-weight:bold;">
          PledgePilot Team
        </p>
        <p style="margin:0 0 5px;color:#64748b;font-size:13px;">
          Crowdfunding Growth &amp; Marketing
        </p>
        <p style="margin:0 0 12px;color:#64748b;font-size:12px;">
          Kickstarter | Indiegogo
        </p>
        <p style="margin:0 0 12px;font-size:12px;">
          <a href="https://www.instagram.com/pledgepilot/" style="color:#2563eb;text-decoration:none;">Instagram</a>
          &nbsp;|&nbsp;
          <a href="https://www.facebook.com/profile.php?id=61594922333588" style="color:#2563eb;text-decoration:none;">Facebook</a>
          &nbsp;|&nbsp;
          <a href="https://www.tiktok.com/@pledgepilot" style="color:#2563eb;text-decoration:none;">TikTok</a>
          &nbsp;|&nbsp;
          <a href="https://x.com/PledgePilot" style="color:#2563eb;text-decoration:none;">X</a>
          &nbsp;|&nbsp;
          <a href="https://wa.me/15709271401" style="color:#2563eb;text-decoration:none;">WhatsApp</a>
        </p>
        <p style="margin:0;color:#2563eb;font-size:12px;font-weight:bold;letter-spacing:1px;">
          ELEVATE YOUR SUCCESS
        </p>
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

    if (name.length > 120 || email.length > 254 ||
        link.length > 2048 || stage.length > 100 ||
        message.length > 5000) {
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

    // Notify the PledgePilot team.
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
      text: `New PledgePilot enquiry\n\nCreator: ${name}\nEmail: ${email}\nProject link: ${link || "Not provided"}\nCampaign stage: ${stage}\n\nRequirements:\n${message}`
    });

    // Confirm receipt to the creator.
    let confirmationSent = false;

    try {
      await sendEmail({
        from: "PledgePilot <contact@pledgepilot.online>",
        to: [email],
        subject: "We've received your PledgePilot enquiry",
        html: `
          <div style="font-family:Arial,sans-serif;color:#334155;line-height:1.7;">
            <h2 style="color:#142d50;">Thank you for contacting PledgePilot, ${safeName}.</h2>
            <p>We've successfully received your project enquiry.</p>
            <p>Our team will review the information you've shared and get back to you regarding the next steps.</p>
            <p>Thank you for considering PledgePilot for your crowdfunding journey.</p>
            ${signature}
          </div>
        `,
        text: `Hello ${name},\n\nThank you for contacting PledgePilot. We've received your project enquiry and our team will review it and get back to you regarding the next steps.\n\nPledgePilot Team`
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
      { success: false, message: "We couldn't process your enquiry. Please try again." },
      { status: 502 }
    );
  }
}
