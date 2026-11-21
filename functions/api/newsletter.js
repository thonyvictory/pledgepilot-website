
const RESEND_API = "https://api.resend.com";

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

async function resendRequest(path, apiKey, options = {}) {
  const response = await fetch(`${RESEND_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message || data.error || `Resend API error (${response.status})`
    );
    error.status = response.status;
    throw error;
  }

  return data;
}

async function sendEmail(apiKey, { to, subject, html }) {
  return resendRequest("/emails", apiKey, {
    method: "POST",
    body: JSON.stringify({
      from: "PledgePilot <contact@pledgepilot.online>",
      to: [to],
      subject,
      html,
    }),
  });
}

export async function onRequestPost({ request, env }) {
  try {
    const apiKey = env.RESEND_API_KEY;
    const segmentId = env.RESEND_SEGMENT_ID;

    if (!apiKey || !segmentId) {
      return jsonResponse({
        success: false,
        message: "Newsletter service is not configured.",
      }, 500);
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return jsonResponse({
        success: false,
        message: "Invalid request. Please enter a valid email address.",
      }, 400);
    }

    const email = String(body.email || "").trim().toLowerCase();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailPattern.test(email) || email.length > 254) {
      return jsonResponse({
        success: false,
        message: "Please enter a valid email address.",
      }, 400);
    }

    let contact;
    let isNewContact = false;

    // First, try to create the contact directly in the newsletter segment.
    try {
      contact = await resendRequest("/contacts", apiKey, {
        method: "POST",
        body: JSON.stringify({
          email,
          unsubscribed: false,
          segments: [{ id: segmentId }],
        }),
      });

      isNewContact = true;
    } catch (error) {
      if (error.status !== 409) {
        throw error;
      }

      // The contact already exists. Retrieve the existing record.
      contact = await resendRequest(
        `/contacts/${encodeURIComponent(email)}`,
        apiKey
      );
    }

    const contactId = contact.id || contact.data?.id;

    if (!contactId) {
      throw new Error("Resend did not return a valid contact ID.");
    }

    // Do not automatically resubscribe someone who previously unsubscribed.
    if (contact.unsubscribed === true || contact.data?.unsubscribed === true) {
      return jsonResponse({
        success: false,
        message: "This email address has previously unsubscribed. Please contact us if you wish to change your subscription.",
      }, 409);
    }

    let alreadySubscribed = false;

    if (!isNewContact) {
      const segmentData = await resendRequest(
        `/contacts/${encodeURIComponent(contactId)}/segments`,
        apiKey
      );

      const segments = segmentData.data || [];

      alreadySubscribed = segments.some(
        (segment) => segment.id === segmentId
      );

      if (!alreadySubscribed) {
        await resendRequest(
          `/contacts/${encodeURIComponent(contactId)}/segments/${encodeURIComponent(segmentId)}`,
          apiKey,
          { method: "POST" }
        );
      }
    }

    // An existing subscriber should not receive repeated welcome emails.
    if (alreadySubscribed) {
      return jsonResponse({
        success: true,
        alreadySubscribed: true,
        message: "This email address is already subscribed.",
      });
    }

    const safeEmail = escapeHtml(email);

    const welcomeHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#243047;line-height:1.7;">
        <h2 style="color:#183b70;">Welcome to PledgePilot.</h2>
        <p>Thank you for subscribing to The PledgePilot Brief.</p>
        <p>You'll receive practical crowdfunding insights, campaign strategies and marketing updates to help you make more informed decisions about your next campaign.</p>
        <p>We're glad to have you with us.</p>
        <p>Best regards,<br><strong>PledgePilot Team</strong></p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
        <p style="font-size:12px;color:#777;">
          PledgePilot | Strategic Crowdfunding Marketing<br>
          <a href="https://pledgepilot.online">pledgepilot.online</a><br>
          <a href="mailto:contact@pledgepilot.online">contact@pledgepilot.online</a>
        </p>
      </div>
    `;

    const notificationHtml = `
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#243047;">
        <h2>New PledgePilot Newsletter Subscriber</h2>
        <p>A new person has subscribed through the website newsletter form.</p>
        <p><strong>Email address:</strong> ${safeEmail}</p>
        <p><strong>Newsletter segment:</strong> PledgePilot Newsletter Subscribers</p>
        <p><strong>Source:</strong> pledgepilot.online</p>
      </div>
    `;

    // Attempt both emails independently. A delivery issue must not undo
    // a successful newsletter subscription.
    const [welcomeResult, notificationResult] = await Promise.allSettled([
      sendEmail(apiKey, {
        to: email,
        subject: "Welcome to The PledgePilot Brief",
        html: welcomeHtml,
      }),
      sendEmail(apiKey, {
        to: "contact@pledgepilot.online",
        subject: "New PledgePilot Newsletter Subscriber",
        html: notificationHtml,
      }),
    ]);

    return jsonResponse({
      success: true,
      alreadySubscribed: false,
      welcomeSent: welcomeResult.status === "fulfilled",
      ownerNotified: notificationResult.status === "fulfilled",
      message: "Your newsletter subscription was successful.",
    });

  } catch (error) {
    console.error("Newsletter subscription error:", error);

    return jsonResponse({
      success: false,
      message: "We couldn't complete your subscription right now. Please try again later.",
    }, 500);
  }
}
