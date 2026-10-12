import { NextResponse } from "next/server";
import { turso } from "@/lib/turso";
import { sendInterviewFeedbackEmail } from "@/lib/email";
import { formatToIST, invalidateAdminCache } from "@/lib/admin-data";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      applicationId,
      reviewer = "Reviewer",
      reviewerEmail = "",
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

    // Determine target status: if decision was specified, use it.
    // If not specified, but the applicant is currently in "New", advance to "Interview" automatically.
    let targetStatus = decision;
    if (!targetStatus) {
      const appCheck = await turso.execute({
        sql: "SELECT status FROM applications WHERE id = ?",
        args: [applicationId],
      });
      if (appCheck.rows.length > 0 && String(appCheck.rows[0].status) === "New") {
        targetStatus = "Interview";
      }
    }

    // Fallback: If reviewer name is not provided or is generic, use their email address
    const effectiveReviewer = (reviewer && reviewer !== "Reviewer" && reviewer !== "Vinay Siddha")
      ? reviewer
      : (reviewerEmail || "Panel Reviewer");

    // 1. Check if an existing review exists for this application by this reviewer or placeholder
    const cleanEmail = (reviewerEmail || "").toLowerCase().trim();
    const cleanReviewer = (effectiveReviewer || "").toLowerCase().trim();

    const existingCheck = await turso.execute({
      sql: `SELECT id FROM reviews WHERE application_id = ? AND (
              (? != '' AND LOWER(reviewer_email) = ?) OR
              LOWER(reviewer) = ? OR
              (reviewer = 'Vinay Siddha' AND ? != 'Vinay Siddha')
            ) ORDER BY id DESC LIMIT 1`,
      args: [applicationId, cleanEmail, cleanEmail, cleanReviewer, effectiveReviewer],
    });

    if (existingCheck.rows.length > 0) {
      const existingId = existingCheck.rows[0].id;
      await turso.execute({
        sql: `
          UPDATE reviews SET
            reviewer = ?,
            reviewer_email = ?,
            rating_skills = ?,
            rating_motivation = ?,
            rating_communication = ?,
            rating_fit = ?,
            average_score = ?,
            note = ?,
            decision = ?,
            created_at = datetime('now')
          WHERE id = ?
        `,
        args: [
          effectiveReviewer,
          reviewerEmail,
          ratingSkills || 0,
          ratingMotivation || 0,
          ratingCommunication || 0,
          ratingFit || 0,
          avgScore,
          note,
          targetStatus || "In review",
          existingId,
        ],
      });
    } else {
      await turso.execute({
        sql: `
          INSERT INTO reviews (
            application_id, reviewer, reviewer_email,
            rating_skills, rating_motivation, rating_communication, rating_fit,
            average_score, note, decision, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `,
        args: [
          applicationId,
          effectiveReviewer,
          reviewerEmail,
          ratingSkills || 0,
          ratingMotivation || 0,
          ratingCommunication || 0,
          ratingFit || 0,
          avgScore,
          note,
          targetStatus || "In review",
        ],
      });
    }

    // 2. Immediately update the application's status in database
    if (targetStatus) {
      await turso.execute({
        sql: `UPDATE applications SET status = ? WHERE id = ?`,
        args: [targetStatus, applicationId],
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

    invalidateAdminCache();

    // 4. Return the newly created/updated review object
    const createdReview = {
      reviewer: effectiveReviewer,
      reviewerEmail,
      reviewerColor: "#4285F4",
      score: Math.round(avgScore),
      ratings: [
        ratingSkills || 0,
        ratingMotivation || 0,
        ratingCommunication || 0,
        ratingFit || 0,
      ],
      recommend: (decision === "Accepted" ? "Yes" : decision === "Rejected" ? "No" : "Maybe") as "Yes" | "Maybe" | "No",
      decision: targetStatus,
      note,
      date: formatToIST(new Date()),
      createdAt: new Date().toISOString(),
      timeIST: formatToIST(new Date()),
    };

    return NextResponse.json({
      ok: true,
      review: createdReview,
      status: targetStatus,
      message: "Review persisted to Turso database and status updated",
    });
  } catch (error) {
    console.error("Turso review error:", error);
    return NextResponse.json({ error: "Wait some time and try again." }, { status: 500 });
  }
}
