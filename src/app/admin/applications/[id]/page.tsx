import { notFound } from "next/navigation";
import { APPLICATIONS } from "@/lib/admin-data";
import ApplicationDetailClient from "./detail-client";

export function generateStaticParams() {
  return APPLICATIONS.map((a) => ({ id: a.id }));
}

export default async function ApplicationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const a = APPLICATIONS.find((x) => x.id === id);

  if (!a) notFound();

  return <ApplicationDetailClient initialApplication={a} />;
}
