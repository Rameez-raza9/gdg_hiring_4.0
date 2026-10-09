"use client";

import React, { useState } from "react";
import { Form, Field as FormischField, useForm, setInput } from "@formisch/react";
import type { SubmitHandler } from "@formisch/react";
import * as v from "valibot";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Code2,
  Megaphone,
} from "lucide-react";
import { Dot12 } from "@/components/AnimatedDots";
import ComboboxCreatableDemo from "@/components/ComboboxCreatableDemo";

// ── Valibot Schema ───────────────────────────────────────────────────────────
const HiringFormSchema = v.object({
  fullName: v.pipe(
    v.string(),
    v.nonEmpty("Please enter your full name."),
    v.minLength(3, "Name must be at least 3 characters.")
  ),
  email: v.pipe(
    v.string(),
    v.nonEmpty("Please enter your college email."),
    v.email("Enter a valid email address.")
  ),
  phone: v.pipe(
    v.string(),
    v.nonEmpty("Please enter your contact phone number."),
    v.minLength(10, "Please enter a valid 10-digit number.")
  ),
  rollNumber: v.pipe(
    v.string(),
    v.nonEmpty("College Roll / Registration number is required.")
  ),
  yearOfStudy: v.pipe(
    v.string(),
    v.nonEmpty("Please select your year of study.")
  ),
  trackType: v.pipe(
    v.string(),
    v.nonEmpty("Please select Technical or Non-Technical track.")
  ),
  role: v.pipe(
    v.string(),
    v.nonEmpty("Please select a specific role.")
  ),
  experienceUrl: v.optional(v.string()),
  whyJoin: v.pipe(
    v.string(),
    v.nonEmpty("Please explain why you want to join."),
    v.minLength(20, "Tell us a bit more (minimum 20 characters).")
  ),
  whatContribution: v.pipe(
    v.string(),
    v.nonEmpty("Please tell us what you plan to contribute."),
    v.minLength(20, "Tell us a bit more (minimum 20 characters).")
  ),
});

const TECH_ROLES = [
  "Web Development (Next.js / React)",
  "Android Development (Kotlin / Flutter)",
  "Cloud & DevOps (Google Cloud)",
  "AI / Machine Learning",
  "Cybersecurity",
];

const NON_TECH_ROLES = [
  "UI/UX & Product Design",
  "Event Management & Operations",
  "Public Relations & Outreach",
  "Content Writing & Documentation",
  "Social Media & Photography",
];

