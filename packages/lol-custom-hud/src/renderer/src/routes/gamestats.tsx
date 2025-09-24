import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/gamestats")({
    component: RouteComponent,
});

function RouteComponent(): React.JSX.Element {
    return <div>Hello gamestats!</div>;
}
