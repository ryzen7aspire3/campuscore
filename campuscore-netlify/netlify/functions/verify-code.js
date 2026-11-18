// netlify/functions/verify-code.js
const SECRET_CMS_VAULT = {
    // PRINCIPAL CODES (Supreme Command over Home Campus + Read-Only All Campuses)
    "CMS@ASHF#PRIN!N3J7": { campus: "Asharfabad Campus", role: "PRINCIPAL" },
    "CMS@AYDR#PRIN!F8L2": { campus: "Ayodhya Road Campus", role: "PRINCIPAL" },
    "CMS@CHWK#PRIN!C4W9": { campus: "Chowk Campus", role: "PRINCIPAL" },
    "CMS@GLFC#PRIN!R5Z9": { campus: "Golf City Campus", role: "PRINCIPAL" },
    "CMS@GMT1#PRIN!H7P4": { campus: "Gomti Nagar I Campus", role: "PRINCIPAL" },
    "CMS@GMEX#PRIN!W2K8": { campus: "Gomti Nagar Extension Campus", role: "PRINCIPAL" },
    "CMS@IND1#PRIN!C6Y3": { campus: "Indira Nagar I Campus", role: "PRINCIPAL" },
    "CMS@IND2#PRIN!V9M5": { campus: "Indira Nagar II Campus", role: "PRINCIPAL" },
    "CMS@JNKP#PRIN!Q4T7": { campus: "Jankipuram Campus", role: "PRINCIPAL" },
    "CMS@JOPL#PRIN!L8X2": { campus: "Jopling Road Campus", role: "PRINCIPAL" },
    "CMS@KNPR#PRIN!D5W9": { campus: "Kanpur Road Campus", role: "PRINCIPAL" },
    "CMS@MHNG#PRIN!Z3F6": { campus: "Mahanagar Campus", role: "PRINCIPAL" },
    "CMS@RJP1#PRIN!G7N4": { campus: "Rajajipuram I Campus", role: "PRINCIPAL" },
    "CMS@RJP2#PRIN!Y2B8": { campus: "Rajajipuram II Campus", role: "PRINCIPAL" },
    "CMS@RDSO#PRIN!J9K5": { campus: "RDSO Campus", role: "PRINCIPAL" },
    "CMS@SHLM#PRIN!U4C7": { campus: "Shalimar OneWorld Campus", role: "PRINCIPAL" },
    "CMS@STRD#PRIN!E6V9": { campus: "Station Road Campus", role: "PRINCIPAL" },

    // TEACHER CODES (Edit Home Campus + View All Campuses)
    "CMS@ALG1#TEACH!4XR82N": { campus: "Aliganj I Campus", role: "TEACHER" },
    "CMS@ALG2#TEACH!6PK39W": { campus: "Aliganj II Campus", role: "TEACHER" },
    "CMS@ANDN#TEACH!2VF85K": { campus: "Anand Nagar Campus", role: "TEACHER" },
    "CMS@ASHF#TEACH!7NZ41Q": { campus: "Asharfabad Campus", role: "TEACHER" },
    "CMS@AYDR#TEACH!5LW93M": { campus: "Ayodhya Road Campus", role: "TEACHER" },
    "CMS@CHWK#TEACH!8CH12K": { campus: "Chowk Campus", role: "TEACHER" },
    "CMS@GLFC#TEACH!8RJ26X": { campus: "Golf City Campus", role: "TEACHER" },
    "CMS@GMT1#TEACH!3YK74P": { campus: "Gomti Nagar I Campus", role: "TEACHER" },
    "CMS@GMEX#TEACH!9FV52R": { campus: "Gomti Nagar Extension Campus", role: "TEACHER" },
    "CMS@IND1#TEACH!6QW38Z": { campus: "Indira Nagar I Campus", role: "TEACHER" },
    "CMS@IND2#TEACH!4MN79K": { campus: "Indira Nagar II Campus", role: "TEACHER" },
    "CMS@JNKP#TEACH!2TX86V": { campus: "Jankipuram Campus", role: "TEACHER" },
    "CMS@JOPL#TEACH!7KR43N": { campus: "Jopling Road Campus", role: "TEACHER" },
    "CMS@KNPR#TEACH!5ZP91W": { campus: "Kanpur Road Campus", role: "TEACHER" },
    "CMS@MHNG#TEACH!8VL24J": { campus: "Mahanagar Campus", role: "TEACHER" },
    "CMS@RJP1#TEACH!3NX67Q": { campus: "Rajajipuram I Campus", role: "TEACHER" },
    "CMS@RJP2#TEACH!9MW42F": { campus: "Rajajipuram II Campus", role: "TEACHER" },
    "CMS@RDSO#TEACH!6YP83K": { campus: "RDSO Campus", role: "TEACHER" },
    "CMS@SHLM#TEACH!4RJ95X": { campus: "Shalimar OneWorld Campus", role: "TEACHER" },
    "CMS@STRD#TEACH!7QK31V": { campus: "Station Road Campus", role: "TEACHER" },

    // STUDENT CODES (Requires Step 2 Gmail Sign-In; Edit Home Campus + Global Digital Library)
    "CMS@ALG1#STUD!4XR82N": { campus: "Aliganj I Campus", role: "STUDENT" },
    "CMS@ALG2#STUD!6PK39W": { campus: "Aliganj II Campus", role: "STUDENT" },
    "CMS@ANDN#STUD!2VF85K": { campus: "Anand Nagar Campus", role: "STUDENT" },
    "CMS@ASHF#STUD!7NZ41Q": { campus: "Asharfabad Campus", role: "STUDENT" },
    "CMS@AYDR#STUD!5LW93M": { campus: "Ayodhya Road Campus", role: "STUDENT" },
    "CMS@CHWK#STUD!8CH12K": { campus: "Chowk Campus", role: "STUDENT" },
    "CMS@GLFC#STUD!8RJ26X": { campus: "Golf City Campus", role: "STUDENT" },
    "CMS@GMT1#STUD!3YK74P": { campus: "Gomti Nagar I Campus", role: "STUDENT" },
    "CMS@GMEX#STUD!9FV52R": { campus: "Gomti Nagar Extension Campus", role: "STUDENT" },
    "CMS@IND1#STUD!6QW38Z": { campus: "Indira Nagar I Campus", role: "STUDENT" },
    "CMS@IND2#STUD!4MN79K": { campus: "Indira Nagar II Campus", role: "STUDENT" },
    "CMS@JNKP#STUD!2TX86V": { campus: "Jankipuram Campus", role: "STUDENT" },
    "CMS@JOPL#STUD!7KR43N": { campus: "Jopling Road Campus", role: "STUDENT" },
    "CMS@KNPR#STUD!5ZP91W": { campus: "Kanpur Road Campus", role: "STUDENT" },
    "CMS@MHNG#STUD!8VL24J": { campus: "Mahanagar Campus", role: "STUDENT" },
    "CMS@RJP1#STUD!3NX67Q": { campus: "Rajajipuram I Campus", role: "STUDENT" },
    "CMS@RJP2#STUD!9MW42F": { campus: "Rajajipuram II Campus", role: "STUDENT" },
    "CMS@RDSO#STUD!6YP83K": { campus: "RDSO Campus", role: "STUDENT" },
    "CMS@SHLM#STUD!4RJ95X": { campus: "Shalimar OneWorld Campus", role: "STUDENT" },
    "CMS@STRD#STUD!7QK31V": { campus: "Station Road Campus", role: "STUDENT" },

    // COUNSELOR MASTER CODE (Cross-Campus Private Counseling Access Only)
    "CMS@COUNSELOR#ALL!X9P7K2V8": { campus: "All Campuses (Central)", role: "COUNSELOR" }
};

exports.handler = async function handler(event) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
    }

    try {
        const body = JSON.parse(event.body || "{}");
        const code = (body.code || "").trim();

        if (!code) {
            return {
                statusCode: 400,
                body: JSON.stringify({ verified: false, error: "Access code is required." })
            };
        }

        const match = SECRET_CMS_VAULT[code];

        if (!match) {
            return {
                statusCode: 401,
                body: JSON.stringify({ verified: false, error: "Invalid Access Code. Contact the Creator." })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                verified: true,
                campus: match.campus,
                role: match.role
            })
        };
    } catch (err) {
        return { statusCode: 400, body: JSON.stringify({ error: "Bad Request" }) };
    }
}