export default function HiringApplicationModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<"tech" | "non-tech">("tech");
  const [customSkillTag, setCustomSkillTag] = useState("");

  const form = useForm({
    schema: HiringFormSchema,
    validate: "blur",
    revalidate: "input",
    initialInput: {
      fullName: "",
      email: "",
      phone: "",
      rollNumber: "",
      yearOfStudy: "2nd Year",
      trackType: "Technical Track",
      role: TECH_ROLES[0],
      experienceUrl: "",
      whyJoin: "",
      whatContribution: "",
    },
  });

  const handleSubmit: SubmitHandler<typeof HiringFormSchema> = (output) => {
    console.log("[GDG SVEC Application Submitted]:", output);
    setIsSubmitted(true);
  };

  const currentRoleOptions = selectedTrack === "tech" ? TECH_ROLES : NON_TECH_ROLES;

  const handleModalClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => {
        setIsSubmitted(false);
        setStep(1);
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogTrigger asChild>
        <Button className="relative text-sm font-medium rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 w-fit overflow-hidden cursor-pointer bg-white text-black hover:bg-neutral-100 shadow-[0_0_24px_rgba(255,255,255,0.2)]">
          <span className="relative z-10 transition-all duration-500">
            Apply Now
          </span>
          <div className="absolute right-1 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
            <ArrowUpRight size={16} />
          </div>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[580px] border-neutral-800 bg-neutral-950 p-6 sm:p-7">
        {!isSubmitted ? (
          <>
            <DialogHeader className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-[10px] font-black text-black">
                    &lt;/&gt;
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                    GDGoC SVEC Hiring
                  </span>
                </div>
                {/* Step indicator with Mascot */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-neutral-400">
                    Step {step} of 3
                  </span>
                  <Dot12 size={30} followCursor={true} />
                </div>
              </div>
              <DialogTitle className="text-2xl font-bold text-white tracking-tight">
                {step === 1 && "Personal & Academic Info"}
                {step === 2 && "Choose Your Domain"}
                {step === 3 && "Why & What Will You Bring?"}
              </DialogTitle>
              <DialogDescription className="text-neutral-400 text-xs">
                {step === 1 && "Fill in your college details and contact info."}
                {step === 2 && "Select between technical engineering or community/creative roles."}
                {step === 3 && "Tell us about your drive and goals for the chapter."}
              </DialogDescription>

              {/* Progress Bar */}
              <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-white h-full transition-all duration-300 ease-out"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </DialogHeader>

            <Form of={form} onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* STEP 1: Personal & Contact */}
              {step === 1 && (
                <FieldGroup className="space-y-3.5">
                  <FormischField of={form} path={["fullName"]}>
                    {(field) => (
                      <Field data-invalid={field.errors !== null}>
                        <FieldLabel htmlFor="form-fullName">Full Name</FieldLabel>
                        <Input
                          {...field.props}
                          id="form-fullName"
                          value={field.input ?? ""}
                          placeholder="e.g. John Doe"
                          aria-invalid={field.errors !== null}
                        />
                        {field.errors && (
                          <FieldError errors={field.errors.map((msg) => ({ message: msg }))} />
                        )}
                      </Field>
                    )}
                  </FormischField>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormischField of={form} path={["email"]}>
                      {(field) => (
                        <Field data-invalid={field.errors !== null}>
                          <FieldLabel htmlFor="form-email">College Email</FieldLabel>
                          <Input
                            {...field.props}
                            id="form-email"
                            type="email"
                            value={field.input ?? ""}
                            placeholder="name@svec.edu.in"
                            aria-invalid={field.errors !== null}
                          />
                          {field.errors && (
                            <FieldError errors={field.errors.map((msg) => ({ message: msg }))} />
                          )}
                        </Field>
                      )}
                    </FormischField>

                    <FormischField of={form} path={["phone"]}>
                      {(field) => (
                        <Field data-invalid={field.errors !== null}>
                          <FieldLabel htmlFor="form-phone">WhatsApp / Phone</FieldLabel>
                          <Input
                            {...field.props}
                            id="form-phone"
                            type="tel"
                            value={field.input ?? ""}
                            placeholder="+91 9876543210"
                            aria-invalid={field.errors !== null}
                          />
                          {field.errors && (
                            <FieldError errors={field.errors.map((msg) => ({ message: msg }))} />
                          )}
                        </Field>
                      )}
                    </FormischField>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormischField of={form} path={["rollNumber"]}>
                      {(field) => (
                        <Field data-invalid={field.errors !== null}>
                          <FieldLabel htmlFor="form-rollNumber">Roll / Reg Number</FieldLabel>
                          <Input
                            {...field.props}
                            id="form-rollNumber"
                            value={field.input ?? ""}
                            placeholder="e.g. 22A81A05XX"
                            aria-invalid={field.errors !== null}
                          />
                          {field.errors && (
                            <FieldError errors={field.errors.map((msg) => ({ message: msg }))} />
                          )}
                        </Field>
                      )}
                    </FormischField>

                    <FormischField of={form} path={["yearOfStudy"]}>
                      {(field) => (
                        <Field data-invalid={field.errors !== null}>
                          <FieldLabel htmlFor="form-yearOfStudy">Year of Study</FieldLabel>
                          <select
                            {...field.props}
                            id="form-yearOfStudy"
                            value={field.input ?? "2nd Year"}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
                          >
                            <option value="1st Year">1st Year (B.Tech / Diploma)</option>
                            <option value="2nd Year">2nd Year (B.Tech)</option>
                            <option value="3rd Year">3rd Year (B.Tech)</option>
                            <option value="4th Year">4th Year (B.Tech)</option>
                          </select>
                        </Field>
                      )}
                    </FormischField>
                  </div>
                </FieldGroup>
              )}

              {/* STEP 2: Roles (Tech & Non-Tech) */}
              {step === 2 && (
                <FieldGroup className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 block mb-2">
                      Select Track Type
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTrack("tech");
                          fieldTrackChange("Technical Track", TECH_ROLES[0]);
                        }}
                        className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all ${
                          selectedTrack === "tech"
                            ? "border-white bg-neutral-900 text-white"
                            : "border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700"
                        }`}
                      >
                        <Code2 size={18} className={selectedTrack === "tech" ? "text-white" : "text-neutral-500"} />
                        <span className="text-sm font-semibold">Technical Track</span>
                        <span className="text-[11px] text-neutral-400">Web, Mobile, AI & Cloud</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTrack("non-tech");
                          fieldTrackChange("Non-Technical Track", NON_TECH_ROLES[0]);
                        }}
                        className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all ${
                          selectedTrack === "non-tech"
                            ? "border-white bg-neutral-900 text-white"
                            : "border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700"
                        }`}
                      >
                        <Megaphone size={18} className={selectedTrack === "non-tech" ? "text-white" : "text-neutral-500"} />
                        <span className="text-sm font-semibold">Non-Technical Track</span>
                        <span className="text-[11px] text-neutral-400">Design, PR, Events & Media</span>
                      </button>
                    </div>
                  </div>

                  <FormischField of={form} path={["role"]}>
                    {(field) => (
                      <Field data-invalid={field.errors !== null}>
                        <FieldLabel htmlFor="form-role">Target Role</FieldLabel>
                        <select
                          {...field.props}
                          id="form-role"
                          value={field.input ?? currentRoleOptions[0]}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setCustomSkillTag(e.target.value);
                          }}
                          className="flex h-10 w-full rounded-md border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
                        >
                          {currentRoleOptions.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                        <FieldDescription>
                          Choose the specialization where you want to lead or build.
                        </FieldDescription>
                      </Field>
                    )}
                  </FormischField>

                  {/* Creatable Skills & Domain Tag Combobox */}
                  <div>
                    <FieldLabel className="mb-1.5 block">
                      Custom Skill / Sub-Domain Tag (Creatable)
                    </FieldLabel>
                    <ComboboxCreatableDemo
                      value={customSkillTag}
                      onChange={(newTag) => {
                        setCustomSkillTag(newTag);
                        if (newTag) {
                          setInput(form, { path: ["role"], input: newTag });
                        }
                      }}
                      className="w-full max-w-full"
                      placeholder="Search or create custom domain tag (e.g. Next.js, Flutter)..."
                    />
                    <FieldDescription className="mt-1">
                      Filter existing tags or type and press Create to add a custom specialization.
                    </FieldDescription>
                  </div>

                  <FormischField of={form} path={["experienceUrl"]}>
                    {(field) => (
                      <Field data-invalid={field.errors !== null}>
                        <FieldLabel htmlFor="form-experienceUrl">
                          Portfolio / GitHub / LinkedIn URL (optional)
                        </FieldLabel>
                        <Input
                          {...field.props}
                          id="form-experienceUrl"
                          value={field.input ?? ""}
                          placeholder="https://github.com/your-username"
                          aria-invalid={field.errors !== null}
                        />
                      </Field>
                    )}
                  </FormischField>
                </FieldGroup>
              )}

              {/* STEP 3: Why & What */}
              {step === 3 && (
                <FieldGroup className="space-y-3.5">
                  <FormischField of={form} path={["whyJoin"]}>
                    {(field) => (
                      <Field data-invalid={field.errors !== null}>
                        <FieldLabel htmlFor="form-whyJoin">
                          Why do you want to join GDGoC SVEC?
                        </FieldLabel>
                        <Textarea
                          {...field.props}
                          id="form-whyJoin"
                          value={field.input ?? ""}
                          rows={3}
                          placeholder="What inspires you about Google developer technologies and student communities?"
                          aria-invalid={field.errors !== null}
                        />
                        {field.errors && (
                          <FieldError errors={field.errors.map((msg) => ({ message: msg }))} />
                        )}
                      </Field>
                    )}
                  </FormischField>

                  <FormischField of={form} path={["whatContribution"]}>
                    {(field) => (
                      <Field data-invalid={field.errors !== null}>
                        <FieldLabel htmlFor="form-whatContribution">
                          What will you bring or organize for the community?
                        </FieldLabel>
                        <Textarea
                          {...field.props}
                          id="form-whatContribution"
                          value={field.input ?? ""}
                          rows={3}
                          placeholder="E.g., hosting a workshop, organizing hackathons, mentoring juniors, designing creatives..."
                          aria-invalid={field.errors !== null}
                        />
                        {field.errors && (
                          <FieldError errors={field.errors.map((msg) => ({ message: msg }))} />
                        )}
                      </Field>
                    )}
                  </FormischField>
                </FieldGroup>
              )}

              {/* Navigation Controls */}
              <div className="pt-3 flex items-center justify-between border-t border-neutral-800">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                    className="text-neutral-400 hover:text-white hover:bg-neutral-900"
                  >
                    <ChevronLeft size={16} className="mr-1" /> Back
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpen(false)}
                    className="text-neutral-400 hover:text-white hover:bg-neutral-900"
                  >
                    Cancel
                  </Button>
                )}

                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
                    className="bg-white text-black hover:bg-neutral-200 font-semibold"
                  >
                    Next <ChevronRight size={16} className="ml-1" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-white text-black hover:bg-neutral-200 font-semibold px-5"
                  >
                    Submit Application
                  </Button>
                )}
              </div>
            </Form>
          </>
        ) : (
          /* Submission success view */
          <div className="py-8 flex flex-col items-center text-center space-y-4">
            <div className="flex items-center justify-center">
              <Dot12 size={64} followCursor={true} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Application Received! 🎉</h3>
              <p className="text-neutral-400 max-w-sm text-sm">
                Your application for GDGoC SVEC has been successfully submitted via Formisch. We&apos;ll be contacting shortlisted candidates soon.
              </p>
            </div>
            <Button
              onClick={() => handleModalClose(false)}
              className="mt-4 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  function fieldTrackChange(trackName: string, defaultRole: string) {
    setInput(form, {
      path: ["trackType"],
      input: trackName,
    });
    setInput(form, {
      path: ["role"],
      input: defaultRole,
    });
  }
}
