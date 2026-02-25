import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/prices/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/prices/"!</div>
}
