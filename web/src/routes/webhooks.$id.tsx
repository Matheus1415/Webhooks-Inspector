import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { WebhookDetails } from "../components/webhook-details";
import { WebhookDetailsSkeleton } from "../components/WebhookDetailsSkeleton";

export const Route = createFileRoute("/webhooks/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();

	return (
		<Suspense fallback={<WebhookDetailsSkeleton />}>
			<WebhookDetails id={id} />
		</Suspense>
	);
}
