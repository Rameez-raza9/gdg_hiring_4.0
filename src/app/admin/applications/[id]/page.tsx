import { notFound } from "next/navigation";
import { fetchLiveApplications, APPLICATIONS } from "@/lib/admin-data";
import ApplicationDetailClient from "./detail-client";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return APPLICATIONS.map((a) => ({ id: a.id }));
}

export default async function ApplicationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const applications = await fetchLiveApplications();
  const a = applications.find((x) => x.id === id);

  if (!a) notFound();

  return <ApplicationDetailClient initialApplication={a} />;
}
