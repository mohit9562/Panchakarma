require("dotenv").config();
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const sendAppointmentSMS = async (to, appointmentDate, preInstructions) => {
  try {
    const preInstructionsText = preInstructions.join("\n- ");
    const messageBody = `
Dear Patient,

Your appointment is confirmed for ${new Date(appointmentDate).toDateString()}.

Pre-treatment Precautions:
- ${preInstructionsText}

Best regards,
Your Clinic
`;

    await client.messages.create({
      body: messageBody,
      from: twilioNumber,
      to: to,
    });

    console.log("SMS sent successfully!");
  } catch (error) {
    console.error("Error sending SMS:", error);
    // You might want to log this error to an external service
  }
};

module.exports = {
  sendAppointmentSMS,
};
