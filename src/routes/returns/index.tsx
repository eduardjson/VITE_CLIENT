import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/returns/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/returns/"!</div>
}
