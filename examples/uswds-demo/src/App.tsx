import { uswdsComponents } from "@oddball/json-render-uswds";

const { Button, Card, Alert, Input, Heading, Text, Badge, Accordion, Table, Stack } = uswdsComponents;

export function App() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <Heading level="h1">USWDS Component Demo</Heading>
      <Text size="lg" color="muted">Built with @oddball/json-render-uswds</Text>

      <Stack direction="vertical" gap="lg">
        <Alert variant="info" title="Welcome">
          This demo showcases USWDS-styled components.
        </Alert>

        <Card title="Form Example" description="A simple form using USWDS inputs">
          <Stack direction="vertical" gap="md">
            <Input label="Full name" placeholder="Jane Doe" />
            <Input label="Email" type="email" placeholder="jane@example.gov" />
            <Button>Submit</Button>
          </Stack>
        </Card>

        <Card title="Status Badges">
          <Stack direction="horizontal" gap="sm">
            <Badge variant="success">Active</Badge>
            <Badge variant="warning">Pending</Badge>
            <Badge variant="error">Expired</Badge>
          </Stack>
        </Card>

        <Card title="Accordion">
          <Accordion
            type="single"
            items={[
              { value: "item-1", title: "First Section", content: "Content for the first section." },
              { value: "item-2", title: "Second Section", content: "Content for the second section." },
              { value: "item-3", title: "Third Section", content: "Content for the third section." },
            ]}
          />
        </Card>
      </Stack>
    </div>
  );
}
