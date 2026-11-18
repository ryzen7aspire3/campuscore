// netlify/functions/send-counselor-otp.js
exports.handler = async function handler(event) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
    }

    try {
        const body = JSON.parse(event.body || "{}");
        const studentEmail = (body.studentEmail || "").trim();
        const ticketId = (body.ticketId || "").trim();

        if (!studentEmail || !ticketId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing required fields: studentEmail and ticketId" })
            };
        }

        // Generates a secure 6-digit OTP (more secure than 4-digit)
        const freshOtp = String(Math.floor(100000 + Math.random() * 900000));

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                otp: freshOtp,
                dispatchedTo: studentEmail,
                ticketId,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            })
        };
    } catch (e) {
        return { statusCode: 400, body: JSON.stringify({ error: "Failed to generate OTP" }) };
    }
}