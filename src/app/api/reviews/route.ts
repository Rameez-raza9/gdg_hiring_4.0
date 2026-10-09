import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";
import { sendInterviewFeedbackEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      applicationId,
      reviewer = "Vinay Siddha",
      reviewerEmail = "vinaysiddha19@gmail.com",
      ratings = [4, 4, 4, 4],
      note = "",
      decision = null,
    } = data;

    if (!applicationId) {
      return NextResponse.json({ error: "Missing applicationId" }, { status: 400 });
    }

    const [ratingSkills, ratingMotivation, ratingCommunication, ratingFit] = ratings;
    const avgScore =
      ratings.length > 0
        ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
        : 4.0;

    // 1. Insert review into Turso reviews table
    await turso.execute({
      sql: `
        INSERT INTO reviews (
          application_id, reviewer, reviewer_email,
          rating_skills, rating_motivation, rating_communication, rating_fit,
          average_score, note, decision
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        applicationId,
        reviewer,
        reviewerEmail,
        ratingSkills || 0,
        ratingMotivation || 0,
        ratingCommunication || 0,
        ratingFit || 0,
        avgScore,
        note,
        decision || "In review",
      ],
    });

    // 2. If a decision was made, immediately update the application's status
    if (decision) {
      await turso.execute({
        sql: `UPDATE applications SET status = ? WHERE id = ?`,
        args: [decision, applicationId],
      });
    }

    // 3. Fetch applicant email and name to send post-interview decision email
    try {
      const appRes = await turso.execute({
        sql: "SELECT name, email FROM applications WHERE id = ?",
        args: [applicationId],
      });

      if (appRes.rows.length > 0) {
        const studentName = String(appRes.rows[0].name || "Student");
        const studentEmail = String(appRes.rows[0].email || "");

        if (studentEmail && decision) {
          await sendInterviewFeedbackEmail({
            toEmail: studentEmail,
            studentName,
            decision,
          });
        }
      }
    } catch (mailErr) {
      console.error("Error dispatching interview feedback email:", mailErr);
    }

    // 4. Return the newly created review object
    const createdReview = {
      reviewer,
      reviewerColor: "#4285F4",
      score: Math.round(avgScore),
      recommend: (decision === "Accepted" ? "Yes" : decision === "Rejected" ? "No" : "Maybe") as "Yes" | "Maybe" | "No",
      note,
      date: new Date().toISOString().slice(0, 10),
    };

    return NextResponse.json({
      ok: true,
      review: createdReview,
      status: decision,
      message: "Review persisted to Turso database and feedback email sent",
    });
  } catch (error) {
    console.error("Turso review error:", error);
    return NextResponse.json({ error: "Wait some time and try again." }, { status: 500 });
  }
}
