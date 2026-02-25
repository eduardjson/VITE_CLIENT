import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/movements/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/movements/"!</div>
}
